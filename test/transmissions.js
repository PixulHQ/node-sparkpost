'use strict';

const Sinon = require('sinon');
const Code  = require('@hapi/code');
const Lab   = require('@hapi/lab');

const { describe, it, beforeEach } = exports.lab = Lab.script();
const { expect }                   = Code;

const ccTransmission = {
    recipients : [
        {
            address : '"Bob" <recipient1@gmail.com>'
        },
        {
            address : {
                email : 'recipient2@gmail.com',
                name  : 'Bertha'
            }
        },
        {
            address : {
                email : 'recipient3@gmail.com'
            }
        },
        {
            address : 'recipient4@gmail.com'
        }
    ],
    cc         : [
        {
            address : '"John" <cc1@gmail.com>'
        },
        {
            address : {
                email : 'cc2@gmail.com',
                name  : 'Jane'
            }
        }
    ],
    content    : {
        template_id : 'hello-world'
    }
};

const ccExpectedRecipients = [
    {
        address : {
            email : 'recipient1@gmail.com',
            name  : 'Bob'
        }
    },
    {
        address : {
            email : 'recipient2@gmail.com',
            name  : 'Bertha'
        }
    },
    {
        address : {
            email : 'recipient3@gmail.com'
        }
    },
    {
        address : {
            email : 'recipient4@gmail.com'
        }
    },
    {
        address : {
            email     : 'cc1@gmail.com',
            header_to : '"Bob" <recipient1@gmail.com>, "Bertha" <recipient2@gmail.com>, recipient3@gmail.com, recipient4@gmail.com'
        }
    },
    {
        address : {
            email     : 'cc2@gmail.com',
            header_to : '"Bob" <recipient1@gmail.com>, "Bertha" <recipient2@gmail.com>, recipient3@gmail.com, recipient4@gmail.com'
        }
    }
];

const expectedCCHeader = '"John" <cc1@gmail.com>, "Jane" <cc2@gmail.com>';

describe('Transmissions Library', () => {

    let client;
    let transmissions;

    beforeEach(() => {

        client = {
            get  : Sinon.stub().resolves({}),
            post : Sinon.stub().resolves({})
        };

        transmissions = new (require('../lib/api/transmissions'))(client);
    });

    describe('list Method', () => {

        it('should call client get method with the appropriate uri', () => {

            return transmissions.list().then(() => {

                expect(client.get.firstCall.args[0].uri).to.equal('transmissions');
            });
        });

        it('should allow campaign_id to be set in options', () => {

            const options = {
                campaign_id : 'test-campaign'
            };

            return transmissions.list(options).then(() => {

                expect(client.get.firstCall.args[0].searchParams).to.equal({ campaign_id : 'test-campaign' });
            });
        });

        it('should allow template_id to be set in options', () => {

            const options = {
                template_id : 'test-template'
            };

            return transmissions.list(options).then(() => {

                expect(client.get.firstCall.args[0].searchParams).to.equal({ template_id : 'test-template' });
            });
        });
    });

    describe('find Method', () => {

        it('should call client get method with the appropriate uri', () => {

            return transmissions.get('test').then(() => {

                expect(client.get.firstCall.args[0]).to.equal({ uri : 'transmissions/test' });
            });
        });

        it('should throw an error if id is missing', () => {

            return expect(transmissions.get()).to.reject('id is required');
        });
    });

    describe('send Method', () => {

        it('should call client post method with the appropriate uri and payload', () => {

            const transmission = {
                campaign_id : 'test-campaign'
            };

            return transmissions.send(transmission).then(() => {

                expect(client.post.firstCall.args[0].uri).to.equal('transmissions');
                expect(client.post.firstCall.args[0].body).to.equal(transmission);
            });
        });

        it('should create content when adding ccs if non existant', async () => {

            const transmission = {
                recipients : [
                    {
                        address : {
                            name  : 'Bob',
                            email : 'recipient1@gmail.com'
                        }
                    }
                ],
                cc         : [{ address : 'test@test.com' }],
                bcc        : []
            };

            await transmissions.send(transmission);

            expect(client.post.firstCall.args[0].body.content.headers.CC).to.equal(transmission.cc[0].address);
        });

        it('should not create content heads if already exists when adding cc\'s', async () => {

            const transmission = {
                recipients : [
                    {
                        address : {
                            name  : 'Bob',
                            email : 'recipient1@gmail.com'
                        }
                    }
                ],
                cc         : [{ address : 'test@test.com' }],
                bcc        : [],
                content    : {
                    headers : {
                        something : 'test'
                    }
                }
            };

            await transmissions.send(transmission);

            expect(client.post.firstCall.args[0].body.content.headers.CC).to.equal(transmission.cc[0].address);
            expect(client.post.firstCall.args[0].body.content.headers.something).to.equal(transmission.content.headers.something);
        });

        it('should throw an error if transmission object is missing', () => {

            return expect(transmissions.send()).to.reject('transmission object is required');
        });

        it('should throw an error if transmission object is not an object', () => {

            return expect(transmissions.send(() => {})).to.reject('transmission object is required');
        });

        it('should allow num_rcpt_errors to be set in options', () => {

            const transmission = {
                campaign_id : 'test-campaign'
            };

            const options = {
                num_rcpt_errors : 3
            };

            return transmissions.send(transmission, options).then(() => {

                expect(client.post.firstCall.args[0].searchParams).to.equal({ num_rcpt_errors : 3 });
            });
        });

        it('should leave email_rfc822 content keys intact', () => {

            const options = {
                content : {
                    email_rfc822 : 'Content-Type: text/plain\nFrom: From Envelope <from@example.com>\nSubject: Example Email\n\nHello World'
                }
            };

            return transmissions.send(options).then(() => {

                expect(client.post.firstCall.args[0].body.content).to.include('email_rfc822');
            });
        });

        it('should allow a list_id and template through', () => {

            const transmission = {
                recipients : {
                    list_id : 'my-list-id'
                },
                content    : {
                    template_id : 'my-template-id'
                }
            };

            return transmissions.send(transmission).then(() => {

                expect(client.post.firstCall.args[0].body).to.equal(transmission);
            });
        });

        it('should ignore empty bcc and cc', () => {

            const transmission = {
                recipients : [
                    {
                        address : {
                            name  : 'Bob',
                            email : 'recipient1@gmail.com'
                        }
                    }
                ],
                cc         : [],
                bcc        : [],
                content    : {
                    template_id : 'my-template-id'
                }
            };

            return transmissions.send(transmission).then(() => {

                delete transmission.cc;
                delete transmission.bcc;

                expect(client.post.firstCall.args[0].body).to.equal(transmission);
            });
        });

        it('should convert cc to the correct recipients and headers', () => {

            return transmissions.send(ccTransmission).then(() => {

                expect(client.post.firstCall.args[0].body.recipients).to.equal(ccExpectedRecipients);
                expect(client.post.firstCall.args[0].body.content.headers.CC).to.equal(expectedCCHeader);
            });
        });

        it('should convert bcc to the correct recipients and headers', () => {

            const bccTransmission       = ccTransmission;
            const bccExpectedRecipients = ccExpectedRecipients;
            bccTransmission.bcc         = bccTransmission.cc;
            delete bccTransmission.cc;

            return transmissions.send(bccTransmission).then(() => {

                expect(client.post.firstCall.args[0].body.recipients).to.equal(bccExpectedRecipients);
                expect(client.post.firstCall.args[0].body.content.headers).to.be.undefined();
            });
        });

        it('should not modify a transmission using the full cc/bcc syntax', () => {

            const transmission = {
                recipients : [
                    {
                        address           : {
                            email : 'original.recipient@example.com',
                            name  : 'Original Recipient'
                        },
                        substitution_data : {
                            recipient_type : 'Original'
                        }
                    },
                    {
                        address           : {
                            email     : 'bcc.recipient@example.com',
                            header_to : '"Original Recipient" <original.recipient@example.com>'
                        },
                        substitution_data : {
                            recipient_type : 'BCC'
                        }
                    }
                ],
                content    : {
                    from    : {
                        name  : 'Node BCC Test',
                        email : 'from@example.com'
                    },
                    subject : 'Example email using bcc',
                    text    : 'An example email using bcc with SparkPost to the {{recipient_type}} recipient.',
                    html    : '<p>An example email using bcc with SparkPost to the {{recipient_type}} recipient.</p>'
                }
            };

            return transmissions.send(transmission).then(() => {

                expect(client.post.firstCall.args[0].body).to.equal(transmission);
            });
        });
    });
});

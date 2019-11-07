'use strict';

const Sinon = require('sinon');
const Code  = require('@hapi/code');
const Lab   = require('@hapi/lab');

const { describe, it, beforeEach } = exports.lab = Lab.script();
const { expect }                   = Code;

describe('Webhooks Library', () => {

    let client;
    let webhooks;

    beforeEach(() => {

        client = {
            get    : Sinon.stub().resolves({}),
            post   : Sinon.stub().resolves({}),
            put    : Sinon.stub().resolves({}),
            delete : Sinon.stub().resolves({})
        };

        webhooks = new (require('../lib/api/webhooks'))(client);
    });

    describe('list Method', () => {

        it('should call client get method with the appropriate uri', () => {

            return webhooks.list().then(() => {

                expect(client.get.firstCall.args[0].uri).to.equal('webhooks');
            });
        });

        it('should allow timezone to be set in options', () => {

            const options = {
                timezone : 'America/New_York'
            };

            return webhooks.list(options).then(() => {

                expect(client.get.firstCall.args[0].qs).to.equal({ timezone : 'America/New_York' });
            });
        });
    });

    describe('get Method', () => {

        it('should call client get method with the appropriate uri', () => {

            return webhooks.get('test').then(() => {

                expect(client.get.firstCall.args[0].uri).to.equal('webhooks/test');
            });
        });

        it('should throw an error if id is missing', () => {

            return expect(webhooks.get()).to.reject('id is required');
        });

        it('should allow timezone to be set in options', () => {

            const options = {
                timezone : 'America/New_York'
            };

            return webhooks.get('test', options).then(() => {

                expect(client.get.firstCall.args[0].qs).to.equal({ timezone : 'America/New_York' });
            });
        });
    });

    describe('create Method', () => {

        it('should call client post method with the appropriate uri and payload', () => {

            const webhook = {
                name   : 'Example webhook',
                target : 'http://client.example.com/example-webhook',
                events : ['delivery', 'injection', 'open', 'click']
            };

            return webhooks.create(webhook).then(() => {

                expect(client.post.firstCall.args[0].uri).to.equal('webhooks');
                expect(client.post.firstCall.args[0].json).to.equal(webhook);
            });
        });

        it('should throw an error if webhook is missing', () => {

            return expect(webhooks.create()).to.reject('webhook object is required');
        });

        it('should throw an error if webhook is not an object', () => {

            return expect(webhooks.create('string')).to.reject('webhook object is required');
        });
    });

    describe('update Method', () => {

        it('should call client put method with the appropriate uri', () => {

            const webhook = {
                name      : 'Renamed webhook',
                events    : ['rejection', 'delay'],
                auth_type : 'none'
            };

            return webhooks.update('test', webhook).then(() => {

                expect(client.put.firstCall.args[0].uri).to.equal('webhooks/test');
                expect(client.put.firstCall.args[0].json).to.equal(webhook);
            });
        });

        it('should throw an error if id is missing', () => {

            return expect(webhooks.update()).to.reject('id is required');
        });

        it('should throw an error if webhook is missing', () => {

            return expect(webhooks.update('test')).to.reject('webhook object is required');
        });

        it('should throw an error if webhook is not an object', () => {

            return expect(webhooks.update('test', 'test')).to.reject('webhook object is required');
        });
    });

    describe('delete Method', () => {

        it('should call client delete method with the appropriate uri', () => {

            return webhooks.delete('test').then(() => {

                expect(client.delete.firstCall.args[0].uri).to.equal('webhooks/test');
            });
        });

        it('should throw an error if id is missing', () => {

            return expect(webhooks.delete()).to.reject('id is required');
        });

        it('should throw an error if id is not a string', () => {

            return expect(webhooks.delete({})).to.reject('id is required');
        });
    });

    describe('validate Method', () => {

        it('should call client post method with the appropriate uri and payload', () => {

            const options = {
                message : {
                    msys : {}
                }
            };

            return webhooks.validate('test', options).then(() => {

                expect(client.post.firstCall.args[0].uri).to.equal('webhooks/test/validate');
                expect(client.post.firstCall.args[0].json).to.equal(options);
            });
        });

        it('should throw an error if id is missing', async () => {

            return await expect(webhooks.validate()).to.reject('id is required');
        });

        it('should throw an error if id is not a string', async () => {

            return await expect(webhooks.validate({})).to.reject('id is required');
        });

        it('should throw an error if options is missing', () => {

            return expect(webhooks.validate('test')).to.reject('message is required');
        });

        it('should throw an error if options.message is missing', () => {

            return expect(webhooks.validate('test', {})).to.reject('message is required');
        });
    });

    describe('getBatchStatus Method', () => {

        it('should call client get method with the appropriate uri', () => {

            return webhooks.getBatchStatus('test').then(() => {

                expect(client.get.firstCall.args[0].uri).to.equal('webhooks/test/batch-status');
            });
        });

        it('should throw an error if id is missing', () => {

            return expect(webhooks.getBatchStatus()).to.reject('id is required');
        });

        it('should throw an error if id is not a string', () => {

            return expect(webhooks.getBatchStatus({})).to.reject('id is required');
        });

        it('should allow limit to be set in options', () => {

            const options = {
                limit : 1000
            };

            return webhooks.getBatchStatus('test', options).then(() => {

                expect(client.get.firstCall.args[0].qs).to.equal({ limit : 1000 });
            });
        });
    });

    describe('getDocumentation Method', () => {

        it('should call client get method with the appropriate uri', () => {

            return webhooks.getDocumentation().then(() => {

                expect(client.get.firstCall.args[0].uri).to.equal('webhooks/events/documentation');
            });
        });
    });

    describe('getSamples Method', () => {

        it('should call client get method with the appropriate uri', () => {

            return webhooks.getSamples().then(() => {

                expect(client.get.firstCall.args[0].uri).to.equal('webhooks/events/samples');
            });
        });

        it('should allow events to be set in options', () => {

            const options = {
                events : 'bounces'
            };

            return webhooks.getSamples(options).then(() => {

                expect(client.get.firstCall.args[0].qs).to.equal({ events : 'bounces' });
            });
        });
    });
});

'use strict';

const Sinon     = require('sinon');
const Code      = require('@hapi/code');
const Lab       = require('@hapi/lab');

const { describe, it, beforeEach } = exports.lab = Lab.script();
const { expect }                   = Code;

describe('Sending Domains Library', () => {

    let client;
    let sendingDomains;

    beforeEach(() => {

        client = {
            get    : Sinon.stub().resolves({}),
            post   : Sinon.stub().resolves({}),
            put    : Sinon.stub().resolves({}),
            delete : Sinon.stub().resolves({})
        };


        sendingDomains = new (require('../lib/api/sendingDomains'))(client);
    });

    describe('list', () => {

        it('should call client get method with the appropriate uri', () => {

            return sendingDomains.list().then(() => {

                expect(client.get.firstCall.args[0]).to.equal({ uri : 'sending-domains' });
            });
        });
    });

    describe('get', () => {

        it('should call client get method with the appropriate uri', () => {

            return sendingDomains.get('test').then(() => {

                expect(client.get.firstCall.args[0]).to.equal({ uri : 'sending-domains/test' });
            });
        });

        it('should throw an error if domain is missing', () => {

            return expect(sendingDomains.get()).to.reject('domain is required');
        });

        it('should throw an error if domain is not a string', () => {

            return expect(sendingDomains.get({})).to.reject('domain is required');
        });
    });

    describe('create', () => {

        it('should call client post method with the appropriate uri and payload', () => {

            const sendingDomain = {
                domain : 'test'
            };

            return sendingDomains.create(sendingDomain).then(() => {

                expect(client.post.firstCall.args[0].uri).to.equal('sending-domains');
                expect(client.post.firstCall.args[0].json).to.equal(sendingDomain);
            });
        });

        it('should throw an error if create options are missing', () => {

            return expect(sendingDomains.create()).to.reject('create options are required');
        });

        it('should throw an error if create options is not an object', () => {

            return expect(sendingDomains.create('string')).to.reject('create options are required');
        });
    });

    describe('update', () => {

        it('should call client put method with the appropriate uri and payload', () => {

            const sendingDomain = {
                tracking_domain : 'click.example1.com'
            };

            return sendingDomains.update('test', sendingDomain).then(() => {

                expect(client.put.firstCall.args[0].uri).to.equal('sending-domains/test');
                expect(client.put.firstCall.args[0].json).to.equal(sendingDomain);
            });
        });

        it('should throw an error if update options are missing', () => {

            return expect(sendingDomains.update('test')).to.reject('update options are required');
        });

        it('should throw an error if update options are not an object', () => {

            return expect(sendingDomains.update('test', 'string')).to.reject('update options are required');
        });

        it('should throw an error if domain is missing', () => {

            return expect(sendingDomains.update()).to.reject('domain is required');
        });
    });

    describe('delete', () => {

        it('should call client delete method with the appropriate uri', () => {

            return sendingDomains.delete('test').then(() => {

                expect(client.delete.firstCall.args[0].uri).to.equal('sending-domains/test');
            });
        });

        it('should throw an error if domain is missing', () => {

            return expect(sendingDomains.delete()).to.reject('domain is required');
        });
    });

    describe('verify', () => {

        it('should call client post method with the appropriate uri and payload', () => {

            const options = {
                dkim_verify : true,
                spf_verify  : true
            };

            return sendingDomains.verify('test', options).then(() => {

                expect(client.post.firstCall.args[0].uri).to.equal('sending-domains/test/verify');
                expect(client.post.firstCall.args[0].json).to.equal(options);
            });
        });

        it('should throw an error if domain is missing', () => {

            return expect(sendingDomains.verify()).to.reject('domain is required');
        });

        it('should throw an error if verification options are missing', () => {

            return expect(sendingDomains.verify('test')).to.reject('verification options are required');
        });

        it('should throw an error if verification options are not an object', () => {

            return expect(sendingDomains.verify('test', 'string')).to.reject('verification options are required');
        });
    });

});

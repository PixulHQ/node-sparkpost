'use strict';

const Sinon     = require('sinon');

const Code = require('@hapi/code');
const Lab  = require('@hapi/lab');

const { describe, it, beforeEach } = exports.lab = Lab.script();
const { expect }                   = Code;

describe('Inbound Domains Library', () => {

    let client;
    let inboundDomains;

    beforeEach(() => {

        client = {
            get    : Sinon.stub().resolves({}),
            post   : Sinon.stub().resolves({}),
            delete : Sinon.stub().resolves({})
        };

        inboundDomains = new (require('../lib/api/inboundDomains'))(client);
    });

    describe('list Method', () => {

        it('should call client get method with the appropriate uri', () => {

            return inboundDomains.list().then(() => {

                expect(client.get.firstCall.args[0]).to.equal({ uri : 'inbound-domains' });
            });
        });
    });

    describe('get Method', () => {

        it('should call client get method with the appropriate uri', () => {

            return inboundDomains.get('test').then(() => {

                expect(client.get.firstCall.args[0]).to.equal({ uri : 'inbound-domains/test' });
            });
        });

        it('should throw an error if domain is missing', () => {

            return expect(inboundDomains.get()).to.reject('domain is required');
        });

        it('should throw an error if domain is not a string', () => {

            return expect(inboundDomains.get({})).to.reject('domain is required');
        });
    });

    describe('create Method', () => {

        it('should call client post method with the appropriate uri and payload', () => {

            const createOpts = { domain : 'test' };
            return inboundDomains.create(createOpts)
                .then(() => {

                    expect(client.post.firstCall.args[0].uri).to.equal('inbound-domains');
                    expect(client.post.firstCall.args[0].body).to.equal(createOpts);
                });
        });

        it('should throw an error if domain is missing', () => {

            return expect(inboundDomains.create()).to.reject('create options are required');
        });

        it('should throw an error if create options is not an object', () => {

            return expect(inboundDomains.create('string')).to.reject('create options are required');
        });
    });

    describe('delete Method', () => {

        it('should call client delete method with the appropriate uri', () => {

            return inboundDomains.delete('test').then(() => {

                expect(client.delete.firstCall.args[0].uri).to.equal('inbound-domains/test');
            });
        });

        it('should throw an error if domain is missing', () => {

            return expect(inboundDomains.delete()).to.reject('domain is required');
        });

        it('should throw an error if domain is not a string', () => {

            return expect(inboundDomains.delete({})).to.reject('domain is required');
        });
    });
});

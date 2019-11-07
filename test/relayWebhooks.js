'use strict';

const Sinon     = require('sinon');
const Code      = require('@hapi/code');
const Lab       = require('@hapi/lab');

const { describe, it, beforeEach } = exports.lab = Lab.script();
const { expect }                   = Code;

describe('Relay Webhooks Library', () => {

    let client;
    let relayWebhooks;

    beforeEach(() => {

        client = {
            get    : Sinon.stub().resolves({}),
            post   : Sinon.stub().resolves({}),
            put    : Sinon.stub().resolves({}),
            delete : Sinon.stub().resolves({})
        };

        relayWebhooks = new (require('../lib/api/relayWebhooks'))(client);
    });

    describe('list Method', () => {

        it('should call client get method with the appropriate uri', () => {

            return relayWebhooks.list().then(() => {

                expect(client.get.firstCall.args[0].uri).to.equal('relay-webhooks');
            });
        });
    });

    describe('get Method', () => {

        it('should call client get method with the appropriate uri', () => {

            return relayWebhooks.get('test').then(() => {

                expect(client.get.firstCall.args[0]).to.equal({ uri : 'relay-webhooks/test' });
            });
        });

        it('should throw an error if id is missing', () => {

            return expect(relayWebhooks.get()).to.reject('id is required');
        });

        it('should throw an error if id is not a string', () => {

            return expect(relayWebhooks.get({})).to.reject('id is required');
        });
    });

    describe('create Method', () => {

        it('should call client post method with the appropriate uri and payload', () => {

            const webhook = {
                target : 'test',
                domain : 'inbound.example.com'
            };

            return relayWebhooks.create(webhook).then(() => {

                expect(client.post.firstCall.args[0].uri).to.equal('relay-webhooks');
                expect(client.post.firstCall.args[0].json).to.equal(webhook);
            });
        });

        it('should throw an error if webhook object is missing', () => {

            return expect(relayWebhooks.create()).to.reject('webhook object is required');
        });

        it('should throw an error if webhook is not an object', () => {

            return expect(relayWebhooks.create('string')).to.reject('webhook object is required');
        });
    });

    describe('update Method', () => {

        it('should call client put method with the appropriate uri and payload', () => {

            const webhook = {
                name : 'New Replies Webhook'
            };

            return relayWebhooks.update('test', webhook).then(() => {

                expect(client.put.firstCall.args[0].uri).to.equal('relay-webhooks/test');
                expect(client.put.firstCall.args[0].json).to.equal(webhook);
            });
        });

        it('should throw an error if webhook.id is missing', () => {

            return expect(relayWebhooks.update()).to.reject('id is required');
        });

        it('should throw an error if webhook.id is not a string', () => {

            return expect(relayWebhooks.update({})).to.reject('id is required');
        });

        it('should throw an error if webhook object is missing', () => {

            return expect(relayWebhooks.update('test')).to.reject('webhook object is required');
        });

        it('should throw an error if webhook object is not an object', () => {

            return expect(relayWebhooks.update('test', 'string')).to.reject('webhook object is required');
        });
    });

    describe('delete Method', () => {

        it('should call client delete method with the appropriate uri', () => {

            return relayWebhooks.delete('test').then(() => {

                expect(client.delete.firstCall.args[0].uri).to.equal('relay-webhooks/test');
            });
        });

        it('should throw an error if id is missing', () => {

            return expect(relayWebhooks.delete()).to.reject('id is required');
        });

        it('should throw an error if id is not a string', () => {

            return expect(relayWebhooks.delete({})).to.reject('id is required');
        });
    });
});

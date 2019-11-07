'use strict';

const Sinon     = require('sinon');
const Code      = require('@hapi/code');
const Lab       = require('@hapi/lab');

const { describe, it, beforeEach } = exports.lab = Lab.script();
const { expect }                   = Code;

describe('Subaccounts Library', () => {

    let client;
    let subaccounts;

    beforeEach(() => {

        client = {
            get  : Sinon.stub().resolves({}),
            post : Sinon.stub().resolves({}),
            put  : Sinon.stub().resolves({})
        };

        subaccounts = new (require('../lib/api/subaccounts'))(client);
    });

    describe('list Method', () => {

        it('should call client get method with the appropriate uri', () => {

            return subaccounts.list().then(() => {

                expect(client.get.firstCall.args[0].uri).to.equal('subaccounts');
            });
        });
    });

    describe('get Method', () => {

        it('should call client get method with the appropriate uri', () => {

            return subaccounts.get('test').then(() => {

                expect(client.get.firstCall.args[0].uri).to.equal('subaccounts/test');
            });
        });

        it('should throw an error if id is missing', () => {

            return expect(subaccounts.get()).to.reject('id is required');
        });

        it('should throw an error if id is not a string', () => {

            return expect(subaccounts.get({})).to.reject('id is required');
        });
    });

    describe('create Method', () => {

        it('should call client post method with the appropriate uri and payload', () => {

            const subaccount = {
                name       : 'test',
                key_label  : 'test',
                key_grants : []
            };

            return subaccounts.create(subaccount).then(() => {

                expect(client.post.firstCall.args[0].uri).to.equal('subaccounts');
                expect(client.post.firstCall.args[0].body).to.equal(subaccount);
            });
        });

        it('should throw an error if subaccount object is missing', () => {

            return expect(subaccounts.create()).to.reject('subaccount object is required');
        });

        it('should throw an error if subaccount object is not an object', () => {

            return expect(subaccounts.create('string')).to.reject('subaccount object is required');
        });
    });

    describe('update Method', () => {

        it('should call client put method with the appropriate uri and payload', () => {

            const subaccount = {
                name    : 'Hey Joe! Garage and Parts',
                status  : 'suspended',
                ip_pool : ''
            };

            return subaccounts.update('test', subaccount).then(() => {

                expect(client.put.firstCall.args[0].uri).to.equal('subaccounts/test');
                expect(client.put.firstCall.args[0].body).to.equal(subaccount);
            });
        });

        it('should throw an error if subaccount id is missing from options', () => {

            return expect(subaccounts.update()).to.reject('id is required');
        });

        it('should throw an error if subaccount id is not a string', () => {

            return expect(subaccounts.update({})).to.reject('id is required');
        });

        it('should throw an error if subaccount object is missing', () => {

            return expect(subaccounts.update('test')).to.reject('subaccount object is required');
        });

        it('should throw an error if subaccount object is not an object', () => {

            return expect(subaccounts.update('test', 'string')).to.reject('subaccount object is required');
        });
    });
});

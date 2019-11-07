'use strict';

const Sinon     = require('sinon');
const Code      = require('@hapi/code');
const Lab       = require('@hapi/lab');

const { describe, it, beforeEach } = exports.lab = Lab.script();
const { expect }                   = Code;

describe('Suppression List Library', () => {

    let client;
    let suppressionList;

    beforeEach(() => {

        client = {
            get    : Sinon.stub().resolves({}),
            post   : Sinon.stub().resolves({}),
            put    : Sinon.stub().resolves({}),
            delete : Sinon.stub().resolves({})
        };

        suppressionList = new (require('../lib/api/suppressionList'))(client);
    });

    describe('list', () => {

        it('should call client get method with the appropriate uri', () => {

            return suppressionList.list({ limit : 5 }).then(() => {

                expect(client.get.firstCall.args[0].uri).to.equal('suppression-list');
            });
        });
    });

    describe('get', () => {

        it('should call client get method with the appropriate uri', () => {

            return suppressionList.get('test@test.com').then(() => {

                expect(client.get.firstCall.args[0].uri).to.equal('suppression-list/test@test.com');
            });
        });

        it('should throw an error if email is missing', () => {

            return expect(suppressionList.get()).to.reject('email is required');
        });

        it('should throw an error if email is not a string', () => {

            return expect(suppressionList.get({})).to.reject('email is required');
        });
    });

    describe('upsert', () => {

        it('should accept a single list entry', () => {

            const listEntry = { email : 'test@test.com' };

            return suppressionList.upsert(listEntry).then(() => {

                expect(client.put.firstCall.args[0].uri).to.equal('suppression-list');
                expect(client.put.firstCall.args[0].json.recipients).to.equal([listEntry]);
            });
        });

        it('should accept an array of list entries', () => {

            const listEntries = [
                { email : 'test1@test.com' },
                { email : 'test2@test.com' }
            ];

            return suppressionList.upsert(listEntries).then(() => {

                expect(client.put.firstCall.args[0].uri).to.equal('suppression-list');
                expect(client.put.firstCall.args[0].json.recipients).to.equal(listEntries);
            });
        });

        it('should throw an error if recipient is missing', () => {

            return expect(suppressionList.upsert()).to.reject('list entries is required');
        });

        it('should throw an error if recipient is a function', () => {

            return expect(suppressionList.upsert(() => {})).to.reject('list entries is required');
        });
    });

    describe('delete', () => {

        it('should call client delete method with the appropriate uri', () => {

            return suppressionList.delete('test@test.com').then(() => {

                expect(client.delete.firstCall.args[0].uri).to.equal('suppression-list/test@test.com');
            });
        });

        it('should throw an error if email deleteEntry missing', () => {

            return expect(suppressionList.delete()).to.reject('email is required');
        });

        it('should throw an error if email is not a string', () => {

            return expect(suppressionList.delete({})).to.reject('email is required');
        });
    });

});

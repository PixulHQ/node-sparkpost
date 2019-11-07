'use strict';

const Sinon     = require('sinon');
const Code      = require('@hapi/code');
const Lab       = require('@hapi/lab');

const { describe, it, beforeEach } = exports.lab = Lab.script();
const { expect }                   = Code;

describe('Recipient Lists Library', () => {

    let client;
    let recipientLists;

    beforeEach(() => {

        client = {
            get    : Sinon.stub().resolves({}),
            post   : Sinon.stub().resolves({}),
            put    : Sinon.stub().resolves({}),
            delete : Sinon.stub().resolves({})
        };

        recipientLists = new (require('../lib/api/recipientLists'))(client);
    });

    describe('list', () => {

        it('should call client get method with the appropriate uri', () => {

            return recipientLists.list().then(() => {

                expect(client.get.firstCall.args[0].uri).to.equal('recipient-lists');
            });
        });
    });

    describe('get', () => {

        it('should call client get method with the appropriate uri', () => {

            return recipientLists.get('test-id').then(() => {

                expect(client.get.firstCall.args[0].uri).to.equal('recipient-lists/test-id');
            });
        });

        it('should throw an error if id is missing', () => {

            return expect(recipientLists.get()).to.reject('id is required');
        });

        it('should allow show_recipients to be set in options', () => {

            const options = {
                show_recipients : true
            };

            return recipientLists.get('test-id', options).then(() => {

                expect(client.get.firstCall.args[0].qs).to.equal({ show_recipients : true });
            });
        });

    });

    describe('create', () => {

        it('should call client post method with the appropriate uri and payload', () => {

            const testList = {
                id         : 'test_list',
                recipients : [
                    {
                        address : {
                            email : 'test@test.com',
                            name  : 'test'
                        }
                    }
                ]
            };

            return recipientLists.create(testList).then(() => {

                expect(client.post.firstCall.args[0].uri).to.equal('recipient-lists');
                expect(client.post.firstCall.args[0].json).to.equal(testList);
            });
        });

        it('should throw an error if no recipients are provided', () => {

            return Promise.all([
                expect(recipientLists.create(), 'no recipient list hash at all').to.reject('recipient list is required'),
                expect(recipientLists.create({}), 'no recipients key').to.reject('recipient list is required'),
                expect(recipientLists.create(() => {}), 'recipient list is actually a callback').to.reject('recipient list is required')
            ]);
        });

        it('should allow num_rcpt_errors to be set in options', () => {

            const testList = {
                id              : 'test_list',
                recipients      : [
                    {
                        address : {
                            email : 'test@test.com',
                            name  : 'test'
                        }
                    }
                ],
                num_rcpt_errors : 3
            };

            return recipientLists.create(testList).then(() => {

                expect(client.post.firstCall.args[0].qs).to.equal({ num_rcpt_errors : 3 });
            });
        });

    });

    describe('update', () => {

        it('should call client put method with the appropriate uri and payload', () => {

            const testList = {
                recipients : [
                    {
                        address : {
                            email : 'test@test.com',
                            name  : 'test'
                        }
                    }
                ]
            };
            const testId   = 'test-id';

            return recipientLists.update(testId, testList).then(() => {

                expect(client.put.firstCall.args[0].uri).to.equal('recipient-lists/' + testId);
                expect(client.put.firstCall.args[0].json).to.equal(testList);
            });
        });

        it('should throw an error if recipient list is missing', () => {

            return expect(recipientLists.update('test-id')).to.reject('recipient list is required');
        });

        it('should throw an error if recipient list is a function', () => {

            return expect(recipientLists.update('test-id', () => {})).to.reject('recipient list is required');
        });

        it('should throw an error if id is missing', () => {

            return expect(recipientLists.update()).to.reject('recipient list id is required');
        });

        it('should allow num_rcpt_errors to be set in options', () => {

            const testList = {
                recipients      : [
                    {
                        address : {
                            email : 'test@test.com',
                            name  : 'test'
                        }
                    }
                ],
                num_rcpt_errors : 3
            };

            return recipientLists.update('test-id', testList).then(() => {

                expect(client.put.firstCall.args[0].qs).to.equal({ num_rcpt_errors : 3 });
            });
        });

    });

    describe('delete', () => {

        it('should call client delete method with the appropriate uri', () => {

            return recipientLists.delete('test').then(() => {

                expect(client.delete.firstCall.args[0].uri).to.equal('recipient-lists/test');
            });
        });

        it('should throw an error if id is missing', () => {

            return expect(recipientLists.delete()).to.reject('id is required');
        });

        it('should throw an error if id is not a string', () => {

            return expect(recipientLists.delete({})).to.reject('id is required');
        });
    });

});

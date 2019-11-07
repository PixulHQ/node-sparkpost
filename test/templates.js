'use strict';

const Sinon = require('sinon');
const Code  = require('@hapi/code');
const Lab   = require('@hapi/lab');

const { describe, it, beforeEach } = exports.lab = Lab.script();
const { expect }                   = Code;

describe('Templates Library', () => {

    let client;
    let templates;

    beforeEach(() => {

        client = {
            get    : Sinon.stub().resolves({}),
            post   : Sinon.stub().resolves({}),
            put    : Sinon.stub().resolves({}),
            delete : Sinon.stub().resolves({})
        };

        templates = new (require('../lib/api/templates'))(client);
    });

    describe('list Method', () => {

        it('should call client get method with the appropriate uri', () => {

            return templates.list().then(() => {

                expect(client.get.firstCall.args[0].uri).to.equal('templates');
            });
        });
    });

    describe('get Method', () => {

        it('should call client get method with the appropriate uri', () => {

            const id = 'test';

            return templates.get(id).then(() => {

                expect(client.get.firstCall.args[0].uri).to.equal('templates/test');
            });
        });

        it('should throw an error if id is missing', () => {

            return expect(templates.get()).to.reject('template id is required');
        });

        it('should allow draft to be set in options', () => {

            const id      = 'test';
            const options = {
                draft : true
            };

            return templates.get(id, options).then(() => {

                expect(client.get.firstCall.args[0].searchParams).to.equal({ draft : true });
            });
        });
    });

    describe('create Method', () => {

        it('should call client post method with the appropriate uri and payload', () => {

            const template = {
                id : 'test'
            };

            return templates.create(template).then(() => {

                expect(client.post.firstCall.args[0].uri).to.equal('templates');
                expect(client.post.firstCall.args[0].body).to.equal(template);
            });
        });

        it('should throw an error if template object is missing', () => {

            return expect(templates.create()).to.reject('template object is required');
        });

        it('should throw an error if template object is not an object', () => {

            return expect(templates.create(() => {})).to.reject('template object is required');
        });
    });

    describe('update Method', () => {

        it('should call client put method with the appropriate uri and payload', () => {

            const id       = 'test';
            const template = {
                name : 'A new name!'
            };

            return templates.update(id, template).then(() => {

                expect(client.put.firstCall.args[0].uri).to.equal('templates/test');
                expect(client.put.firstCall.args[0].body).to.equal(template);
            });
        });

        it('should throw an error if template id is missing', () => {

            return expect(templates.update()).to.reject('template id is required');
        });

        it('should throw an error if template object is missing', () => {

            return expect(templates.update('test')).to.reject('template object is required');
        });

        it('should throw an error if template object is not an object', () => {

            return expect(templates.update('test', 'string')).to.reject('template object is required');
        });

        it('should allow update_published to be set in options', () => {

            const id       = 'test';
            const template = {
                name : 'Test Template'
            };
            const options  = {
                update_published : true
            };

            return templates.update(id, template, options).then(() => {

                expect(client.put.firstCall.args[0].searchParams).to.equal(options);
            });
        });
    });

    describe('delete Method', () => {

        it('should call client delete method with the appropriate uri', () => {

            return templates.delete('test').then(() => {

                expect(client.delete.firstCall.args[0].uri).to.equal('templates/test');
            });
        });

        it('should throw an error if id is missing', () => {

            return expect(templates.delete()).to.reject('template id is required');
        });

        it('should throw an error if id is not a string', () => {

            return expect(templates.delete({})).to.reject('template id is required');
        });
    });

    describe('preview Method', () => {

        it('should call client post method with the appropriate uri and payload', () => {

            const id      = 'test';
            const options = {
                substitution_data : {
                    'name'   : 'Natalie',
                    'age'    : 35,
                    'member' : true
                }
            };

            return templates.preview(id, options).then(() => {

                expect(client.post.firstCall.args[0].uri).to.equal('templates/test/preview');
                expect(client.post.firstCall.args[0].body).to.equal(options);
            });
        });

        it('should throw an error if id is missing', () => {

            return expect(templates.preview()).to.reject('template id is required');
        });

        it('should add the draft option to query params', () => {

            const id      = 'test';
            const options = {
                draft : false
            };

            return templates.preview(id, options).then(() => {

                expect(client.post.firstCall.args[0].searchParams).to.equal({ draft : false });
            });
        });
    });
});

'use strict';

const SparkPost = require('../lib/sparkpost');
const Sinon     = require('sinon');
const Code      = require('@hapi/code');
const Lab       = require('@hapi/lab');

const { describe, it, beforeEach } = exports.lab = Lab.script();
const { expect }                   = Code;

describe('Tracking Domains Library', () => {

    let client;
    let trackingDomains;

    beforeEach(() => {

        client = {
            get    : Sinon.stub().resolves({}),
            post   : Sinon.stub().resolves({}),
            put    : Sinon.stub().resolves({}),
            delete : Sinon.stub().resolves({}),
            reject : SparkPost.prototype.reject
        };

        trackingDomains = new (require('../lib/api/trackingDomains'))(client);
    });

    describe('list', () => {

        it('should call client get method with the appropriate uri', () => {

            return trackingDomains.list({}).then(() => {

                expect(client.get.firstCall.args[0]).to.equal({ uri : 'tracking-domains', searchParams : {} });
            });
        });

        it('should call client get method with the default option', () => {

            return trackingDomains.list({ default : true }).then(() => {

                expect(client.get.firstCall.args[0]).to.equal({ uri : 'tracking-domains', searchParams : { default : true } });
            });
        });

        it('should call client get method with subacounts options', () => {

            return trackingDomains.list({ subaccounts : [1, 3] }).then(() => {

                expect(client.get.firstCall.args[0]).to.equal({ uri : 'tracking-domains', searchParams : { subaccounts : [1, 3] } });
            });
        });
    });

    describe('get', () => {

        it('should call client get method with the appropriate uri', () => {

            return trackingDomains.get('test').then(() => {

                expect(client.get.firstCall.args[0]).to.equal({ uri : 'tracking-domains/test' });
            });
        });

        it('should throw an error if domain is missing', () => {

            return expect(trackingDomains.get()).to.reject('domain is required');
        });

        it('should throw an error if domain is not a string', () => {

            return expect(trackingDomains.get({})).to.reject('domain is required');
        });
    });

    describe('create', () => {

        it('should call client post method with the appropriate uri and payload', () => {

            const trackingDomain = {
                domain : 'test'
            };

            return trackingDomains.create(trackingDomain).then(() => {

                expect(client.post.firstCall.args[0].uri).to.equal('tracking-domains');
                expect(client.post.firstCall.args[0].body).to.equal(trackingDomain);
            });
        });

        it('should throw an error if create options are missing', () => {

            return expect(trackingDomains.create()).to.reject('create options are required');
        });

        it('should throw an error if create options are not an object', () => {

            return expect(trackingDomains.create('string')).to.reject('create options are required');
        });
    });

    describe('update', () => {

        it('should call client put method with the appropriate uri and payload', () => {

            const trackingDomain = {
                tracking_domain : 'click.example1.com'
            };

            return trackingDomains.update('test', trackingDomain).then(() => {

                expect(client.put.firstCall.args[0].uri).to.equal('tracking-domains/test');
                expect(client.put.firstCall.args[0].body).to.equal(trackingDomain);
            });
        });

        it('should throw an error if update options are missing', () => {

            return expect(trackingDomains.update('test')).to.reject('update options are required');
        });

        it('should throw an error if update options are not an object', () => {

            return expect(trackingDomains.update('test', 'string')).to.reject('update options are required');
        });

        it('should throw an error if domain is missing', () => {

            return expect(trackingDomains.update()).to.reject('domain is required');
        });
    });

    describe('delete', () => {

        it('should call client delete method with the appropriate uri', () => {

            return trackingDomains.delete('test').then(() => {

                expect(client.delete.firstCall.args[0].uri).to.equal('tracking-domains/test');
            });
        });

        it('should throw an error if domain is missing', () => {

            return expect(trackingDomains.delete()).to.reject('domain is required');
        });
    });

    describe('verify', () => {

        it('should call client post method with the appropriate uri and payload', () => {

            return trackingDomains.verify('test').then(() => {

                expect(client.post.firstCall.args[0].uri).to.equal('tracking-domains/test/verify');
            });
        });

        it('should throw an error if domain is missing', () => {

            return expect(trackingDomains.verify()).to.reject('domain is required');
        });
    });

});

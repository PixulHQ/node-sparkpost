'use strict';

const Zlib       = require('zlib');
const Nock       = require('nock');
const libVersion = require('../package.json').version;
const SparkPost  = require('../lib/sparkpost');
const Sinon      = require('sinon');
const Code       = require('@hapi/code');
const Lab        = require('@hapi/lab');

const { describe, it, before } = exports.lab = Lab.script();
const { expect }               = Code;

describe('SparkPost Library', () => {

    it('should be a constructor', () => {

        expect(SparkPost).to.be.a.function();
    });

    it('should require an API key', () => {

        try {
            new SparkPost();
        }
        catch (err) {
            expect(err.message).to.equal('Client requires an API Key.');
        }
    });

    it('should allow an API key to be passed in', () => {

        const key    = '12345678901234567890';
        const client = new SparkPost(key);

        expect(client.apiKey).to.equal(key);
    });

    it('should read an API key from an environment variable', () => {

        process.env.SPARKPOST_API_KEY = '12345678901234567890';
        const client                  = new SparkPost();

        expect(client.apiKey).to.equal(process.env.SPARKPOST_API_KEY);
        process.env.SPARKPOST_API_KEY = null;
    });

    it('should allow an API key passed in to take precedence over an environment variable', () => {

        const key                     = '12345678901234567890';
        process.env.SPARKPOST_API_KEY = 'abcdefghijklmnopqrst';
        const client                  = new SparkPost(key);

        expect(client.apiKey).to.equal(key);
        process.env.SPARKPOST_API_KEY = null;
    });

    it('should take a custom rest endpoint', () => {

        const key     = '12345678901234567890';
        const options = {};

        // testing default initialization
        let client = new SparkPost(key, options);

        expect(client.origin).to.equal('https://api.sparkpost.com:443');

        options.origin = 'https://dev.sparkpost.com';

        // testing custom endpoint
        client = new SparkPost(options);

        expect(client.origin).to.equal('https://dev.sparkpost.com');
    });

    it('should allow debug to be set in options', () => {

        const key     = '12345678901234567890';
        const options = {};
        let client;

        // testing default initialization
        client = new SparkPost(key, options);
        expect(client.debug).to.equal(false);

        // testing setting flag
        options.debug = true;
        client        = new SparkPost(key, options);
        expect(client.debug).to.equal(true);
    });

    const checkUserAgent = async function (clientOptions, checkFn) {

        const req = {
            method : 'GET',
            uri    : 'get/test',
            json   : true,
            debug  : true
        };

        Nock('https://api.sparkpost.com')
            .get('/api/v1/get/test')
            .reply(200, function () {

                expect(this.req.headers).to.include('user-agent');
                checkFn(this.req.headers['user-agent']);
                return { ok : true };
            });

        const client = new SparkPost('123456789', clientOptions);
        await client.request(req);
    };

    it('should allow users to self identify in user-agent', () => {

        const options = {
            stackIdentity : 'phantasmatron/1.1.3.8'
        };

        return checkUserAgent(options, (userAgent) => {

            expect(userAgent).to.include(options.stackIdentity);
        });
    });

    it('should include lib version in user-agent', () => {

        return checkUserAgent({}, (userAgent) => {

            expect(userAgent).to.include(`pixulhq-node-sparkpost/${ libVersion }`);
        });
    });

    it('should include Node.JS version in user-agent', () => {

        return checkUserAgent({}, (userAgent) => {

            expect(userAgent).to.include(`node.js/${ process.version }`);
        });
    });

    it('should change lib version if specified', () => {

        const client = new SparkPost('123456789', { apiVersion : '10.0.0' });

        expect(client.apiVersion).to.equal('10.0.0');
    });

    describe('request method', () => {

        let client;

        before(() => {
            // setting up a client for all tests to use
            const key     = '12345678901234567890';
            const options = {};

            client = new SparkPost(key, options);
        });

        it('should throw an error when no options are passed', async () => {

            try {
                await client.request(null);
            }
            catch (err) {
                expect(err.name).to.equal('TypeError');
                expect(err.message).to.equal('options argument is required');
            }
        });

        it('should make a request to the API', async () => {

            Nock('https://api.sparkpost.com')
                .get('/api/v1/get/test')
                .reply(200, { ok : true });

            const options = {
                method : 'GET',
                uri    : 'get/test',
                json   : true,
                debug  : true
            };

            const data = await client.request(options);

            expect(data.debug.request.gotOptions.method).to.equal('GET');
            expect(data.ok).to.equal(true);
        });

        it('should throw SparkPost error if invalid response code', { timeout : 5000 }, () => {

            Nock('https://api.sparkpost.com')
                .get('/api/v1/get/error').times(3)
                .reply(500);

            const options = {
                method : 'GET',
                uri    : 'get/error',
                json   : true,
                debug  : true
            };

            return expect(client.request(options)).to.reject('Response code 500 (Internal Server Error)');
        });

        it('should return an error when the request fails', () => {
            // simulate a bad multipart to make request error
            Nock('https://api.sparkpost.com')
                .get('/api/v1/get/test/fail')
                .replyWithError('something awful happened');

            const options = {
                method : 'GET',
                uri    : 'get/test/fail'
            };

            return expect(client.request(options)).to.reject('something awful happened');
        });

        it('should return an error if statusCode not 2XX', () => {
            // simulate a timeout
            Nock('https://api.sparkpost.com')
                .post('/api/v1/post/test/fail')
                .reply(422, { errors : [] });

            const options = {
                method : 'POST'
                , uri  : 'post/test/fail'
            };

            return expect(client.request(options)).to.reject();
        });

        it('should return an error if statusCode not 2XX and there is no body', () => {
            // simulate a timeout
            Nock('https://api.sparkpost.com')
                .post('/api/v1/post/test/fail')
                .reply(422);

            const options = {
                method : 'POST'
                , uri  : 'post/test/fail'
            };

            return expect(client.request(options)).to.reject();
        });

        it('should use a full URI if provided', async () => {

            Nock('https://test.sparkpost.com')
                .get('/test')
                .reply(200, { ok : true });

            const options = {
                method : 'GET',
                uri    : 'https://test.sparkpost.com/test',
                json   : true,
                debug  : true
            };

            const data = await client.request(options);

            expect(data.debug.url).to.equal('https://test.sparkpost.com/test');
        });

        it('should accept gzipped responses', async () => {

            const TEST_MESSAGE = 'This is a compressible test and it is full of compressible test stuff.';
            const options      = {
                method : 'GET',
                uri    : 'https://test.sparkpost.com/test',
                gzip   : true,
                json   : true,
                debug  : true
            };

            const gzipped = Zlib.gzipSync(JSON.stringify({ msg : TEST_MESSAGE + TEST_MESSAGE }));

            Nock('https://test.sparkpost.com', {
                reqheaders : {
                    'accept-encoding' : /gzip/
                }
            }).get('/test').reply(200, gzipped, {
                'X-Transfer-Length'  : String(gzipped.length)
                , 'Content-Length'   : undefined
                , 'Content-Encoding' : 'gzip'
            });

            const data = await client.request(options);

            expect(data.debug.statusCode).to.equal(200);
            expect(data.msg).to.equal(TEST_MESSAGE + TEST_MESSAGE);
        });

        it('should support explicitly disabled gzip option', async () => {

            const TEST_MESSAGE = 'This is an uncompressed test message';

            Nock('https://test.sparkpost.com')
                .get('/test')
                .reply(200, { msg : TEST_MESSAGE });

            const options = {
                method : 'GET',
                uri    : 'https://test.sparkpost.com/test',
                gzip   : false,
                json   : true,
                debug  : true
            };

            const data = await client.request(options);
            expect(data.debug.statusCode).to.equal(200);
            expect(data.msg).to.equal(TEST_MESSAGE);
            expect(data.debug.headers).not.to.include('content-encoding');
        });
    });

    describe('get method', () => {

        let client;

        before(() => {
            // setting up a client for all tests to use
            const key     = '12345678901234567890';
            const options = {};

            client = new SparkPost(key, options);
        });

        it('should deliver a GET + response', async () => {

            const requestSpy = Sinon.spy(SparkPost.prototype, 'request');

            Nock('https://api.sparkpost.com')
                .get('/api/v1/get/test')
                .reply(200, { ok : true });

            const data = await client.get({ uri : 'get/test', debug : true });

            // need to make sure we called request method
            expect(requestSpy.calledOnce).to.be.true();

            // making sure original request was GET
            expect(data.debug.request.gotOptions.method).to.equal('GET');

            SparkPost.prototype.request.restore(); // restoring function
        });

        it('should return a parsed JSON object', async () => {

            Nock('https://test.sparkpost.com')
                .get('/test')
                .reply(200, '{ "ok": true }');

            const options = {
                uri : 'https://test.sparkpost.com/test'
            };

            const data = await client.get(options);

            expect(data).to.not.be.a.string();
            expect(data).to.be.an.object();
            expect(data).to.equal({ ok : true });

        });
    });

    describe('post method', () => {

        let client;

        before(() => {
            // setting up a client for all tests to use
            const key     = '12345678901234567890';
            const options = {};

            client = new SparkPost(key, options);
        });

        it('should deliver a POST', async () => {

            const requestSpy = Sinon.spy(SparkPost.prototype, 'request');

            Nock('https://api.sparkpost.com')
                .post('/api/v1/post/test')
                .reply(200, { ok : true });

            const options = {
                uri     : 'post/test'
                , json  : {
                    testingData : 'test data'
                }
                , debug : true
            };

            const data = await client.post(options);

            // need to make sure we called request method
            expect(requestSpy.calledOnce).to.be.true();

            // making sure original request was POST
            expect(data.debug.request.gotOptions.method).to.equal('POST');

            SparkPost.prototype.request.restore(); // restoring function
        });

        it('should return a parsed JSON object', async () => {

            Nock('https://test.sparkpost.com')
                .post('/test')
                .reply(200, '{ "ok": true }');

            const options = {
                uri    : 'https://test.sparkpost.com/test'
                , json : {
                    testingData : 'test data'
                }
            };

            const data = await client.post(options);

            expect(data).to.not.be.a.string();
            expect(data).to.be.an.object();
            expect(data).to.equal({ ok : true });
        });
    });

    describe('put method', () => {

        let client;

        before(() => {
            // setting up a client for all tests to use
            const key     = '12345678901234567890';
            const options = {};

            client = new SparkPost(key, options);
        });

        it('should deliver a PUT/UPDATE', async () => {

            const requestSpy = Sinon.spy(SparkPost.prototype, 'request');

            Nock('https://api.sparkpost.com')
                .put('/api/v1/put/test')
                .reply(200, { ok : true });

            const options = {
                uri   : 'put/test',
                json  : {
                    testingData : 'test data'
                },
                debug : true
            };

            const data = await client.put(options);
            expect(requestSpy.calledOnce).to.be.true();

            // making sure original request was PUT
            expect(data.debug.request.gotOptions.method).to.equal('PUT');

            SparkPost.prototype.request.restore(); // restoring function
        });

        it('should return a parsed JSON object', async () => {

            Nock('https://test.sparkpost.com')
                .put('/test')
                .reply(200, '{ "ok": true }');

            const options = {
                uri    : 'https://test.sparkpost.com/test'
                , json : {
                    testingData : 'test data'
                }
            };

            const data = await client.put(options);

            expect(data).to.not.be.a.string();
            expect(data).to.be.an.object();
            expect(data).to.equal({ ok : true });
        });
    });

    describe('delete method', () => {

        let client;

        before(() => {
            // setting up a client for all tests to use
            const key     = '12345678901234567890';
            const options = {};

            client = new SparkPost(key, options);
        });

        it('should deliver a DELETE', async () => {

            const requestSpy = Sinon.spy(SparkPost.prototype, 'request');

            Nock('https://api.sparkpost.com')
                .delete('/api/v1/delete/test')
                .reply(200, { ok : true });

            const options = {
                uri   : 'delete/test',
                json  : {
                    testingData : 'test data'
                },
                debug : true
            };

            const data = await client.delete(options);

            expect(requestSpy.calledOnce).to.be.true();

            // making sure original request was DELETE
            expect(data.debug.request.gotOptions.method).to.equal('DELETE');

            SparkPost.prototype.request.restore(); // restoring function
        });

        it('should return a parsed JSON object', async () => {

            Nock('https://test.sparkpost.com')
                .delete('/test')
                .reply(200, '{ "ok": true }');

            const options = {
                uri  : 'https://test.sparkpost.com/test',
                json : {
                    testingData : 'test data'
                }
            };

            const data = await client.delete(options);

            expect(data).to.not.be.a.string();
            expect(data).to.be.an.object();
            expect(data).to.equal({ ok : true });
        });
    });
});

'use strict';

const Version = require('../package.json').version;
const Url     = require('url');
const Got     = require('got');
const Hoek    = require('@hapi/hoek');
const Utils   = require('./utils');

// API'S
const Events          = require('./api/events');
const InboundDomains  = require('./api/inboundDomains');
const MessageEvents   = require('./api/messageEvents');
const RecipientLists  = require('./api/recipientLists');
const RelayWebhooks   = require('./api/relayWebhooks');
const SendingDomains  = require('./api/sendingDomains');
const TrackingDomains = require('./api/trackingDomains');
const Subaccounts     = require('./api/subaccounts');
const SuppressionList = require('./api/suppressionList');
const Templates       = require('./api/templates');
const Transmissions   = require('./api/transmissions');
const Webhooks        = require('./api/webhooks');

const internals = {
    defaults : {
        origin     : 'https://api.sparkpost.com:443',
        apiVersion : 'v1',
        debug      : false
    }
};

class SparkPost {

    constructor(apiKey, options) {

        options = internals.handleOptions(apiKey, options);

        this.apiKey = options.key || process.env.SPARKPOST_API_KEY;

        if (typeof this.apiKey === 'undefined') {
            throw new Error('Client requires an API Key.');
        }

        // adding version to object
        this.version = Version;

        // setting up default headers
        this.defaultHeaders = Hoek.merge({
            'User-Agent'   : internals.createVersionString(Version, options),
            'Content-Type' : 'application/json'
        }, options.headers);

        //Optional client config
        this.origin     = options.origin;
        this.apiVersion = options.apiVersion || internals.defaults.apiVersion;
        this.debug      = (typeof options.debug === 'boolean') ? options.debug : internals.defaults.debug;

        this.events          = new Events(this);
        this.inboundDomains  = new InboundDomains(this);
        this.messageEvents   = new MessageEvents(this);
        this.recipientLists  = new RecipientLists(this);
        this.relayWebhooks   = new RelayWebhooks(this);
        this.sendingDomains  = new SendingDomains(this);
        this.trackingDomains = new TrackingDomains(this);
        this.subaccounts     = new Subaccounts(this);
        this.suppressionList = new SuppressionList(this);
        this.templates       = new Templates(this);
        this.transmissions   = new Transmissions(this);
        this.webhooks        = new Webhooks(this);
    }

    async request(options) {

        const baseUrl = `${ this.origin }/api/${ this.apiVersion }/`;

        // we need options
        if (!Utils.isObject(options)) {
            throw new TypeError('options argument is required');
        }

        // if we don't have a fully qualified URL let's make one
        options.url = internals.resolveUri(baseUrl, options.uri);

        // merge headers
        options.headers = Hoek.merge({}, this.defaultHeaders, options.headers);

        // add Authorization with API Key
        options.headers.Authorization = this.apiKey;

        // set Strict SSL (Always true)
        options.strictSSL = true;

        // default to accepting gzipped responses
        if (typeof options.gzip === 'undefined') {
            options.gzip = true;
        }

        // set debug
        options.debug = (typeof options.debug === 'boolean') ? options.debug : this.debug;

        const { body, ...response } = await Got(options);

        if (options.debug) {

            body.debug = response;
        }

        return body;
    }

    get(options) {

        options.method = 'GET';
        options.json   = true;

        return this.request(options);
    }

    post(options) {

        options.method = 'POST';

        return this.request(options);
    }

    put(options) {

        options.method = 'PUT';

        return this.request(options);
    }

    delete(options) {

        options.method = 'DELETE';

        return this.request(options);
    }
}

internals.resolveUri = (origin, uri) => {

    if (!/^http/.test(uri)) {
        uri = Url.resolve(origin, uri);
    }

    return uri;
};

internals.handleOptions = (apiKey, options) => {

    if (typeof apiKey === 'object') {
        options     = apiKey;
        options.key = process.env.SPARKPOST_API_KEY;
    }
    else {
        options     = options || {};
        options.key = apiKey;
    }

    options.origin = options.origin || internals.defaults.origin;

    return options;
};

internals.createVersionString = (version, options) => {

    let versionStr = `pixulhq-node-sparkpost/${ version } node.js/${ process.version }`;
    if (options.stackIdentity) {
        versionStr += `${ options.stackIdentity } ${ versionStr }`;
    }

    return versionStr;
};

module.exports = SparkPost;

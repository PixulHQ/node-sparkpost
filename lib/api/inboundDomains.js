'use strict';

const api = 'inbound-domains';

const Api = require('../api');

module.exports = class InboundDomains extends Api {

    /**
     * List an overview of all inbound domains in the account.
     *
     * @returns {Promise}
     */
    async list() {

        const options = {
            uri : api
        };

        return await this.client.get(options);
    }

    /**
     * Get an inbound domain by its domain name
     *
     * @param {string} domain
     * @returns {Promise}
     */
    async get(domain) {

        if (!domain || typeof domain !== 'string') {

            throw new Error('domain is required');
        }

        const options = {
            uri : `${ api }/${ domain }`
        };

        return await this.client.get(options);
    }

    /**
     * Create a new inbound domain
     *
     * @param {Object} createOpts
     * @returns {Promise}
     */
    async create(createOpts) {

        if (!createOpts || typeof createOpts !== 'object') {

            throw new Error('create options are required');
        }

        const options = {
            uri  : api,
            json : createOpts
        };

        return await this.client.post(options);
    }

    /**
     * Delete an existing inbound domain
     *
     * @param {string} domain
     * @returns {Promise}
     */
    async delete(domain) {

        if (!domain || typeof domain !== 'string') {

            throw new Error('domain is required');
        }

        const options = {
            uri : `${ api }/${ domain }`
        };

        return await this.client.delete(options);
    }
};


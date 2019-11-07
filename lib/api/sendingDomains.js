'use strict';

const api = 'sending-domains';
const Api = require('../api');

module.exports = class SendingDomains extends Api {

    /**
     * Lists all sending domains
     *
     * @return {Promise}
     */
    async list() {

        const options = {
            uri : api
        };

        return await this.client.get(options);
    }

    /**
     * Get a single sending domain, by domain
     *
     * @param {string} domain - The domain name to get
     * @return {Promise}
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
     * Creates a new sending domain
     *
     * @param {Object} createOpts - attributes used to create the new domain
     * @return {Promise}
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
     * Update an existing sending domain
     *
     * @param {string} domain - The domain to update
     * @param {Object} updateOpts - Hash of the sending domain attributes to update
     * @return {Promise}
     */
    async update(domain, updateOpts) {

        if (typeof domain !== 'string') {

            throw new Error('domain is required');
        }

        if (!updateOpts || typeof updateOpts !== 'object') {

            throw new Error('update options are required');
        }

        const options = {
            uri  : `${ api }/${ domain }`,
            json : updateOpts
        };

        return await this.client.put(options);
    }

    /**
     * Delete an existing sending domain
     *
     * @param {string} domain - The domain to delete
     * @return {Promise}
     */
    async delete(domain) {

        if (typeof domain !== 'string') {

            throw new Error('domain is required');
        }

        const options = {
            uri : `${ api }/${ domain }`
        };

        return await this.client.delete(options);
    }

    /**
     * Verify an existing sending domain
     *
     * @param {string} domain - The domain to verify
     * @param {Object} options - Hash of options to include in verification request
     * @return {Promise}
     */
    async verify(domain, options) {

        if (typeof domain !== 'string') {

            throw new Error('domain is required');
        }

        if (!options || typeof options !== 'object') {

            throw new Error('verification options are required');
        }

        const reqOpts = {
            uri  : `${ api }/${ domain }/verify`,
            json : options
        };

        return await this.client.post(reqOpts);
    }

};

'use strict';

const Api = require('../api');

module.exports = class TrackingDomains extends Api {

    /**
     * Lists all tracking domains
     *
     * @return {Promise}
     */
    async list(options) {

        const reqOpts = {
            uri : TrackingDomains.api,
            qs  : {}
        };

        if (options.default) {

            reqOpts.qs.default = options.default;
        }

        if (options.subaccounts) {

            reqOpts.qs.subaccounts = options.subaccounts;
        }

        return await this.client.get(reqOpts);
    }

    /**
     * Get a single tracking domain by domain
     *
     * @param {string} domain - The domain name to get
     * @return {Promise}
     */
    async get(domain) {

        if (!domain || typeof domain !== 'string') {

            throw new Error('domain is required');
        }

        const options = {
            uri : `${ TrackingDomains.api }/${ domain }`
        };

        return await this.client.get(options);
    }

    /**
     * Creates a new tracking domain
     *
     * @param {Object} createOpts - attributes used to create the new domain
     * @return {Promise}
     */
    async create(createOpts) {

        if (!createOpts || typeof createOpts !== 'object') {

            throw new Error('create options are required');
        }

        const options = {
            uri  : TrackingDomains.api,
            json : createOpts
        };

        return await this.client.post(options);
    }

    /**
     * Update an existing tracking domain
     *
     * @param {string} domain - The domain to update
     * @param {Object} updateOpts - Hash of the tracking domain attributes to update
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
            uri  : `${ TrackingDomains.api }/${ domain }`,
            json : updateOpts
        };

        return await this.client.put(options);
    }

    /**
     * Delete an existing tracking domain
     *
     * @param {string} domain - The domain to delete
     * @return {Promise}
     */
    async delete(domain) {

        if (typeof domain !== 'string') {

            throw new Error('domain is required');
        }

        const options = {
            uri : `${ TrackingDomains.api }/${ domain }`
        };

        return await this.client.delete(options);
    }

    /**
     * Verify an existing tracking domain
     *
     * @param {string} domain - The domain to verify
     * @return {Promise}
     */
    async verify(domain) {

        if (typeof domain !== 'string') {

            throw new Error('domain is required');
        }

        const options = {
            uri : `${ TrackingDomains.api }/${ domain }/verify`
        };

        return await this.client.post(options);
    }

    static get api() {

        return 'tracking-domains';
    }
};

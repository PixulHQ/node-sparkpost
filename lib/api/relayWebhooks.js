'use strict';

const api = 'relay-webhooks';
const Api = require('../api');

module.exports = class RelayWebhook extends Api {

    /**
     * List all relay webhooks
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
     * Get details about a specified relay webhook by its id
     *
     * @param {string} id - the id of the relay webhook you want to look up
     * @returns {Promise}
     */
    async get(id) {

        if (!id || typeof id !== 'string') {

            throw new Error('id is required');
        }

        const options = {
            uri : `${ api }/${ id }`
        };

        return await this.client.get(options);
    }

    /**
     * Create a new relay webhook
     *
     * @param {Object} webhook - an object of [relay webhook attributes]{https://developers.sparkpost.com/api/relay-webhooks#header-relay-webhooks-object-properties}
     * @returns {Promise}
     */
    async create(webhook) {

        if (!webhook || typeof webhook !== 'object') {

            throw new Error('webhook object is required');
        }

        const options = {
            uri  : api,
            json : webhook
        };

        return await this.client.post(options);
    }

    /**
     * Update an existing relay webhook
     *
     * @param {string} id - the id of the relay webhook you want to update
     * @param {Object} webhook - an object of [relay webhook attributes]{https://developers.sparkpost.com/api/relay-webhooks#header-relay-webhooks-object-properties}
     * @returns {Promise}
     */
    async update(id, webhook) {

        if (!id || typeof id !== 'string') {

            throw new Error('id is required');
        }

        if (!webhook || typeof webhook !== 'object') {

            throw new Error('webhook object is required');
        }

        const options = {
            uri  : `${ api }/${ id }`,
            json : webhook
        };

        return await this.client.put(options);
    }

    /**
     * Delete an existing relay webhook
     *
     * @param {string} id - the id of the relay webhook you want to delete
     * @returns {Promise}
     */
    async delete(id) {

        if (!id || typeof id !== 'string') {

            throw new Error('id is required');
        }

        const options = {
            uri : `${ api }/${ id }`
        };

        return await this.client.delete(options);
    }

};

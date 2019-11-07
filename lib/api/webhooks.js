'use strict';

const Api = require('../api');

module.exports = class Webhooks extends Api {

    /**
     * Lists all webhooks
     *
     * @param {Object} [options] - Hash of options
     * @param {string} [options.timezone] - The timezone to use for the last_successful and last_failure properties.
     * @returns {Promise}
     */
    async list(options = {}) {

        const reqOpts = {
            uri          : Webhooks.api,
            searchParams : {}
        };

        if (options.timezone) {

            reqOpts.searchParams.timezone = options.timezone;
        }

        return await this.client.get(reqOpts);
    }

    /**
     * Get a single webhook by ID
     *
     * @param {string} id - The ID of the webhook to get
     * @param {Object} [options] - Hash of options
     * @param {string} [options.timezone] - The timezone to use for the last_successful and last_failure properties.
     * @returns {Promise}
     */
    async get(id, options = {}) {

        if (typeof id !== 'string') {

            throw new Error('id is required');
        }

        const reqOpts = {
            uri          : `${ Webhooks.api }/${ id }`,
            searchParams : {}
        };

        if (options.timezone) {

            reqOpts.searchParams.timezone = options.timezone;
        }

        return await this.client.get(reqOpts);
    }

    /**
     * Creates a new webhook
     *
     * @param {Object} webhook - attributes used to create the new webhook
     * @returns {Promise}
     */
    async create(webhook) {

        if (!webhook || typeof webhook !== 'object') {

            throw new Error('webhook object is required');
        }

        const options = {
            uri  : Webhooks.api,
            body : webhook,
            json : true
        };

        return await this.client.post(options);
    }

    /**
     * Update an existing webhook
     *
     * @param {string} id - The ID of the webhook to update
     * @param {Object} webhook - Hash of the webhook attributes to update
     * @returns {Promise}
     */
    async update(id, webhook) {

        if (!id) {

            throw new Error('id is required');
        }

        if (!webhook || typeof webhook !== 'object') {

            throw new Error('webhook object is required');
        }

        const options = {
            uri  : `${ Webhooks.api }/${ id }`,
            body : webhook,
            json : true
        };

        return await this.client.put(options);
    }

    /**
     * Delete an existing webhook
     *
     * @param {string} id - The ID of the webhook to delete
     * @returns {Promise}
     */
    async delete(id) {

        if (!id || typeof id !== 'string') {

            throw new Error('id is required');
        }

        const options = {
            uri : `${ Webhooks.api }/${ id }`
        };

        return await this.client.delete(options);
    }

    /**
     * Sends an example message event batch from the Webhook API to the target URL.
     *
     * @param {string} id - The ID of the webhook to validate
     * @param {Object} options - Hash of options used to validate the webhook
     * @param {string} options.message - The message (payload) to send to the webhook consumer.
     * @returns {Promise}
     */
    async validate(id, options) {

        if (!id || typeof id !== 'string') {

            throw new Error('id is required');
        }

        if (!options || !options.message) {

            throw new Error('message is required');
        }

        const reqOpts = {
            uri  : `${ Webhooks.api }/${ id }/validate`,
            body : {
                message : options.message
            },
            json : true
        };

        return await this.client.post(reqOpts);
    }

    /**
     * Gets recent status information about a webhook.
     *
     * @param {string} id - The ID of the webhook to check
     * @param {Object} [options] - Hash of options
     * @param {string} [options.limit] - The maximum number of results to return.
     * @returns {Promise}
     */
    async getBatchStatus(id, options = {}) {

        if (!id || typeof id !== 'string') {

            throw new Error('id is required');
        }

        const reqOpts = {
            uri          : `${ Webhooks.api }/${ id }/batch-status`,
            searchParams : {}
        };

        if (options.limit) {
            reqOpts.searchParams.limit = options.limit;
        }

        return await this.client.get(reqOpts);
    }

    /**
     * Lists descriptions of the events, event types, and event fields that could be included in a Webhooks post to your target URL.
     *
     * @returns {Promise}
     */
    async getDocumentation() {

        const reqOpts = {
            uri : `${ Webhooks.api }/events/documentation`
        };

        return await this.client.get(reqOpts);
    }

    /**
     * Lists examples of the event data that will be posted to a webhook consumer.
     *
     * @param {Object} [options] - Hash of options
     * @param {string} [options.events] - A comma delimited list of events to get samples of.
     * @returns {Promise}
     */
    async getSamples(options = {}) {

        const reqOpts = {
            uri          : `${ Webhooks.api }/events/samples`,
            searchParams : {}
        };

        if (options.events) {

            reqOpts.searchParams.events = options.events;
        }

        return await this.client.get(reqOpts);
    }

    static get api() {

        return 'webhooks';
    }
};

'use strict';

const Api = require('../api');

module.exports = class SuppressionList extends Api {

    /**
     * Lists all entries in your suppression list,
     * filtered by an optional set of parameters
     *
     * @param {Object} [parameters] - Hash of parameters to filter results
     * @return {Promise}
     */
    async list(parameters) {

        const options = {
            uri : SuppressionList.api,
            qs  : parameters
        };

        return await this.client.get(options);
    }

    /**
     * Gets a single entry by email address ID
     *
     * @param {String} email
     * @return {Promise}
     */
    async get(email) {

        if (!email || typeof email !== 'string') {

            throw new Error('email is required');
        }

        const options = {
            uri : `${ SuppressionList.api }/${ email }`
        };

        return await this.client.get(options);
    }

    /**
     * Updates existing entries, or creates entries
     * if they don't exist for that email address ID
     *
     * @param {Array|Object} listEntries - List of suppression entry objects to upsert
     * @return {Promise}
     */
    async upsert(listEntries) {

        if (!listEntries || typeof listEntries === 'function') {

            throw new Error('list entries is required');
        }

        if (!Array.isArray(listEntries)) {

            listEntries = [listEntries];
        }

        const options = {
            uri  : SuppressionList.api,
            json : { recipients : listEntries }
        };

        return await this.client.put(options);
    }

    /**
     * Deletes a single entry, by email address ID
     *
     * @param {String} email
     * @return {Promise}
     */
    async delete(email) {

        if (!email || typeof email !== 'string') {

            throw new Error('email is required');
        }

        const options = {
            uri : `${ SuppressionList.api }/${ email }`
        };

        return await this.client.delete(options);
    }

    static get api() {

        return 'suppression-list';
    }

};

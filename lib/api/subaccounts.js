'use strict';

const api = 'subaccounts';
const Api = require('../api');

module.exports = class Subaccounts extends Api {

    /**
     * List a summary of all subaccounts
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
     * Get details about a specified subaccount by its id
     *
     * @param {string} id - the id of the subaccount you want to look up
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
     * Create a new subaccount
     *
     * @param subaccount - an object of [subaccount attributes]{https://developers.sparkpost.com/api/subaccounts#header-request-body-attributes}
     * @returns {Promise}
     */
    async create(subaccount) {

        if (!subaccount || typeof subaccount !== 'object') {

            throw new Error('subaccount object is required');
        }

        const reqOpts = {
            uri  : api,
            json : subaccount
        };

        return await this.client.post(reqOpts);
    }

    /**
     * Update existing subaccount by id
     *
     * @param {string} id - the id of the subaccount you want to update
     * @param {Object} subaccount - an object of [subaccount attributes]{https://developers.sparkpost.com/api/subaccounts#header-request-body-attributes-1}
     * @returns {Promise}
     */
    async update(id, subaccount) {

        if (!id || typeof id !== 'string') {

            throw new Error('id is required');
        }

        if (!subaccount || typeof subaccount !== 'object') {

            throw new Error('subaccount object is required');
        }

        const options = {
            uri  : `${ api }/${ id }`,
            json : subaccount
        };

        return await this.client.put(options);
    }
};

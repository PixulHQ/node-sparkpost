'use strict';

const Api = require('../api');

module.exports = class RecipientLists extends Api {

    /**
     * Get a list of all your recipient lists
     * https://developers.sparkpost.com/api/recipient-lists#recipient-lists-retrieve-get
     *
     * @return {Promise}
     */
    async list() {

        return await this.client.get({
            uri : RecipientLists.api
        });
    }

    /**
     * Get a list of all your recipient lists
     * https://developers.sparkpost.com/api/recipient-lists#recipient-lists-list-get
     *
     * @param {string} id - Unique ID of the list to return
     * @param {Object} options - Hash of request options
     * @return {Promise}
     */
    async get(id, options = {}) {

        if (!id) {

            throw new Error('id is required');
        }

        const reqOpts = {
            uri : `${ RecipientLists.api }/${ id }`,
            qs  : options
        };

        return await this.client.get(reqOpts);
    }

    /**
     * Create a new recipient list
     * https://developers.sparkpost.com/api/recipient-lists#recipient-lists-create-post
     *
     * @param  {Object} recipientList - recipient list object
     * @param  {Array} recipientList.recipients - Array of recipient objects
     * @return {Promise}
     */
    async create(recipientList) {

        if (!recipientList || typeof recipientList !== 'object' || !recipientList.recipients) {

            throw new Error('recipient list is required');
        }

        const options = {
            uri  : RecipientLists.api,
            json : recipientList,
            qs   : {
                num_rcpt_errors : recipientList.num_rcpt_errors
            }
        };

        return await this.client.post(options);
    }

    /**
     * Update an existing list
     * https://developers.sparkpost.com/api/recipient-lists#recipient-lists-update-put
     *
     * @param {string} id - Unique ID of the list to be updated
     * @param {Object} recipientList - recipient list object
     * @param  {Array} recipientList.recipients - Array of recipient objects
     * @return {Promise}
     *
     */
    async update(id, recipientList) {

        if (!id) {

            throw new Error('recipient list id is required');
        }

        if (!recipientList || typeof recipientList === 'function') {

            throw new Error('recipient list is required');
        }

        const options = {
            uri  : `${ RecipientLists.api }/${ id }`,
            json : recipientList,
            qs   : {
                num_rcpt_errors : recipientList.num_rcpt_errors
            }
        };

        return await this.client.put(options);
    }

    /**
     * Delete an existing recipient list
     * https://developers.sparkpost.com/api/recipient-lists#recipient-lists-delete-delete
     *
     * @param {string} id - ID of the list to be updated
     * @return {Promise}
     *
     */
    async delete(id) {

        if (!id || typeof id !== 'string') {

            throw new Error('id is required');
        }

        const options = {
            uri : `${ RecipientLists.api }/${ id }`
        };

        return await this.client.delete(options);
    }

    static get api() {

        return 'recipient-lists';
    }
};

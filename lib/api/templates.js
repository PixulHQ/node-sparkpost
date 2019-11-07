'use strict';

const api  = 'templates';
const Api  = require('../api');
const Hoek = require('@hapi/hoek');

module.exports = class Templates extends Api {

    /**
     * List an overview of all templates.
     *
     * @returns {Promise}
     */
    async list() {

        return await this.client.get({
            uri : api
        });
    }

    /**
     * Get details about a specified template by its id.
     *
     * @param {string} id
     * @param {Object} options
     * @returns {Promise}
     */
    async get(id, options = {}) {

        if (!id) {

            throw new Error('template id is required');
        }

        const reqOpts = {
            uri : `${ api }/${ id }`,
            qs  : options
        };

        return await this.client.get(reqOpts);
    }

    /**
     * Create a new template.
     *
     * @param {Object} template
     * @returns {Promise}
     */
    async create(template) {

        if (!template || typeof template !== 'object') {

            throw new Error('template object is required');
        }

        const options = {
            uri  : api,
            json : template
        };

        return await this.client.post(options);
    }

    /**
     * Update an existing template.
     *
     * @param {String} id
     * @param {Object} template
     * @param {Object} options
     * @returns {Promise}
     */
    async update(id, template, options = {}) {

        if (!id) {

            throw new Error('template id is required');
        }

        if (!template || typeof template !== 'object') {

            throw new Error('template object is required');
        }

        const reqOpts = {
            uri  : `${ api }/${ id }`,
            json : template,
            qs   : options
        };

        return await this.client.put(reqOpts);
    }

    /**
     * Delete an existing template.
     *
     * @param {String} id
     * @returns {Promise}
     */
    async delete(id) {

        if (!id || typeof id !== 'string') {

            throw new Error('template id is required');
        }

        const options = {
            uri : `${ api }/${ id }`
        };

        return await this.client.delete(options);
    }

    /**
     * Preview the most recent version of an existing template by id.
     *
     * @param {String} id
     * @param {Object} options
     * @returns {Promise}
     */
    async preview(id, options = {}) {

        if (!id) {

            throw new Error('template id is required');
        }

        const reqOpts = {
            uri  : `${ api }/${ id }/preview`,
            json : Hoek.clone(options),
            qs   : {}
        };

        // Add draft to query params
        if (reqOpts.json.hasOwnProperty('draft')) {

            reqOpts.qs.draft = reqOpts.json.draft;
            delete reqOpts.json.draft;
        }

        return await this.client.post(reqOpts);
    }
};

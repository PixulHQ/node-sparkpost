'use strict';

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
            uri : Templates.api
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
            uri          : `${ Templates.api }/${ id }`,
            searchParams : options
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
            uri  : Templates.api,
            body : template,
            json : true
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
            uri          : `${ Templates.api }/${ id }`,
            body         : template,
            json         : true,
            searchParams : options
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
            uri : `${ Templates.api }/${ id }`
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
            uri          : `${ Templates.api }/${ id }/preview`,
            body         : Hoek.clone(options),
            json         : true,
            searchParams : {}
        };

        // Add draft to query params
        if (reqOpts.body.hasOwnProperty('draft')) {

            reqOpts.searchParams.draft = reqOpts.body.draft;
            delete reqOpts.body.draft;
        }

        return await this.client.post(reqOpts);
    }

    static get api() {

        return 'templates';
    }
};

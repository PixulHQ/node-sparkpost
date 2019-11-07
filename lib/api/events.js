'use strict';

const Api   = require('../api');
const Utils = require('../utils');

module.exports = class Events extends Api {

    /**
     * Search for events using given parameters
     *
     * @param {Object} parameters
     * @returns {Promise}
     */
    async search(parameters) {

        const options = Utils.parseParams({
            uri : `${ Events.api }/message`,
            qs  : {}
        }, parameters);

        return await this.client.get(options);
    }

    static get api() {

        return 'events';
    }
};


'use strict';

const Api   = require('../api');
const Utils = require('../utils');

module.exports = class MessageEvents extends Api {

    /**
     * Search for message events using given parameters
     *
     * @param {Object} parameters
     * @returns {Promise}
     */
    async search(parameters) {

        const options = Utils.parseParams({
            uri          : MessageEvents.api,
            searchParams : {}
        }, parameters);

        return await this.client.get(options);
    }

    static get api() {

        return 'message-events';
    }
};

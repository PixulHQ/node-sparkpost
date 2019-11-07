'use strict';

const api = 'message-events';

const Api = require('../api');

/*
 * "Class" declaration, Message Events API exposes one function:
 * - search: retrieves list of message events according to given params
 */

module.exports = class MessageEvents extends Api {

    /**
     * Search for message events using given parameters
     *
     * @param {Object} parameters
     * @returns {Promise}
     */
    async search(parameters) {

        const options = {
            uri : api,
            qs  : {}
        };

        Object.keys(parameters).forEach((paramname) => {

            if (Array.isArray(parameters[paramname])) {

                options.qs[paramname] = parameters[paramname].join(',');
            }
            else {

                options.qs[paramname] = parameters[paramname];
            }
        });

        return await this.client.get(options);
    }
};

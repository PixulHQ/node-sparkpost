'use strict';

const Hoek  = require('@hapi/hoek');
const Utils = require('../utils');
const Api   = require('../api');

const internals = {};

module.exports = class Transmissions extends Api {

    /**
     * List an overview of all transmissions in the account
     *
     * @param {Object} options
     * @returns {Promise}
     */
    async list(options = {}) {

        const reqOpts = {
            uri : Transmissions.api,
            qs  : options
        };

        return await this.client.get(reqOpts);
    }

    /**
     * Retrieve the details about a transmission by its id
     *
     * @param {String} id
     * @returns {Promise}
     */
    async get(id) {

        if (typeof id !== 'string') {

            throw new Error('id is required');
        }

        const options = {
            uri : `${ Transmissions.api }/${ id }`
        };

        return await this.client.get(options);
    }

    /**
     * Sends a message by creating a new transmission
     *
     * @param {Object} transmission
     * @param {Object} options
     * @returns {Promise}
     */
    async send(transmission, options = {}) {

        if (!transmission || typeof transmission !== 'object') {

            throw new Error('transmission object is required');
        }

        transmission = internals.formatPayload(transmission);

        const reqOpts = {
            uri  : Transmissions.api,
            json : transmission,
            qs   : options
        };

        return await this.client.post(reqOpts);
    }

    static get api() {

        return 'transmissions';
    }
};

internals.formatPayload = (originalTransmission) => {

    const transmission = Hoek.clone(originalTransmission);

    // don't format the payload if we are not given an array of recipients
    if (!Array.isArray(transmission.recipients)) {

        return transmission;
    }

    // format all the original recipients to be in the object format
    transmission.recipients = transmission.recipients.map((recipient) => {

        recipient.address = internals.addressToObject(recipient.address);

        return recipient;
    });

    // add the CC headers
    if (Array.isArray(transmission.cc) && transmission.cc.length > 0) {

        if (!transmission.content) {

            transmission.content = {};
        }

        if (!transmission.content.headers) {

            transmission.content.headers = {};
        }

        transmission.content.headers.CC = internals.generateCCHeader(transmission);
    }

    const headerTo = internals.generateHeaderTo(transmission.recipients);

    transmission.recipients = internals.addListToRecipients(transmission, 'cc', headerTo);
    transmission.recipients = internals.addListToRecipients(transmission, 'bcc', headerTo);

    delete transmission.cc;
    delete transmission.bcc;

    return transmission;
};

internals.addListToRecipients = (transmission, listName, headerTo) => {

    if (!Array.isArray(transmission[listName])) {
        return transmission.recipients;
    }

    return transmission.recipients.concat(transmission[listName].map((recipient) => {

        recipient.address = internals.addressToObject(recipient.address);

        recipient.address.header_to = headerTo;

        // remove name from address - name is only put in the header for cc and not at all for bcc
        if (recipient.address.hasOwnProperty('name')) {
            delete recipient.address.name;
        }

        return recipient;
    }));
};

internals.generateCCHeader = (transmission) => {

    return transmission.cc.map((ccRecipient) => internals.addressToString(ccRecipient.address)).join(', ');
};

internals.generateHeaderTo = (recipients) => {
    // if a recipient has a header_to then it is cc'd or bcc'd and we don't want it in the header_to value
    const originalRecipients = recipients.filter((recipient) => !recipient.address.hasOwnProperty('header_to'));

    return originalRecipients.map((recipient) => internals.addressToString(recipient.address)).join(', ');
};

internals.addressToString = (address) => {

    if (Utils.isObject(address)) {

        if (address.hasOwnProperty('name')) {

            address = `"${ address.name }" <${ address.email }>`;
        }
        else {

            address = address.email;
        }
    }

    return address;
};

internals.addressToObject = (address) => {

    let addressObject = address;

    if (typeof address === 'string') {
        addressObject = {};

        const matches = /"?(.[^"]*)?"?\s*<(.+)>/gi.exec(address);

        if (matches) {
            addressObject.name  = matches[1];
            addressObject.email = matches[2];
        }
        else {
            addressObject.email = address;
        }
    }

    return addressObject;
};

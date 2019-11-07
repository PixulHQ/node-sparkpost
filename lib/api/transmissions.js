'use strict';

const Hoek  = require('@hapi/hoek');
const Utils = require('../utils');
const Api   = require('../api');

const api = 'transmissions';

/*
 * "Class" declaration, Transmissions exposes three functions, one for sending a transmission,
 * another for getting a list of transmissions that have been sent, and another for getting
 * info about a specific transmission
 */
module.exports = class Transmissions extends Api {

    /**
     * List an overview of all transmissions in the account
     *
     * @param {Object} options
     * @returns {Promise}
     */
    async list(options = {}) {

        const reqOpts = {
            uri : api,
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
            uri : `${ api }/${ id }`
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

        transmission = formatPayload(transmission);

        const reqOpts = {
            uri  : api,
            json : transmission,
            qs   : options
        };

        return await this.client.post(reqOpts);
    }

};

const formatPayload = (originalTransmission) => {

    const transmission = Hoek.clone(originalTransmission);

    // don't format the payload if we are not given an array of recipients
    if (!Array.isArray(transmission.recipients)) {

        return transmission;
    }

    // format all the original recipients to be in the object format
    transmission.recipients = transmission.recipients.map((recipient) => {

        recipient.address = addressToObject(recipient.address);

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

        transmission.content.headers.CC = generateCCHeader(transmission);
    }

    const headerTo = generateHeaderTo(transmission.recipients);

    transmission.recipients = addListToRecipients(transmission, 'cc', headerTo);
    transmission.recipients = addListToRecipients(transmission, 'bcc', headerTo);

    delete transmission.cc;
    delete transmission.bcc;

    return transmission;
};

const addListToRecipients = (transmission, listName, headerTo) => {

    if (!Array.isArray(transmission[listName])) {
        return transmission.recipients;
    }

    return transmission.recipients.concat(transmission[listName].map((recipient) => {

        recipient.address = addressToObject(recipient.address);

        recipient.address.header_to = headerTo;

        // remove name from address - name is only put in the header for cc and not at all for bcc
        if (recipient.address.hasOwnProperty('name')) {
            delete recipient.address.name;
        }

        return recipient;
    }));
};

const generateCCHeader = (transmission) => {

    return transmission.cc.map((ccRecipient) => addressToString(ccRecipient.address)).join(', ');
};

const generateHeaderTo = (recipients) => {
    // if a recipient has a header_to then it is cc'd or bcc'd and we don't want it in the header_to value
    const originalRecipients = recipients.filter((recipient) => !recipient.address.hasOwnProperty('header_to'));

    return originalRecipients.map((recipient) => addressToString(recipient.address)).join(', ');
};

const addressToString = (address) => {

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

const addressToObject = (address) => {

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

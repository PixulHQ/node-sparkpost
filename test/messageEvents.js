'use strict';

const Sinon = require('sinon');

const Code = require('@hapi/code');
const Lab  = require('@hapi/lab');

const { describe, it, beforeEach } = exports.lab = Lab.script();
const { expect }                   = Code;

describe('Message Events Library', () => {

    let client;
    let messageEvents;

    beforeEach(() => {

        client = {
            get : Sinon.stub().resolves({})
        };

        messageEvents = new (require('../lib/api/messageEvents'))(client);
    });

    describe('search Method', () => {

        it('should call client get method with the appropriate parameters', () => {

            const options = {
                bounce_classes   : '10,50',
                campaign_ids     : 'test_campaign',
                events           : 'bounce',
                friendly_froms   : 'bob@example.com',
                from             : '2015-11-14T16:15',
                message_ids      : '0e0d94b7-9085-4e3c-ab30-e3f2cd9c273e',
                page             : 1,
                per_page         : 5,
                reason           : '%5.2.0%',
                recipients       : 'jim@example.com',
                template_ids     : 'newsletter_template',
                timezone         : 'America/New_York',
                to               : '2016-11-14T16:15',
                transmission_ids : '65832150921904138'
            };
            return messageEvents.search(options)
                .then(() => {

                    Object.keys(options).forEach((key) => {

                        expect(client.get.firstCall.args[0].qs).to.include(key);
                        expect(client.get.firstCall.args[0].qs[key]).to.equal(options[key]);
                    });
                });
        });

        it('should accept arrays as parameters where appropriate', () => {

            const arroptions = {
                bounce_classes   : [10, 50],
                campaign_ids     : ['campaign1', 'campaignTwo'],
                events           : ['bounce', 'out_of_band'],
                friendly_froms   : ['bob@example.com', 'jim@example.com'],
                message_ids      : ['0e0d94b7-9085-4e3c-ab30-e3f2cd9c273e', '338ac622-4321-5678-0123456789'],
                recipients       : ['jim@example.com', 'bob@example.com'],
                template_ids     : ['newsletter_template', 'newsflash_template'],
                transmission_ids : ['65832150921904138', '54673829032039839'],
                page             : 1,
                per_page         : 5,
                timezone         : 'America/New_York'
            };

            return messageEvents.search(arroptions)
                .then(() => {

                    Object.keys(arroptions).forEach((key) => {

                        const opt         = arroptions[key];
                        const firstCallQS = client.get.firstCall.args[0].qs;

                        if (Array.isArray(opt)) {

                            expect(firstCallQS).to.include(key);
                            expect(firstCallQS[key]).equal(opt.toString());
                        }
                    });
                });
        });
    });
});

'use strict';

const key       = 'YOURAPIKEY';
const SparkPost = require('sparkpost');

const client  = new SparkPost(key);
const webhook = {
    name   : 'Test Relay Webhook',
    target : 'http://client.test.com/test-webhook',
    match  : {
        domain : 'inbound.example.com'
    }
};

// Promise
client.relayWebhooks.create(webhook).then((data) => {

    console.log('Congrats you can use our client library!');
    console.log(data);
}).catch((err) => {

    console.log('Whoops! Something went wrong');
    console.log(err);
});

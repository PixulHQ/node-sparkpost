'use strict';

const key       = 'YOURAPIKEY';
const SparkPost = require('sparkpost');

const client  = new SparkPost(key);
const webhook = {
    target : 'http://client.test.com/test-webhook'
};

// Promise
client.relayWebhooks.update('123456789', webhook).then((data) => {

    console.log('Congrats you can use our client library!');
    console.log(data);
}).catch((err) => {

    console.log('Whoops! Something went wrong');
    console.log(err);
});

'use strict';

const key       = 'YOURAPIKEY';
const SparkPost = require('sparkpost');

const client  = new SparkPost(key);
const webhook = {
    name       : 'Test Webhook',
    target     : 'http://client.test.com/test-webhook',
    auth_token : 'AUTH_TOKEN',
    events     : [
        'delivery',
        'injection',
        'open',
        'click'
    ]
};

// Promise
client.webhooks.create(webhook).then((data) => {

    console.log('Congrats you can use our client library!');
    console.log(data);
}).catch((err) => {

    console.log('Whoops! Something went wrong');
    console.log(err);
});

'use strict';

const key       = 'YOURAPIKEY';
const SparkPost = require('sparkpost');

const client  = new SparkPost(key);
const options = {
    limit : 1000
};

// Promise
client.webhooks.getBatchStatus('TEST_WEBHOOK_UUID', options).then((data) => {

    console.log('Congrats you can use our client library!');
    console.log(data);
}).catch((err) => {

    console.log('Whoops! Something went wrong');
    console.log(err);
});

'use strict';

const key       = 'YOURAPIKEY';
const SparkPost = require('sparkpost');

const client     = new SparkPost(key);
const createOpts = {
    domain : 'example1.com'
};

// Promise
client.trackingDomains.create(createOpts).then((data) => {

    console.log('Congrats you can use our client library!');
    console.log(data);
}).catch((err) => {

    console.log('Whoops! Something went wrong');
    console.log(err);
});

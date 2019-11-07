'use strict';

const key       = 'YOURAPIKEY';
const SparkPost = require('sparkpost');

const client = new SparkPost(key);

// Returns 1000 events for the last hour

// Promise
client.messageEvents.search({}).then((data) => {

    console.log('Congrats you can use our client library!');
    console.log(data);
}).catch((err) => {

    console.log('Whoops! Something went wrong');
    console.log(err);
});



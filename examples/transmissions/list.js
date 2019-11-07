'use strict';

const key       = 'YOURAPIKEY';
const SparkPost = require('sparkpost');

const client = new SparkPost(key);

// Promise
client.transmissions.list().then((data) => {

    console.log(data);
    console.log('Congrats you can use our client library!');
}).catch((err) => {

    console.log(err);
});

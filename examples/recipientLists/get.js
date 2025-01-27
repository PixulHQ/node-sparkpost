'use strict';

const key       = 'YOURAPIKEY';
const SparkPost = require('sparkpost');

const client  = new SparkPost(key);
const options = {
    show_recipients : true
};

// Promise
client.recipientLists.get('UNIQUE_TEST_ID', options).then((data) => {

    console.log('Congrats you can use our client library!');
    console.log(data);
}).catch((err) => {

    console.log('Whoops! Something went wrong');
    console.log(err);
});


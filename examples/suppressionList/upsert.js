'use strict';

const key       = 'YOURAPIKEY';
const SparkPost = require('sparkpost');

const client    = new SparkPost(key);
const listEntry = {
    recipient         : 'test1@test.com',
    transactional     : false,
    non_transactional : true,
    description       : 'Test description 1'
};

// Promise
client.suppressionList.upsert(listEntry).then((data) => {

    console.log('Congrats you can use our client library!');
    console.log(data);
}).catch((err) => {

    console.log('Whoops! Something went wrong');
    console.log(err);
});

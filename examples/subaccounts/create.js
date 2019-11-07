'use strict';

const key       = 'YOURAPIKEY';
const SparkPost = require('sparkpost');

const client     = new SparkPost(key);
const subaccount = {
    name       : 'Test Subaccount',
    key_label  : 'Test Subaccount key',
    key_grants : [
        'smtp/inject',
        'transmissions/modify'
    ]
};

// Promise
client.subaccounts.create(subaccount).then((data) => {

    console.log('Congrats you can use our client library!');
    console.log(data);
}).catch((err) => {

    console.log('Whoops! Something went wrong');
    console.log(err);
});

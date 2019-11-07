'use strict';

const key       = 'YOURAPIKEY';
const SparkPost = require('sparkpost');

const client     = new SparkPost(key);
const subaccount = {
    name   : 'Test Subaccount',
    status : 'suspended'
};

// Promise
client.subaccounts.update('123', subaccount).then((data) => {

    console.log('Congrats you can use our client library!');
    console.log(data);
}).catch((err) => {

    console.log('Whoops! Something went wrong');
    console.log(err);
});

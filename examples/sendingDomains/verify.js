'use strict';

const key       = 'YOURAPIKEY';
const SparkPost = require('sparkpost');

const client  = new SparkPost(key);
const options = {
    dkim_verify          : true,
    spf_verify           : true,
    abuse_at_verify      : true,
    postmaster_at_verify : true
};

// Promise
client.sendingDomains.verify('example1.com', options).then((data) => {

    console.log('Congrats you can use our client library!');
    console.log(data);
}).catch((err) => {

    console.log('Whoops! Something went wrong');
    console.log(err);
});

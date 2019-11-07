'use strict';

const key       = 'YOURAPIKEY';
const SparkPost = require('sparkpost');

const client     = new SparkPost(key);
const parameters = {
    from  : '2015-05-07T00:00:00+0000',
    to    : '2015-05-07T23:59:59+0000',
    limit : 5
};

// Promise
client.suppressionList.list(parameters).then((data) => {

    console.log('Congrats you can use our client library!');
    console.log(data);
}).catch((err) => {

    console.log('Whoops! Something went wrong');
    console.log(err);
});

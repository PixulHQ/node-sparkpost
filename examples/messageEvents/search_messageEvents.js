'use strict';

const key       = 'YOURAPIKEY';
const SparkPost = require('sparkpost');

const client       = new SparkPost(key);
const searchParams = {
    from           : '2016-01-01T00:00',
    to             : '2016-01-02T23:59',
    page           : 1,
    per_page       : 5,
    events         : ['bounce', 'out_of_band'],
    bounce_classes : [10]
};

// Promise
client.messageEvents.search(searchParams).then((data) => {

    console.log('Congrats you can use our client library!');
    console.log(data);
}).catch((err) => {

    console.log('Whoops! Something went wrong');
    console.log(err);
});


'use strict';

const key       = 'YOURAPIKEY';
const SparkPost = require('sparkpost');

const client       = new SparkPost(key);
const transmission = {
    recipients : {
        list_id : 'example-list'
    },
    content    : {
        from    : 'From Envelope <from@example.com>',
        subject : 'Example Email for Stored List and Inline Content',
        html    : '<html><body><p>Hello World</p></body></html>',
        text    : 'Hello World!'
    }
};

// Promise
client.transmissions.send(transmission).then((data) => {

    console.log('Congrats you can use our client library!');
    console.log(data);
}).catch((err) => {

    console.log('Whoops! Something went wrong');
    console.log(err);
});

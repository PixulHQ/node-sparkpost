'use strict';

const key       = 'YOURAPIKEY';
const SparkPost = require('sparkpost');

const client       = new SparkPost(key);
const transmission = {
    recipients : {
        list_id : 'example-list'
    },
    content    : {
        from        : 'From Envelope <from@example.com>',
        subject     : 'Example Email for Stored List and Template',
        template_id : 'my-template'
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

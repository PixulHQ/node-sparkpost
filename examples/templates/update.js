'use strict';

const key       = 'YOURAPIKEY';
const SparkPost = require('sparkpost');

const client   = new SparkPost(key);
const template = {
    content : {
        from    : 'test@test.com',
        subject : 'Updated Test email template!',
        html    : '<b>This is a test email template! Updated!</b>'
    }
};

// Promise
client.templates.update('TEST_ID', template).then((data) => {

    console.log('Congrats you can use our client library!');
    console.log(data);
}).catch((err) => {

    console.log('Whoops! Something went wrong');
    console.log(err);
});

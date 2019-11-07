'use strict';

const key       = 'YOURAPIKEY';
const SparkPost = require('sparkpost');

const client   = new SparkPost(key);
const template = {
    id      : 'TEST_ID',
    name    : 'Test Template',
    content : {
        from    : 'test@test.com',
        subject : 'Test email template!',
        html    : '<b>This is a test email template!</b>'
    }
};

// Promise
client.templates.create(template).then((data) => {

    console.log('Congrats you can use our client library!');
    console.log(data);
}).catch((err) => {

    console.log('Whoops! Something went wrong');
    console.log(err);
});

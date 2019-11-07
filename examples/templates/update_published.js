'use strict';

const key       = 'YOURAPIKEY';
const SparkPost = require('sparkpost');

const client   = new SparkPost(key);
const template = {
    content : {
        from    : 'test@test.com',
        subject : 'Updated Published Test email template!',
        html    : '<b>This is a published test email template! Updated!</b>'
    }
};
const options  = {
    update_published : true
};

// Promise
client.templates.update('TEST_ID', template, options).then((data) => {

    console.log('Congrats you can use our client library!');
    console.log(data);
}).catch((err) => {

    console.log('Whoops! Something went wrong');
    console.log(err);
});

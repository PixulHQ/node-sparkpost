'use strict';

const key       = 'YOURAPIKEY';
const SparkPost = require('sparkpost');

const client        = new SparkPost(key);
const recipientList = {
    id         : 'EXISTING_TEST_ID',
    name       : 'Test Recipient List',
    recipients : [
        {
            address : {
                email : 'test1@test.com'
            }
        },
        {
            address : {
                email : 'test2@test.com'
            }
        },
        {
            address : {
                email : 'test3@test.com'
            }
        }
    ]
};

// Promise
client.recipientLists.update(recipientList).then((data) => {

    console.log('Congrats you can use our client library!');
    console.log(data);
}).catch((err) => {

    console.log(err);
});


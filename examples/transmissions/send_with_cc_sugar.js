'use strict';

const key       = 'YOURAPIKEY';
const SparkPost = require('sparkpost');

const client       = new SparkPost(key);
const transmission = {
    recipients : [
        {
            address           : {
                email : 'original.recipient@example.com',
                name  : 'Original Recipient'
            },
            substitution_data : {
                recipient_type : 'Original'
            }
        }
    ],
    cc         : [
        {
            address           : {
                email : 'cc.recipient@example.com',
                name  : 'Carbon Copy Recipient'
            },
            substitution_data : {
                recipient_type : 'CC'
            }
        }
    ],
    content    : {
        from    : {
            name  : 'Node CC Test',
            email : 'from@example.com'
        },
        subject : 'Example email using cc',
        text    : 'An example email using cc with SparkPost to the {{recipient_type}} recipient.',
        html    : '<p>An example email using cc with SparkPost to the {{recipient_type}} recipient.</p>'
    }
};

// Promise
client.transmissions.send(transmission).then((data) => {

    console.log('Congrats! You sent an email with cc using SparkPost!');
    console.log(data);
}).catch((err) => {

    console.log('Whoops! Something went wrong');
    console.log(err);
});

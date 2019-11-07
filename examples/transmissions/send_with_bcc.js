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
        },
        {
            address           : {
                email     : 'bcc.recipient@example.com',
                header_to : '"Original Recipient" <original.recipient@example.com>'
            },
            substitution_data : {
                recipient_type : 'BCC'
            }
        }
    ],
    content    : {
        from    : {
            name  : 'Node BCC Test',
            email : 'from@example.com'
        },
        subject : 'Example email using bcc',
        text    : 'An example email using bcc with SparkPost to the {{recipient_type}} recipient.',
        html    : '<p>An example email using bcc with SparkPost to the {{recipient_type}} recipient.</p>'
    }
};

// Promise
client.transmissions.send(transmission).then((data) => {

    console.log(data);
    console.log('Congrats! You sent an email with bcc using SparkPost!');
}).catch((err) => {

    console.log('Whoops! Something went wrong');
    console.log(err);
});

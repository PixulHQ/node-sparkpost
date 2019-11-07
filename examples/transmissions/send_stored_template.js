'use strict';

const key       = 'YOURAPIKEY';
const SparkPost = require('sparkpost');

const client       = new SparkPost(key);
const transmission = {
    campaign_id : 'ricks-campaign',
    content     : {
        template_id : 'ricks-template'
    },
    recipients  : [{ address : { email : 'rick.sanchez@rickandmorty100years.com', name : 'Rick Sanchez' } }]
};
const options      = {
    num_rcpt_errors : 3
};

// Promise
client.transmissions.send(transmission, options).then((data) => {

    console.log('What up my glib globs! SparkPost!');
    console.log(data);
}).catch((err) => {

    console.log('Whoops! Something went wrong');
    console.log(err);
});

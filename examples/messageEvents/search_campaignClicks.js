'use strict';

const key       = 'YOURAPIKEY';
const SparkPost = require('sparkpost');

const client       = new SparkPost(key);
const searchParams = {
    events       : 'click',
    campaign_ids : 'monday_mailshot'
};

// Promise
client.messageEvents.search(searchParams).then((data) => {

    console.log('Congrats you can use our client library!');
    console.log(data);
}).catch((err) => {

    console.log('Whoops! Something went wrong');
    console.log(err);
});

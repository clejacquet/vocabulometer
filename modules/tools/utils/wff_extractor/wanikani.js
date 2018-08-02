const request = require('request');

const userApiKey = '4f4a80d0dfcd5dbb2371c82745a798d7';

request({
    url: `https://www.wanikani.com/api/user/${userApiKey}/vocabulary`,
    method: 'GET'
}, (err, response, body) => {
    if (err) {
        return console.error(err);
    }

    const doc = JSON.parse(body);

    const words = doc.requested_information.general
        .filter(entry => entry.user_specific.srs_numeric >= 7)
        .map(entry => entry.character);

    console.log(words);
    console.log(words.length);
});
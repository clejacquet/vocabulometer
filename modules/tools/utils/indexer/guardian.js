const async = require('async');
const request = require('request');

const apiKey = 'eb620722-3e37-4696-b435-254b72127703';

request({
    url: 'https://content.guardianapis.com/search',
    method: 'GET',
    qs: {
        'api-key': apiKey,
        'show-fields': 'bodyText',
        'page-size': 10
    }
}, (err, response, body) => {
    if (err) {
        return console.error(err);
    }

    if (!(response.statusCode >= 200 && response.statusCode < 300)) {
        console.error(`Bad response code: ${response.statusCode}`);
    }

    const doc = JSON.parse(body);

    const texts = doc.response.results.map(result => ({
        srcId: result.id,
        section: result.sectionId,
        title: result.webTitle,
        text: result.fields.bodyText,
        date: new Date(result.webPublicationDate)
    }));
    console.log(texts);
});
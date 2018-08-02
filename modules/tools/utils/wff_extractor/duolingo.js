const request = require('request');
const _ = require('underscore');

const username = 'clejacquet';

request({
    url: `https://www.duolingo.com/users/${username}`,
    method: 'GET'
}, (err, response, body) => {
    if (err) {
        return console.error(err);
    }

    const doc = JSON.parse(body);

    const words =
        _.uniq(
            _.flatten(
                doc.language_data.en.skills
                    .filter(skills => skills.learned === true)
                    .map(skills => skills.words)
                ,
                1
            )
        ).sort();

    console.log(words);
    console.log(words.length);
});
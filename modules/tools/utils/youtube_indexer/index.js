const request = require('request');

const options = {
    url: 'http://vocabulometer-dev.herokuapp.com/api/datasets/youtube',
    headers: {
        "Authorization": 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkNsw6ltZW50MjMiLCJpYXQiOjE1MjcyMjc1NzcsImV4cCI6MTUyNzgzMjM3N30.zPk0HoLmujUZu8fiORMjHD2qKoVGDRsQKb1ICEAvNWE'
    },
    json: {
        uri: [
            'https://www.youtube.com/watch?v=g3vSYbT1Aco',
            'https://www.youtube.com/watch?v=iG9CE55wbtY',
            'https://www.youtube.com/watch?v=UyyjU8fzEYU',
            'https://www.youtube.com/watch?v=YrtANPtnhyg',
        ]
    }
};

request.post(options, (err, response, body) => {
    if (err) {
        return console.error(err);
    }

    console.log(response.statusCode);
    console.log(body);
});
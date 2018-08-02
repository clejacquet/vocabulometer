const async = require('async');
const request = require('request');
const mongoose = require('mongoose');


mongoose.connect('mongodb://ds223760.mlab.com:23760/vocabulometer-texts', {
    user: 'clejacquet',
    pass: 'clejacquet-imp'
});

const textSchema = new mongoose.Schema({
    text: {
        title: String,
        words: [String]
    }
}, {
    collection: 'texts_en'
});

const model = mongoose.model('Text', textSchema);

console.log('DB accessed');

model.find({}, '_id', function (err, person) {
    if (err) {
        return console.error(err);
    }

    const uris = person.map(person => person._id);

    const options = {
        url: 'http://vocabulometer-dev.herokuapp.com/api/datasets/english/local',
        json: { uri: uris },
        headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhZDgyZTE0MTM5MzVjMDAwNDQzNzZjMiIsImlhdCI6MTUzMjUwMDEzOSwiZXhwIjoxNTMzMTA0OTM5fQ.C23P3UnkXFcl4iFw0WPc1SC5XBAHjqBE4VczYeTkNB4'
        }
    };

    request.post(options, (err, response, body) => {
        if (err) {
            return console.error(err);
        }

        console.log(response.statusCode);
        console.log(body);

        mongoose.disconnect();
    });
});
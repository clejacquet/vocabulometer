const request = require('request');
const fs = require('fs');
const path = require('path');
const async = require('async');

const sourceDir = [
    '../doc/texts/bbc/business',
    '../doc/texts/bbc/entertainment',
    '../doc/texts/bbc/politics',
    '../doc/texts/bbc/sport',
    '../doc/texts/bbc/tech',
];

sourceDir.forEach((dir) => {
    fs.readdir(dir, (err, files) => {
        if (err) {
            return console.error(err);
        }

        // fs.readFile(path.join(dir, files[0]), 'utf8', (err, data) => {
        //     if (err) {
        //         cb(err);
        //     }
        //
        //     const lines = data.split('\n\n');
        //     const title = lines.splice(0, 1)[0];
        //     const text = lines.join('\n');
        //
        //     request.post('http://10.127.11.133/api/texts', {
        //         json: {
        //             title: title,
        //             text: text
        //         }
        //     }, (err, response, body) => {
        //         if (err) {
        //             return cb(err);
        //         }
        //
        //         if (!err && response.statusCode >= 200 && response.statusCode < 300) {
        //             cb(null, true);
        //         }
        //     })
        // });
        console.log(files.length);

        async.map(files, (file, cb) => {
            fs.readFile(path.join(dir, file), 'utf8', (err, data) => {
                if (err) {
                    cb(err);
                }

                const lines = data.split('\n\n');
                const title = lines.splice(0, 1)[0];
                const text = lines.join('\n');

                request.post('http://localhost:4100/api/texts', {
                    json: {
                        title: title,
                        body: text,
                        source: 'BBC'
                    }
                }, (err, response, body) => {
                    if (err) {
                        return cb(err);
                    }

                    if (!err && response.statusCode >= 200 && response.statusCode < 300) {
                        cb(null, true);
                    }
                })
            });
        }, (err, res) => {
            if (err) {
                return console.error(err);
            }

            console.log('success');
        });
    });
});
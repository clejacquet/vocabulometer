const fs = require('fs');
const async = require('async');

async.map(
    Array(10).fill(1).map((item, i) => 'headwords/headwords-' + (i + 1) + '.txt'),
    (filename, cb) => fs.readFile(filename, 'utf8', cb),
    (err, files) => {
        if (err) {
            return console.error(err);
        }

        fs.writeFile('headwords/merged.txt', files.join('\r\n\r\n'), (err1) => {
            if (err1) {
                return console.error(err1);
            }
        });
    });
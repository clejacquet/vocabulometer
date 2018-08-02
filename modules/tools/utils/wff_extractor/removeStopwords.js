const fs = require('fs');
const async = require('async');

const stopWordsFile = 'stopwords.txt';

const rows = [
    { in: 'out1/A1.txt', out: 'out2/A1.txt' },
    { in: 'out1/A2.txt', out: 'out2/A2.txt' },
    { in: 'out1/B1.txt', out: 'out2/B1.txt' },
    { in: 'out1/B2.txt', out: 'out2/B2.txt' },
    { in: 'out1/C1.txt', out: 'out2/C1.txt' },
    { in: 'out1/C2.txt', out: 'out2/C2.txt' }
];

fs.readFile(stopWordsFile, 'utf8', (err, data) => {
    if (err) {
        return console.error(err);
    }

    const stopWords = data.split('\r\n');

    const tasks = rows.map((row) => {
        return (cb) => fs.readFile(row.in, 'utf8', (err, data) => {
            if (err) {
                return cb(err);
            }

            const words = data
                .split('\n')
                .filter((word) => !stopWords.includes(word))

            fs.writeFile(row.out, words.join('\n'), cb);
        });
    });

    async.parallel(tasks, (err) => {
        if (err) {
            return console.error(err);
        }

        console.log('success');
    })
});
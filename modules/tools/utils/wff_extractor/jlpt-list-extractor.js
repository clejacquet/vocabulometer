const fs = require('fs');
const async = require('async');

Array(5).fill(0).forEach((_, i) => {
    fs.readFile(`jlpt/vocab-n${i + 1}.csv`, 'utf8', (err, doc) => {
        if (err) {
            return console.error(err);
        }

        const lines = doc
            .split(/\r?\n/g)
            .map(line => line.split(','))
            .map(line => line[0].length === 0 ? line[1] : line[0]);

        fs.writeFile(`jlpt/n${i + 1}.txt`, lines.join('\r\n'), (err) => {
            if (err) {
                return console.error(err);
            }

            console.log(`n${i + 1} done`);
        })
    });
});


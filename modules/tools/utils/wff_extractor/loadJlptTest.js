const async = require('async');
const fs = require('fs');

async.parallel(Array(5).fill(0).map((elem, i) => {
    return cb => {
        fs.readFile(`tests/n${i + 1}.txt`, 'utf8', (err, content) => {
            if (err) {
                return cb(err);
            }

            const lines = content.split(/\r?\n/g);
            const packs = lines.reduce((acc, current) => {
                if (acc[acc.length - 1].length === 8) {
                    acc.push([]);
                }

                acc[acc.length - 1].push(current);
                return acc;
            }, [[]]);

            cb(undefined, packs.map(pack => ({
                word: pack[0].trim(),
                sentence: pack[1].trim(),
                a: pack[2].trim(),
                b: pack[3].trim(),
                c: pack[4].trim(),
                d: pack[5].trim(),
                answer: pack[6].trim()
            })));
        })
    };
}), (err, levels) => {
    if (err) {
        return console.error(err);
    }

    fs.writeFile('tests/list-questions-jp.json', JSON.stringify(levels), (err) => {
        if (err) {
            return console.error(err);
        }

        console.log('done');
    });
});
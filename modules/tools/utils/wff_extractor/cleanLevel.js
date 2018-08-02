const fs = require('fs');
const async = require('async');

const rows = [
    { file: 'A1/f-j.txt', out: 'A1/f-j.out.txt', min: 'f', max: 'j' },
    { file: 'A1/k-o.txt', out: 'A1/k-o.out.txt', min: 'k', max: 'o' },
    { file: 'A1/p-t.txt', out: 'A1/p-t.out.txt', min: 'p', max: 't' },
    { file: 'A1/u-z.txt', out: 'A1/u-z.out.txt', min: 'u', max: 'z' },

    { file: 'A2/a-e.txt', out: 'A2/a-e.out.txt', min: 'a', max: 'e' },
    { file: 'A2/f-j.txt', out: 'A2/f-j.out.txt', min: 'f', max: 'j' },
    { file: 'A2/k-o.txt', out: 'A2/k-o.out.txt', min: 'k', max: 'o' },
    { file: 'A2/p-t.txt', out: 'A2/p-t.out.txt', min: 'p', max: 't' },
    { file: 'A2/u-z.txt', out: 'A2/u-z.out.txt', min: 'u', max: 'z' },

    { file: 'B1/a-e.txt', out: 'B1/a-e.out.txt', min: 'a', max: 'e' },
    { file: 'B1/f-j.txt', out: 'B1/f-j.out.txt', min: 'f', max: 'j' },
    { file: 'B1/k-o.txt', out: 'B1/k-o.out.txt', min: 'k', max: 'o' },
    { file: 'B1/p-t.txt', out: 'B1/p-t.out.txt', min: 'p', max: 't' },
    { file: 'B1/u-z.txt', out: 'B1/u-z.out.txt', min: 'u', max: 'z' },

    { file: 'B2/a-e.txt', out: 'B2/a-e.out.txt', min: 'a', max: 'e' },
    { file: 'B2/f-j.txt', out: 'B2/f-j.out.txt', min: 'f', max: 'j' },
    { file: 'B2/k-o.txt', out: 'B2/k-o.out.txt', min: 'k', max: 'o' },
    { file: 'B2/p-t.txt', out: 'B2/p-t.out.txt', min: 'p', max: 't' },
    { file: 'B2/u-z.txt', out: 'B2/u-z.out.txt', min: 'u', max: 'z' },

    { file: 'C1/a-e.txt', out: 'C1/a-e.out.txt', min: 'a', max: 'e' },
    { file: 'C1/f-j.txt', out: 'C1/f-j.out.txt', min: 'f', max: 'j' },
    { file: 'C1/k-o.txt', out: 'C1/k-o.out.txt', min: 'k', max: 'o' },
    { file: 'C1/p-t.txt', out: 'C1/p-t.out.txt', min: 'p', max: 't' },
    { file: 'C1/u-z.txt', out: 'C1/u-z.out.txt', min: 'u', max: 'z' },

    { file: 'C2/a-e.txt', out: 'C2/a-e.out.txt', min: 'a', max: 'e' },
    { file: 'C2/f-j.txt', out: 'C2/f-j.out.txt', min: 'f', max: 'j' },
    { file: 'C2/k-o.txt', out: 'C2/k-o.out.txt', min: 'k', max: 'o' },
    { file: 'C2/p-t.txt', out: 'C2/p-t.out.txt', min: 'p', max: 't' },
    { file: 'C2/u-z.txt', out: 'C2/u-z.out.txt', min: 'u', max: 'z' },
];

function uniq(a) {
    const seen = {};
    return a.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}

const tasks = rows.map((row) => {
    return cb => {
        fs.readFile(row.file, 'utf8', (err, data) => {
            if (err) {
                return console.error(err);
            }

            const words = uniq(data
                .split('\r\n')
                .filter((word) => word[0] >= row.min && word[0] <= row.max));

            fs.writeFile(row.out, words.join('\n'), cb);
        });
    };
});

async.parallel(tasks, (err) => {
    if (err) {
        return console.error(err);
    }

    console.log('success');
});

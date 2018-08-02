const fs = require('fs');
const async = require('async');
const _ = require('underscore');

const rows = [
    {
        files: [
            'treated/A1/a-e.out.txt',
            'treated/A1/f-j.out.txt',
            'treated/A1/k-o.out.txt',
            'treated/A1/p-t.out.txt',
            'treated/A1/u-z.out.txt',
        ],
        out: 'out/A1.txt'
    },
    {
        files: [
            'treated/A2/a-e.out.txt',
            'treated/A2/f-j.out.txt',
            'treated/A2/k-o.out.txt',
            'treated/A2/p-t.out.txt',
            'treated/A2/u-z.out.txt',
        ],
        out: 'out/A2.txt'
    },
    {
        files: [
            'treated/B1/a-e.out.txt',
            'treated/B1/f-j.out.txt',
            'treated/B1/k-o.out.txt',
            'treated/B1/p-t.out.txt',
            'treated/B1/u-z.out.txt',
        ],
        out: 'out/B1.txt'
    },
    {
        files: [
            'treated/B2/a-e.out.txt',
            'treated/B2/f-j.out.txt',
            'treated/B2/k-o.out.txt',
            'treated/B2/p-t.out.txt',
            'treated/B2/u-z.out.txt',
        ],
        out: 'out/B2.txt'
    },
    {
        files: [
            'treated/C1/a-e.out.txt',
            'treated/C1/f-j.out.txt',
            'treated/C1/k-o.out.txt',
            'treated/C1/p-t.out.txt',
            'treated/C1/u-z.out.txt',
        ],
        out: 'out/C1.txt'
    },
    {
        files: [
            'treated/C2/a-e.out.txt',
            'treated/C2/f-j.out.txt',
            'treated/C2/k-o.out.txt',
            'treated/C2/p-t.out.txt',
            'treated/C2/u-z.out.txt',
        ],
        out: 'out/C2.txt'
    },
];

const tasks = rows.map((row) => {
    return (cb) => {
        const stasks = row.files.map((file) => {
            return (scb) => fs.readFile(file, 'utf8', scb);
        });

        async.parallel(stasks, (err, results) => {
            if (err) {
                return cb(err);
            }

            results = results.map(str => str.split('\n'));

            const words = _.sortBy(_.uniq(_.flatten(results)));

            fs.writeFile(row.out, words.join('\n'), cb);
        });
    }
});

async.parallel(tasks, (err) => {
    if (err) {
        return console.error(err);
    }

    console.log('success');
});
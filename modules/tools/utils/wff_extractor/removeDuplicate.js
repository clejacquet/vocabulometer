const fs = require('fs');
const async = require('async');

const paths = [
    'out/A1.txt',
    'out/A2.txt',
    'out/B1.txt',
    'out/B2.txt',
    'out/C1.txt',
    'out/C2.txt',
];

const tasks = paths.map((path) => {
    return (cb) => fs.readFile(path, 'utf8', cb);
});

async.parallel(tasks, (err, files) => {
    if (err) {
        return console.error(err);
    }

    files = files.map((file) => file.split('\n'));

    const rows = [
        { in: 0, filters: [], out: 'out1/A1.txt' },
        { in: 1, filters: [0], out: 'out1/A2.txt' },
        { in: 2, filters: [0, 1], out: 'out1/B1.txt' },
        { in: 3, filters: [0, 1, 2], out: 'out1/B2.txt' },
        { in: 4, filters: [0, 1, 2, 3], out: 'out1/C1.txt' },
        { in: 5, filters: [0, 1, 2, 3, 4], out: 'out1/C2.txt' },
    ];

    const tasks2 = rows.map((row) => {
        return (cb) => {
            const words = files[row.in].filter((word) => {
                const result = row.filters.filter((fileId) => {
                    return files[fileId].includes(word)
                });

                return result.length === 0;
            });

            fs.writeFile(row.out, words.join('\n'), cb);
        }
    });

    async.parallel(tasks2, (err) => {
        if (err) {
            return console.error(err);
        }

        console.log('success');
    })
});



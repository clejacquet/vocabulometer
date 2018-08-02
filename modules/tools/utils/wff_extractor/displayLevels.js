const fs = require('fs');
const async = require('async');
const _ = require('underscore');

const levels = [
    { name: 'A1', file: 'out2/A1.txt' },
    { name: 'A2', file: 'out2/A2.txt' },
    { name: 'B1', file: 'out2/B1.txt' },
    { name: 'B2', file: 'out2/B2.txt' },
    { name: 'C1', file: 'out2/C1.txt' },
    { name: 'C2', file: 'out2/C2.txt' }
];


const tasks = levels.map((level) => {
    return (cb) => {
        fs.readFile(level.file, 'utf8', (err, data) => {
            if (err) {
                return cb(err);
            }

            cb(null, {
                data: data.split('\n'),
                name: level.name
            });
        });
    }
});

async.parallel(tasks, (err, levelsData) => {
    if (err) {
        return console.error(err);
    }

    const computedData = levelsData.map((levelData, i) => {
        return {
            name: levelData.name,
            length: levelData.data.length,
            cumulative: levelsData
                .slice(0, i + 1)
                .map((levelData1) => levelData1.data.length)
                .reduce((acc, length) => acc + length, 0)
        };
    });

    computedData.forEach((level) => {
        console.log('Level ' + level.name + ': ' + level.length + ' words [Cum.: ' + level.cumulative + ']');
    });
});



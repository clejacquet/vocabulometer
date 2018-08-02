const csv = require('csvtojson');
const fs = require('fs');
const async = require('async');

const FILE = 'wff.csv';

const levels = {A1: [], A2: [], B1: [], B2: [], C1: [], C2: []};

csv()
    .fromFile(FILE)
    .on('json',(result)=>{
        levels.A1.push(result.A1);
        levels.A2.push(result.A2);
        levels.B1.push(result.B1);
        levels.B2.push(result.B2);
        levels.C1.push(result.C1);
        levels.C2.push(result.C2);
    })
    .on('done',(error)=>{
        if (error) {
            return console.error(error);
        }

        levels.A1 = levels.A1.filter((word) => word !== '' && word !== 'A1');
        levels.A2 = levels.A2.filter((word) => word !== '' && word !== 'A2');
        levels.B1 = levels.B1.filter((word) => word !== '' && word !== 'B1');
        levels.B2 = levels.B2.filter((word) => word !== '' && word !== 'B2');
        levels.C1 = levels.C1.filter((word) => word !== '' && word !== 'C1');
        levels.C2 = levels.C2.filter((word) => word !== '' && word !== 'C2');

        const tasks = Object.keys(levels)
            .map((level) => {
                return (cb) => fs.writeFile(level + '.csv', levels[level].join('\n'), cb);
            });

        async.parallel(tasks, (err, results) => {
            if (err) {
                console.error(err);
            }

            console.log('success');
        })
    });


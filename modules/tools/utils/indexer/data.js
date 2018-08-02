const fs = require('fs');
const async = require('async');
const mongoose = require('mongoose');


mongoose.connect('mongodb://ds151820.mlab.com:51820/vocabulometer-dev', {
    user: 'clejacquet',
    pass: 'clejacquet-imp'
});

const wordEnglishSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    word: String,
    time: { type: Date, default: Date.now }
}, {collection: 'words_en'});

const model = mongoose.model('EnglishWord', wordEnglishSchema);

console.log('DB accessed');

fs.readFile('data.json', 'utf8', (err, content) => {
    if (err) {
        return console.error(err);
    }

    const doc = JSON.parse(content);

    doc.map(item => {
        item.time = new Date(item.time['$date']);
        item.userId = item.userId['$oid'];
        return item;
    });

    const groups = doc.reduce((acc, cur) => {
        if (acc[acc.length - 1].length === 500) {
            acc.push([]);
        }

        acc[acc.length - 1].push(cur);
        return acc;
    }, [[]]);

    async.seq(...groups.map((group, i) => {
        return (cb) => {
            model.create(group, (err) => {
                if (err) {
                    return cb(err);
                }

                console.log('done #' + (i + 1));
                cb();
            });
        }
    }))((err) => {
        if (err) {
            return console.error(err);
        }

        console.log('done');
    });
});
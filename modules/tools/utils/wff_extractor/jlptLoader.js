const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const fs = require('fs');
const async = require('async');

const connectionString = 'mongodb://ds151820.mlab.com:51820/vocabulometer-dev';

mongoose.connect(connectionString, {
    user: 'clejacquet',
    pass: 'clejacquet-imp'
})
    .then(() => {
        const schema = new mongoose.Schema({
            word: String,
            level: Number
        }, {
            collection: 'vocabs_jp'
        });

        const model = mongoose.model('Vocab', schema);

        async.parallel(Array(5).fill(1)
            .map((item, i) => {
                return (cb) => {
                    fs.readFile(`jlpt/n${5 - i}.txt`, 'utf8', (err, content) => {
                        if (err) {
                            return cb(err);
                        }

                        const wordsVocab = content
                            .split(/\r?\n/g)
                            .filter(word => word !== '')
                            .map((word) => ({
                                word: word,
                                level: i + 1
                            }));

                        wordsVocab.push({
                            word: `<${i + 1}>`,
                            level: i + 1
                        });

                        model.create(wordsVocab, cb);
                    })
                }
            }), (err, results) => {
            if (err) {
                return console.error(err);
            }

            console.log(results);
        })
    })
    .catch((err) => console.error(err));
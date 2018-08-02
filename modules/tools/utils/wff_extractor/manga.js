const request = require('request');
const fs = require('fs');
const async = require('async');
const _ = require('underscore');
const mongoose = require('mongoose');

const connectionString = 'mongodb://ds151820.mlab.com:51820/vocabulometer-dev';
const CHUNK_SIZE = 20;

async.parallel([
    (cb) => {
        mongoose.connect(connectionString, {
            user: 'clejacquet',
            pass: 'clejacquet-imp'
        })
            .then(() => cb())
            .catch((err) => cb(err))
    },
    (cb) => {
        fs.readFile('grouped.json', 'utf8', (err, content) => {
            if (err) {
                return console.error(err);
            }

            const mangaList = JSON.parse(content);
            const texts = mangaList.map(manga => manga.text
                .replace(/\n\n/g, '\n'));

            const textChunks = texts.reduce((acc, text) => {
                if (acc[acc.length - 1].length >= CHUNK_SIZE) {
                    acc.push([]);
                }
                acc[acc.length - 1].push(text);
                return acc;
            }, [[]]);

            async.series(textChunks.map((textChunk, i) => {
                return cb1 => {
                    request({
                        url: `http://192.168.0.17:2345`,
                        method: 'POST',
                        json: {
                            texts: textChunk
                        }
                    }, (err, response, doc) => {
                        if (err) {
                            return cb1(err);
                        }

                        console.log(` > Chunk #${i + 1}/${textChunks.length} done`);
                        cb1(undefined, doc);
                    });
                }
            }), (err, chunkResults) => {
                if (err) {
                    return cb(err);
                }

                const texts = _.flatten(chunkResults.map(res => res.texts), 1);

                texts.forEach((text, i) => {
                    mangaList[i].words = _.flatten(
                        text.result.map(paragraph =>
                            paragraph.words
                                .filter(word => word.hasOwnProperty('lemma'))
                                .map(word => word.lemma)),
                        1);
                });

                cb(undefined, mangaList);
            });
        });
    },
], (err, results) => {
    if (err) {
        return console.error(err);
    }

    const schema = new mongoose.Schema({
        uri: {
            type: String
        },
        title: String,
        words: [String]
    }, {
        collection: 'dataset_manga_jp'
    });

    const model = mongoose.model('manga', schema);

    const mangaList = results[1];

    model.insertMany(mangaList.map(manga => ({
        uri: manga.link,
        title: manga.title,
        words: manga.words
    })), (err, doc) => {
        if (err) {
            return console.error(err);
        }

        console.log('done');
        mongoose.disconnect(() => console.log('db disconnected'));
    })
});






const crawler = require('crawler');
const request = require('request');
const fs = require('fs');
const _ = require('underscore');

const c = new crawler({
    maxConnections : 10,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error) {
            console.log(error);
        }

        done();
    }
});

function crawl(article) {
    c.queue({
        uri: article.url,
        callback: function (err, res, done) {
            if (err) {
                console.error(err);
            } else {
                const $ = res.$;

                $('.article-body ruby rt').remove();

                const text = $('.article-body').text();

                const lines = text
                    .split(/\r?\n/g)
                    .map(line => line.trim())
                    .filter(line => line !== '');

                const finalText = [article.title].concat(lines).join('\n');

                fs.writeFile('jp_out/' + article.id + '.txt', finalText, (err) => {
                    if (err) {
                        console.error(err);
                    }
                });
            }

            done();
        }
    });
}

request.get({
    url: 'https://www3.nhk.or.jp/news/easy/news-list.json',
    encoding: 'utf8'
}, (err, response, body) => {
    if (err) {
        return console.error(err);
    }

    const list = JSON.parse(body);

    const articles = _.flatten(Object.keys(list[0]).map((dayItem => {
        return list[0][dayItem].map(item => ({
            id: item.news_id,
            title: item.title,
            date: new Date(item.news_prearranged_time),
            url: 'https://www3.nhk.or.jp/news/easy/' + item.news_id + '/' + item.news_id + '.html'
        }));
    })), 1);

    articles.forEach(article => {
        crawl(article);
    })
});
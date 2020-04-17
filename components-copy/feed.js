const FeedParser = require('feedparser');
const request = require('request');
const util = require('./util');

/** @return Promise<Site> */
function feed(feedUrl) {
    console.log('get feed:', feedUrl)
    return new Promise((resolve, reject) => {
        const req = request(feedUrl);
        const parser = new FeedParser({});
        req.on('error', reject);
        req.on('response', function (res) {
            // `this` is `req`, which is a stream
            const stream = this;
            if (res.statusCode !== 200) {
                this.emit('error', new Error('Bad status code'));
            } else {
                stream.pipe(parser);
            }
        });
        parser.on('error', reject);
        parser.on('readable', function () {
            const stream = this;
            if (!this.items) {
                this.items = {};
            }
            let article;
            while (article = stream.read()) {
                // console.debug('feed parser article: ', article);
                const guid = encodeURIComponent(article.guid);
                this.items[guid] = {
                    guid: article.guid,
                    title: util.htmlDeCode(article.title),
                    author: article.author,
                    pubDate: article.pubDate,
                    summary: util.htmlDeCode(article.summary),
                    categories: article.categories,
                    content: util.htmlDeCode(article.description),
                    image: util.getImgUrl(article.description),
                    commentLink: article.comments
                };
            }
        });
        parser.on('finish', function () {
            // console.debug('meta:', this.meta);
            resolve({
                feedUrl: feedUrl,
                siteTitle: this.meta.title,
                siteUrl: this.meta.link,
                pubDate: this.meta.date,
                description: this.meta.description,
                articles: this.items,
                updateAt: new Date()
            });
        })
    });
}

module.exports = feed;

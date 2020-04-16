const FeedParser = require('feedparser');
const request = require('request');

function feed(url) {
    console.log('get feed:', url)
    return new Promise((resolve, reject) => {
        const req = request(url);
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
                this.items = [];
            }
            let i;
            while (i = stream.read()) {
                this.items.push(i);
            }
        });
        parser.on('finish', function () {
            resolve({meta: this.meta, articles: this.items, update: new Date()})
        })
    });
}

module.exports = feed;

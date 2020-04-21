const FeedParser = require('feedparser');
const Site = require('../data/Site');
const Article = require('../data/Article');
const Util = require('../util');

module.exports = function (feedUrl) {
    return new Promise((resolve, reject) => {
        try {
            Util.log('start feed: ', feedUrl);
            const parser = new FeedParser({});
            parser.on('error', reject);
            parser.on('readable', function () {
                const stream = this;
                if (!this.items) {
                    this.items = [];
                }
                let article;
                while (article = stream.read()) {
                    Util.log('read one feed article.', this.items.length);
                    if (this.items.length === 0) {
                        this.baseLink = Util.getFirstUrlOriginOrNull(article.link, article.guid, this.meta.link, feedUrl);
                    }
                    this.items.push(new Article({
                        feedUrl: feedUrl,
                        guid: article.guid,
                        title: Util.fromHtmlEntities(article.title),
                        author: article.author,
                        summary: Util.removeHtmlTags(Util.fromHtmlEntities(article.summary || article.description)),
                        image: Util.getImgUrl(this.baseLink, article.description || article.summary),
                        categories: article.categories,
                        content: Util.fromHtmlEntities(article.description),
                        link: article.link,
                        commentLink: article.comments,
                        pubDate: article.pubDate,
                    }));
                }
            });
            parser.on('finish', function () {
                Util.log('feed finish');
                resolve({
                    site: new Site({
                        feedUrl: feedUrl,
                        siteName: this.meta.title,
                        siteUrl: this.meta.link,
                        description: this.meta.description,
                        pubDate: this.meta.date,
                    }),
                    articles: this.items,
                });
            });
            // 发起请求
            $http({
                method: 'get',
                url: feedUrl,
                responseType: 'stream'
            }).then(response => {
                response.data.pipe(parser);
            }).catch(reject);
        } catch (e) {
            Util.log('feed error:', e)
            reject(e);
        }
    });
}

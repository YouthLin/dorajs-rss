// 每个站点页
//----------

const util = require('./util');
const feed = require('./feed');

module.exports = {
    type: 'list',
    async fetch({args}) {
        util.log('list fetch... args=', args);
        const site = await util.loadStorage(args.feedUrl, feed);
        // util.log('list site=', site);
        const items = [];
        items.push({
            title: site.siteTitle + ' ' + site.siteUrl,
            summary: `更新时间：${util.dateToString(site.pubDate)}\n${site.description}`,
            onClick: function () {
                $ui.browser(site.siteUrl);
            }
        });
        items.push({
            title: '点击刷新 [上次刷新：' + util.dateToString(site.updateAt) + ']',
            onClick: function () {
                feed(site.feedUrl)
                    .then(updated => {
                        util.addArticles(site, updated.articles);
                        util.saveStorage(this.feedUrl, site);
                    })
                    .catch(e => {
                        $ui.toast('发生了错误!' + e)
                    });
                this.refresh();
            }
        })
        items.push({
            // 占位横条
            title: '',
            style: 'category'
        });
        const articles = site.articles;
        for (const guid in articles) {
            if (articles.hasOwnProperty(guid)) {
                const article = articles[guid];
                items.push({
                    style: 'article',
                    title: article.title,
                    time: util.dateToString(article.pubDate),
                    author: article.author ? {name: article.author} : null,
                    summary: article.summary,
                    thumb: article.image,
                    route: $route("article", {feedUrl: site.feedUrl, guid})
                });
            }
        }
        return {items};
    }
}

const feed = require('../service/feed');
const Util = require('../util');
const SiteDao = require('../dao/SiteDao');
const siteDao = new SiteDao();
const ArticleDao = require('../dao/ArticleDao');
const articleDao = new ArticleDao();

module.exports = {
    type: 'list',
    fetch({args}) {
        Util.log('on site page args=', args);
        const site = siteDao.findByFeedUrl(args.feedUrl);
        const items = [];

        items.push({
            title: site.siteName + ' ' + site.siteUrl,
            summary: `更新时间：${Util.dateToString(site.pubDate)}\n${site.description}`,
            onClick: function () {
                $ui.browser(site.siteUrl);
            }
        });
        items.push({
            title: '点击刷新 [上次刷新：' + Util.dateToString(site.updateAt) + ']',
            onClick: async function () {
                $ui.toast('正在刷新...');
                const result = await feed(site.feedUrl);
                result.site.createAt = site.createAt;
                siteDao.update(result.site);
                const articles = result.articles;
                const saved = articleDao.save(site.feedUrl, articles);
                if (saved.length === 0) {
                    $ui.toast('没有新文章哦');
                } else {
                    $ui.toast(`拉取了 ${saved.length} 篇新文章`);
                }
                this.refresh();
            }
        })
        items.push({
            title: '',
            style: 'category'
        });

        const list = articleDao.listByFeedUrl(site.feedUrl);
        for (const article of list) {
            items.push({
                style: 'article',
                title: article.title,
                time: Util.dateToString(article.pubDate),
                author: article.author ? {name: article.author} : null,
                summary: article.summary,
                thumb: article.image,
                route: $route("article", {feedUrl: site.feedUrl, guid: article.guid})
            });
        }
        return items;
    }
}

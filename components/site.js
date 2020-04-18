const feed = require('../service/feed');
const Util = require('../util');
const SiteDao = require('../dao/SiteDao');
const siteDao = new SiteDao();
const ArticleDao = require('../dao/ArticleDao');
const articleDao = new ArticleDao();

async function refreshNow(site) {
    try {
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
        return result.site;
    } catch (e) {
        $ui.alert('刷新失败: ' + e);
    }
    return site;
}

module.exports = {
    _needFreshNow: false,
    type: 'list',
    beforeCreate: function () {
        Util.log('beforeCreate 组件获取数据之前，在 fetch() 方法执行之前');
    },
    async fetch(context) {
        Util.log('on site page context=', context);
        let site = siteDao.findByFeedUrl(context.args.feedUrl);
        if (!site) {
            $ui.toast('不存在的站点');
            return;
        }
        const page = context.page || 1;
        if (page === 1 && this._needFreshNow) {
            // 已创建再进入 fetch 说明是下拉刷新
            Util.log('下拉刷新 refreshNow page=', page, ' _needFreshNow=', this._needFreshNow);
            site = await refreshNow(site);
        }
        const items = [];
        const {items: list, hasNext, totalPage} = articleDao.listPageByFeedUrl(site.feedUrl, page, this.pageSize);
        if (page === 1) {
            items.push({
                title: site.siteName + ' ' + site.siteUrl,
                summary: `更新时间：${Util.dateToString(site.pubDate)}\n${site.description}`,
                onClick: function () {
                    $ui.browser(site.siteUrl);
                }
            });
            items.push({
                title: (totalPage > 1 ? `第${page}/${totalPage}页 ` : '') +
                    '上次刷新：' + Util.dateToString(site.updateAt),
                style: 'category',
                action: {
                    title: Util.isSimpleStyle() ? '简单样式' : '文章样式',
                    onClick: function () {
                        Util.setSimpleStyle(!Util.isSimpleStyle());
                        this._needFreshNow = false;
                        this.refresh();
                    }
                }
            });
        }
        if (page > 1) {
            items.push({
                title: `第${page}/${totalPage}页`,
                style: 'category',
            });
        }
        for (const article of list) {
            if (Util.isSimpleStyle()) {
                items.push({
                    style: 'simple',
                    title: article.title,
                    thumb: article.image,
                    summary: article.summary,
                    route: $route("article", {feedUrl: site.feedUrl, guid: article.guid})
                });
            } else {
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
        }
        Util.log('hasNext', hasNext);
        return {
            items,
            nextPage: hasNext ? page + 1 : null
        };
    },
    created: function () {
        this._needFreshNow = true;
        Util.log('created 组件已获取数据，在 fetch() 方法执行完成之后');
    },
    activated: function () {
        Util.log('activated 页面可见（当前页面处于前台）');
    },
    inactivated: function () {
        Util.log('页面不可见（应用退到后台，或者打开了新的页面）');
    },
    beforeDestroy: function () {
        Util.log('组件销毁之前');
    },
    destroyed: function () {
        Util.log('组件已销毁');
    },
}

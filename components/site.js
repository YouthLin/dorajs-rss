const feed = require('../service/feed');
const Util = require('../util');
const SiteDao = require('../dao/SiteDao');
const siteDao = new SiteDao();
const ArticleDao = require('../dao/ArticleDao');
const articleDao = new ArticleDao();

async function refreshSite(site) {
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
        return {site: result.site, hasNew: saved.length > 0};
    } catch (e) {
        $ui.alert('刷新失败: ' + e);
    }
    return {site, hasNew: false};
}

module.exports = {
    /** 默认直接跳转进入页面不是下拉刷新 */
    _isPollDown: false,
    /**
     * 手动维护页码而不使用默认的 page/nextPage 分页机制。
     * 因为用自带分页时调用 refresh 会加载 nextPage 而不是刷新当前页
     */
    _pageIndex: 1,
    type: 'list',
    beforeCreate: function () {
        Util.log('beforeCreate 组件获取数据之前，在 fetch() 方法执行之前');
    },
    refreshComponents() {
        // 手动刷新组件不算下拉刷新
        this._isPollDown = false;
        this.refresh();
    },
    paging(totalPage, items) {
        if (totalPage > 1) {
            items.push({
                title: this._pageIndex > 1 ? '上一页' : '',
                style: 'label',
                onClick: () => {
                    if (this._pageIndex > 1) {
                        this._pageIndex--;
                        this.refreshComponents();
                    }
                }
            });
            items.push({
                title: `第 ${this._pageIndex}/${totalPage} 页`,
                style: 'label',
                onClick: async () => {
                    let input = await $input.text({
                        title: '跳转到第几页',
                        hint: `当前在第 ${this._pageIndex}/${totalPage} 页`,
                        value: this._pageIndex
                    });
                    if (input === null) {
                        return;
                    }
                    input = parseInt(input);
                    if (input > 0 && input <= totalPage) {
                        this._pageIndex = input;
                        this.refreshComponents();
                    } else {
                        $ui.toast(`请输入 1-${totalPage} 之间到页码`);
                    }
                }
            });
            items.push({
                title: this._pageIndex < totalPage ? '下一页' : '',
                style: 'label',
                onClick: () => {
                    if (this._pageIndex < totalPage) {
                        this._pageIndex++;
                        this.refreshComponents();
                    }
                }
            });
        }
    },
    async fetch(context) {
        // Util.log('on site page context=', context);
        const args = context.args;
        let site = siteDao.findByFeedUrl(args.feedUrl);
        if (!site) {
            $ui.toast('不存在的站点');
            return;
        }

        Util.log('fetch... _isPollDown=', this._isPollDown);
        if (this._isPollDown) {
            const refreshed = await refreshSite(site);
            site = refreshed.site;
            if (refreshed.hasNew) {
                // 有新文章 跳到第一页
                this._pageIndex = 1;
            }
        }

        const items = [];
        const {
            items: list,
            totalPage,
            totalCount
        } = articleDao.listPageByFeedUrl(site.feedUrl, this._pageIndex, this.pageSize);

        items.push({
            title: site.siteName + ' ' + site.siteUrl,
            summary: Util.joinNotEmpty('', '\n', '',
                Util.dateToString(site.pubDate, '更新时间：'), site.description),
            onClick: () => {
                $ui.browser(site.siteUrl);
            }
        });
        items.push({
            title: `共 ${totalCount} 篇文章，上次刷新：` + Util.dateToString(site.updateAt),
            style: 'category',
            action: {
                title: Util.isSimpleStyle() ? '简单样式' : '文章样式',
                onClick: () => {
                    Util.setSimpleStyle(!Util.isSimpleStyle());
                    this.refreshComponents();
                }
            }
        });

        this.paging(totalPage, items);

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

        this.paging(totalPage, items);

        // fetch 最后一步，设置标记，认为下次 fetch 是下拉刷新导致的。
        // 除非调用的是自定义的 refreshComponents 方法，重设标记
        this._isPollDown = true;
        return {items};
    },
    created: function () {
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

// 首页
//------

const Util = require('../util');
const feed = require('../service/feed');
const SiteDao = require('../dao/SiteDao');
const siteDao = new SiteDao();
const ArticleDao = require('../dao/ArticleDao');
const articleDao = new ArticleDao();

module.exports = {
    // 顶部选项卡
    type: 'topTab',
    tabMode: 'scrollable',
    actions: [
        {
            title: '添加',
            icon: $icon('add'),
            onClick: async function () {
                const feedUrl = await $input.prompt({
                    title: '请输入 RSS 地址',
                    hint: '示例：https://youthlin.com/feed',
                    value: ''
                });
                if (feedUrl) {
                    if (siteDao.groupByFeedUrl().has(feedUrl)) {
                        $ui.toast('该站点已存在');
                        return;
                    }
                    $ui.toast('解析中, 请稍后...');
                    try {
                        const {site, articles} = await feed(feedUrl);
                        Util.log('get feed, before save site:', site);
                        siteDao.save(site);
                        Util.log('before save articles: size=', articles.length);
                        const saved = articleDao.save(feedUrl, articles);
                        $ui.toast(`拉取了 ${saved.length} 篇新文章`);
                        Util.log('after save articles');
                        this.refresh();
                    } catch (e) {
                        $ui.alert('发生了异常: ' + e);
                    }
                }
            }
        },
        {
            title: '移除',
            icon: $icon('remove'),
            onClick: async function () {
                const options = [];
                const sites = siteDao.groupByFeedUrl();
                for (const [k, v] of sites) {
                    options.push({title: v.siteName, value: v.feedUrl});
                }
                let option = await $input.select({
                    title: '移除哪一个',
                    options: options
                });
                if (option) {
                    Util.log('remove:', option)
                    siteDao.delete(option.value);
                    articleDao.deleteByFeedUrl(option.value);
                    this.refresh();
                }
            }
        },
        {
            title: '切换样式',
            icon: $icon('view_compact'),
            onClick: function () {
                Util.setSimpleStyle(!Util.isSimpleStyle());
                this.refresh();
            }
        },
    ],
    async fetch() {
        Util.log('on home page');
        const sites = await siteDao.listSites();
        return sites.map(site => ({
            title: site.siteName,
            route: $route('site', {feedUrl: site.feedUrl})
        }));
    }
}

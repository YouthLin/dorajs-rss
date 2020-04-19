// 首页
//------

const Util = require('../util');
const feed = require('../service/feed');
const SiteDao = require('../dao/SiteDao');
const siteDao = new SiteDao();
const ArticleDao = require('../dao/ArticleDao');
const articleDao = new ArticleDao();

module.exports = {
    type: 'drawer',
    actions: [
        {
            title: '添加',
            icon: $icon('add'),
            onClick: async function () {
                let feedUrl = await $input.prompt({
                    title: '请输入 RSS 地址',
                    hint: '示例：https://youthlin.com/feed',
                    value: 'https://'
                });
                if (feedUrl) {
                    feedUrl = feedUrl.trim();
                    if (feedUrl.startsWith('https://http://') || feedUrl.startsWith('https://https://')) {
                        feedUrl = feedUrl.substr('https://'.length);
                    }
                    if (!(feedUrl.startsWith('http://') || feedUrl.startsWith('https://'))) {
                        feedUrl = 'https://' + feedUrl;
                    }
                    if (feedUrl.length <= 'https://'.length) {
                        $ui.alert('请输入正确的 feed 地址');
                        return;
                    }
                    if (siteDao.groupByFeedUrl().has(feedUrl)) {
                        $ui.toast('该站点已存在：' + feedUrl);
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
                        // 会在后退栈里叠加新页面 显示后退按钮而不是汉堡菜单 因此不跳转
                        // $router.to($route('site', {feedUrl: feedUrl}));
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
                let selected = await $input.select({
                    title: '选择要移除的站点',
                    multiple: true,
                    options: options
                });
                if (selected) {
                    Util.log('remove selected:', selected)
                    for (const option of selected) {
                        siteDao.delete(option.value);
                        articleDao.deleteByFeedUrl(option.value);
                    }
                    this.refresh();
                }
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

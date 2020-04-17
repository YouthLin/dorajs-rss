// 首页
//------

const {log, getSiteMap, saveSiteMap, loadStorage, saveStorage, deleteStorage} = require('./util');
const feed = require('./feed');

const VERSION = 'version';
const V2 = 2;

(async function () {
    // 删除旧版的 storage
    const version = await loadStorage(VERSION);
    if (version === null) {
        const siteMap = getSiteMap();
        for (let [siteName, siteUrl] of siteMap) {
            deleteStorage(siteUrl);
        }
        saveStorage(VERSION, V2);
    }
}())

module.exports = {
    // 顶部选项卡
    type: 'topTab',
    tabMode: 'scrollable',
    actions: [{
        title: '添加',
        onClick: async function () {
            let feedUrl = await $input.prompt({
                title: 'RSS地址',
                hint: '如 https://youthlin.com/feed',
                value: ''
            });
            if (feedUrl) {
                log('input=', feedUrl);
                const site = await loadStorage(feedUrl, feed);
                log('load input and site.siteTitle=', site.siteTitle);
                let map = getSiteMap();
                map.set(site.siteTitle, feedUrl);
                saveSiteMap(map);
                this.refresh();
            }
        }
    }, {
        title: '移除',
        onClick: async function () {
            const options = [];
            const sites = getSiteMap();
            for (const [k, v] of sites) {
                options.push({title: k, value: v});
            }
            let option = await $input.select({
                title: '移除哪一个',
                options: options
            });
            if (option) {
                sites.delete(option.title);
                saveSiteMap(sites);
                deleteStorage(option.value);
                this.refresh();
            }
        }
    }],
    async fetch() {
        log('index fetch...');
        const map = getSiteMap();
        let siteArr = [];
        for (const [siteName, feedUrl] of map) {
            siteArr.push({
                title: siteName,
                route: $route('list', {siteName, feedUrl})
            });
        }
        return siteArr;
    }
}

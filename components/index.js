const {save} = require('./util');
const SITES = 'sites';

function getSiteMap() {
    let sites = String($prefs.get(SITES))
        .trim()
        .replace('，', ',')
        .split(',');
    let map = new Map();
    for (const site of sites) {
        const pair = site.split('|');
        if (pair.length === 2) {
            map.set(pair[0], pair[1]);
        }
    }
    console.log('read sites map ', map);
    return map;
}

function saveSiteMap(map) {
    let items = [];
    for (const [k, v] of map) {
        items.push(k + '|' + v);
    }
    console.log('save site map ', items);
    $prefs.set(SITES, items.join(','));
}

module.exports = {
    type: 'topTab',
    tabMode: 'scrollable',
    actions: [{
        title: '添加',
        onClick: async function () {
            let name = await $input.prompt({title: '站点名称', value: '霖博客'});
            if (name) {
                let url = await $input.prompt({
                    title: 'RSS地址',
                    value: 'https://youthlin.com/feed'
                });
                if (url) {
                    let map = getSiteMap();
                    map.set(name, url);
                    saveSiteMap(map);
                    this.refresh();
                }
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
            console.log('移除, 选择了:', option);
            if (option) {
                save(option.value, null);
                sites.delete(option.title);
                saveSiteMap(sites);
                this.refresh();
            }
        }
    }],
    async fetch() {
        const map = getSiteMap();
        let siteArr = [];
        for (const [siteName, feedUrl] of map) {
            siteArr.push({
                title: siteName,
                route: $route('site', {name: siteName, url: feedUrl})
            })
        }
        return siteArr;
    }
}

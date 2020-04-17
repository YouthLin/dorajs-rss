const SITES = 'sites';

function log(...args) {
    console.log(...args);
}

/**
 * 获取配置项的所有站点
 * key: siteName
 * value: siteUrl
 * @return Map<String,String>
 * */
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
    log('read sites map ', map);
    return map;
}

/**保存站点配置*/
function saveSiteMap(map) {
    let items = [];
    for (const [k, v] of map) {
        items.push(k + '|' + v);
    }
    log('save site map ', items);
    $prefs.set(SITES, items.join(','));
}

/**
 * 获取存储的值
 * @param key key
 * @param loader function 当值不存在时可以通过 loader 加载
 * @return value or null
 * */
async function loadStorage(key, loader = null) {
    const encodeKey = encodeURIComponent(key);
    log('get storage: encodeKey=', encodeKey);
    let value = $storage.get(encodeKey);
    if (value) {
        log('exist');
        return value;
    }
    if (loader && typeof loader === 'function') {
        value = await loader(key);
        console.log('loaded');
        return saveStorage(key, value);
    }
    return null;
}

/**
 * 存储一项键值对
 * @return value
 * */
function saveStorage(key, value) {
    key = encodeURIComponent(key);

    $storage.put(key, value);
    console.log('put storage: encodeKey=', key);
    return value;
}

/** 删除存储的键 */
function deleteStorage(key) {
    saveStorage(key, null);
}

function addArticles(site, articles) {
    for (const guid in articles) {
        if (articles.hasOwnProperty(guid)) {
            site.articles[guid] = articles[guid];
        }
    }
}

/**
 * 日期转字符串
 * @return yyyy-MM-dd HH:mm
 * */
function dateToString(dateStr) {
    const date = new Date(dateStr);
    return date.getFullYear() +
        '-' + (date.getMonth() + 1).toString().padStart(2, '0') +
        '-' + date.getDate().toString().padStart(2, '0') +
        ' ' + date.getHours().toString().padStart(2, '0') +
        ':' + date.getMinutes().toString().padStart(2, '0');
}

// region html 实体 https://stackoverflow.com/a/27020300
/**
 * Convert a string to HTML entities
 */
const toHtmlEntities = function () {
    return this.replace(/./gm, function (s) {
        // return "&#" + s.charCodeAt(0) + ";";
        return (s.match(/[a-z0-9\s]+/i)) ? s : "&#" + s.charCodeAt(0) + ";";
    });
};

/**
 * Create string from HTML entities
 */
const fromHtmlEntities = function (string) {
    return (string + "").replace(/&#\d+;/gm, function (s) {
        return String.fromCharCode(s.match(/\d+/gm)[0]);
    })
};

// endregion html 实体 https://stackoverflow.com/a/27020300

/** 解码一些 HTML 实体 */
function htmlDeCode(value) {
    if (value) {
        return fromHtmlEntities(value.replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&nbsp;/g, " ")
            .replace(/&quot/g, "'")
            .replace(/ width="(.*?)"/g, " width=\"100%\"")
            .replace(/ height="(.*?)"/g, " height=\"auto\""));
    }
    return '';
}

/** 获取 html 中第一项图片的地址 */
function getImgUrl(html) {
    if (html) {
        const urls = html.match(/(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&/~+#])?.(\.jpg|\.jpeg|\.png|\.gif|\.webp)/);
        return urls ? urls[0] : null;
    }
    return null;
}

module.exports = {
    log,
    getSiteMap, saveSiteMap,
    loadStorage, saveStorage, deleteStorage, dateToString,
    toHtmlEntities, fromHtmlEntities,
    htmlDeCode, getImgUrl, addArticles
}

const feed = require('./feed');
const {load, save} = require('./util');

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

function getImgUrl(html) {
    const urls = html.match(/(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&/~+#])?.(\.jpg|\.jpeg|\.png|\.gif|\.webp)/);
    return urls ? urls[0] : null;
}

async function getFromCache(url) {
    const site = await load(url, feed);
    const items = [];
    items.push({
        title: site.meta.title + ' ' + site.meta.link,
        summary: `${site.meta.description}\n更新时间: ${dateToString(site.meta.date)}`,
        onClick: function () {
            $ui.browser(site.meta.link);
        }
    });
    items.push({
        title: '点击刷新 [上次刷新：' + dateToString(site.update) + ']',
        onClick: function () {
            save(url, null);
            this.refresh();
        }
    })
    items.push({
        title: '',
        style: 'category'
    });
    for (let article of site.articles) {
        const content = htmlDeCode(article.description);

        const categories = article.categories || [];
        const prefix = categories.length > 0 ? '<p>分类：' + categories.join(', ') + '</p>' : '';

        const guid = article.guid || '';
        const commentLink = article.comments || '';
        const url = guid.startsWith("http") ? `<a href="${guid}">阅读原文</a>` : '';
        const comment = commentLink.startsWith("http") ? `<a href="${commentLink}">查看评论</a>` : '';
        let suffix = '';
        if (url || comment) {
            suffix = `<hr><p>${url} ${comment}</p>`;
        }

        items.push({
            style: 'article',
            title: article.title,
            time: dateToString(article.date),
            author: {name: article.author},
            summary: htmlDeCode(article.summary),
            thumb: getImgUrl(content),
            route: $route("@article", {
                content: {
                    title: article.title,
                    html: `<style>img{width:100%;height:auto;}</style>${prefix}${content}${suffix}`
                }
            })
        });
    }
    return items;
}

module.exports = {
    type: 'list',
    async fetch({args}) {
        const items = await getFromCache(args.url);
        return {items};
    }
}

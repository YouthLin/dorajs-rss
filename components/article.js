// 文章页
//------

const Util = require('../util');
const ArticleDao = require('../dao/ArticleDao');
const articleDao = new ArticleDao();

module.exports = {
    type: 'article',
    async fetch({args}) {
        const feedUrl = args.feedUrl;
        const guid = args.guid;
        const article = articleDao.selectByGuid(feedUrl, guid);
        if (!article) {
            $ui.toast('不存在的文章');
            return;
        }

        const categories = article.categories || [];
        const prefix = `<p>时间：${Util.dateToString(article.pubDate)}` +
            (categories.length > 0 ? '<br>分类：' + categories.join(', ') : '') + '</p><hr>';

        const commentLink = article.commentLink || '';
        const url = guid.startsWith("http") ? `<a href="${guid}">阅读原文</a>` : '';
        const comment = commentLink.startsWith("http") ? `<a href="${commentLink}">查看评论</a>` : '';
        let suffix = '';
        if (url || comment) {
            suffix = `<hr><p>${url} ${comment}</p>`;
        }
        return {
            content: {
                title: article.title,
                html: `<style>*{max-width: 100vw;overflow-x: scroll}</style>` +
                    `${prefix}${article.content}${suffix}`
            }
        }
    }

}

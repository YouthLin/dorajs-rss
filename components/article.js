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
        const prefix = Util.joinNotEmpty('<p>', '<br>', '</p><hr>',
            Util.dateToString(article.pubDate, '时间：'),
            Util.joinNotEmpty('分类：', ', ', '', categories.join(', ')));

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
                html: `<style>*{max-width: 100vw; overflow-x: scroll} img{max-width: 100vw; height: auto;}</style>` +
                    `${prefix}${article.content}${suffix}`
            }
        }
    }

}

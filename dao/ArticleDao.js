const Article = require('../data/Article');
const Dao = require('./Dao');
const ARTICLES_PREFIX = 'articles_';

module.exports = class ArticleDao {
    constructor() {
        this.dao = new Dao();
    }

    /*** @return Article[] */
    listByFeedUrl(feedUrl) {
        return Array.from(this.dao.get(ARTICLES_PREFIX + feedUrl) || []);
    }

    /** 分页获取
     * @param feedUrl feedUrl
     * @param pageIndex 1开始 第几页
     * @param pageSize 每页几条
     **/
    listPageByFeedUrl(feedUrl, pageIndex, pageSize) {
        const all = this.listByFeedUrl(feedUrl);
        let start = (pageIndex - 1) * pageSize;
        let end = start + pageSize;
        if (end > all.length) {
            end = all.length;
        }
        return {
            items: all.slice(start, end),
            totalPage: Math.floor((all.length - 1) / pageSize) + 1,
            hasNext: end < all.length,
        };
    }

    deleteByFeedUrl(feedUrl) {
        return this.dao.delete(ARTICLES_PREFIX + feedUrl);
    }

    groupByGuid(feedUrl) {
        const articles = this.listByFeedUrl(feedUrl);
        return new Map(articles.map(item => [item.guid, item]));
    }

    /** 返回新保存的文章数组 */
    save(feedUrl, articles) {
        const guidMap = this.groupByGuid(feedUrl);
        const newArticle = [];
        for (let article of articles) {
            if (!guidMap.has(article.guid)) {
                newArticle.push(article);
            }
            guidMap.set(article.guid, article);
        }
        const all = [...guidMap.values()];
        all.sort(((a, b) => {
            return b.pubDate - a.pubDate;
        }));
        this.dao.save(ARTICLES_PREFIX + feedUrl, all);
        return newArticle;
    }

    selectByGuid(feedUrl, guid) {
        return this.groupByGuid(feedUrl).get(guid);
    }

}
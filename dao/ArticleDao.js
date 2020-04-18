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
        this.dao.save(ARTICLES_PREFIX + feedUrl, [...guidMap.values()]);
        return newArticle;
    }

    selectByGuid(feedUrl, guid) {
        return this.groupByGuid(feedUrl).get(guid);
    }

}
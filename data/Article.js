class Article {
    constructor(article) {
        this.feedUrl = article.feedUrl || 0;
        this.guid = article.guid || '';
        this.title = article.title || '';
        this.author = article.author || null;
        this.summary = article.summary || '';
        this.image = article.image || null;
        this.categories = article.categories || [];
        this.content = article.content || '';
        this.link = article.link || '';
        this.commentLink = article.commentLink || '';
        this.pubDate = article.pubDate || '';
        this.createAt = article.createAt || new Date();
        this.updateAt = article.updateAt || new Date();
    }
}

module.exports = Article

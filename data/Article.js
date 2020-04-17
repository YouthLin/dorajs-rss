class Article {
    constructor() {
        this.id = 0;
        this.siteId = 0;
        this.guid = '';
        this.title = '';
        this.summary = '';
        this.image = null;
        this.content = '';
        this.link = '';
        this.commentLink = '';
        this.pubDate = '';
        this.updateAt = new Date();
    }
}

module.exports = Article

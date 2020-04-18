class Site {
    constructor(site = {}) {
        this.feedUrl = site.feedUrl || '';
        this.siteName = site.siteName || '';
        this.siteUrl = site.siteUrl || '';
        this.description = site.description || '';
        this.pubDate = site.pubDate || '';
        this.extData = site.extData || null;
        this.createAt = site.createAt || new Date();
        this.updateAt = site.updateAt || new Date();
    }
}

module.exports = Site

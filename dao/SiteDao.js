const Site = require('../data/Site');
const Dao = require('./Dao');
const SITES = 'sites';

class SiteDao {
    constructor() {
        this.dao = new Dao();
    }

    save(site) {
        const feedUrlMap = this.groupByFeedUrl();
        feedUrlMap.set(site.feedUrl, site);
        this.dao.save(SITES, [...feedUrlMap.values()]);
    }

    delete(feedUrl) {
        const feedUrlMap = this.groupByFeedUrl();
        feedUrlMap.delete(feedUrl);
        this.dao.save(SITES, [...feedUrlMap.values()]);
    }

    update(site) {
        this.save(site);
    }

    findByFeedUrl(feedUrl) {
        return this.groupByFeedUrl().get(feedUrl);
    }

    /** @return Site[] */
    listSites() {
        return Array.from(this.dao.get(SITES) || []);
    }

    groupByFeedUrl() {
        const sites = this.listSites();
        return new Map(sites.map(item => [item.feedUrl, item]));
    }

}

module.exports = SiteDao

const LIST_STYLE = 'listStyle';
const SIMPLE = 'simple';
const ARTICLE = 'article';
const DEFAULT_SITE = [
    {
        "feedUrl": "https://youthlin.com/feed",
        "siteName": "霖博客(扩展作者)"
    },
    {
        "feedUrl": "https://linroid.com/atom.xml",
        "siteName": "linroid(软件作者)"
    },
    {
        "feedUrl": "https://www.zhangxinxu.com/wordpress/feed/",
        "siteName": "张鑫旭-鑫空间-鑫生活"
    },
    {
        "feedUrl": "https://www.ruanyifeng.com/blog/atom.xml",
        "siteName": "阮一峰的网络日志"
    },
    {
        "feedUrl": "https://zhihu.com/rss",
        "siteName": "知乎每日精选"
    },
    {
        "feedUrl": "https://www.ithome.com/rss",
        "siteName": "IT之家"
    },
    {
        "feedUrl": "https://appinn.com/feed",
        "siteName": "小众软件"
    },
    {
        "feedUrl": "https://sspai.com/feed",
        "siteName": "少数派"
    },
    {
        "feedUrl": "http://www.geekpark.net/rss",
        "siteName": "极客公园"
    },
    {
        "feedUrl": "https://www.ifanr.com/feed",
        "siteName": "爱范儿"
    },
    {
        "feedUrl": "https://www.pingwest.com/feed",
        "siteName": "PingWest品玩"
    },
    {
        "feedUrl": "https://feed.iplaysoft.com/",
        "siteName": "异次元软件世界"
    },
    {
        "feedUrl": "http://www.waerfa.com/feed",
        "siteName": "Mac玩儿法"
    },
    {
        "feedUrl": "http://www.people.com.cn/rss/politics.xml",
        "siteName": "时政频道"
    },
    {
        "feedUrl": "http://www.people.com.cn/rss/world.xml",
        "siteName": "国际频道"
    },
    {
        "feedUrl": "http://www.people.com.cn/rss/haixia.xml",
        "siteName": "海峡两岸"
    },
    {
        "feedUrl": "http://www.people.com.cn/rss/it.xml",
        "siteName": "IT频道"
    },
    {
        "feedUrl": "http://www.people.com.cn/rss/scitech.xml",
        "siteName": "科技频道"
    }
];

class Util {
    static log(...args) {
        console.log(...args);
    }

    static joinNotEmpty(prefix, separator, suffix, ...elements) {
        let ret = '';
        let hasElement = false;
        for (const element of elements) {
            if (element) {
                if (hasElement) {
                    ret = ret + separator + element;
                } else {
                    ret = prefix + element;
                }
                hasElement = true;
            }
        }
        if (hasElement) {
            ret = ret + suffix;
        }
        return ret;
    }

    /**
     * 日期转字符串
     * 当不是日期时返回空串
     * @return yyyy-MM-dd HH:mm
     * */
    static dateToString(dateStr, prefix = '', suffix = '') {
        const date = new Date(dateStr);
        if (isNaN(date.getFullYear())) {
            Util.log('Invalid Date:', dateStr);
            return '';
        }
        return prefix + date.getFullYear() +
            '-' + (date.getMonth() + 1).toString().padStart(2, '0') +
            '-' + date.getDate().toString().padStart(2, '0') +
            ' ' + date.getHours().toString().padStart(2, '0') +
            ':' + date.getMinutes().toString().padStart(2, '0') +
            suffix;
    }

    /**
     * Convert a string to HTML entities
     * @see https://stackoverflow.com/a/27020300
     */
    static toHtmlEntities(string) {
        return string.replace(/./gm, function (s) {
            // return "&#" + s.charCodeAt(0) + ";";
            return (s.match(/[a-z0-9\s]+/i)) ? s : "&#" + s.charCodeAt(0) + ";";
        });
    }

    /**
     * Create string from HTML entities
     * @see https://stackoverflow.com/a/27020300
     */
    static fromHtmlEntities(string) {
        if (string) {
            return (string + "")
                .replace(/&amp;/g, "&")
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/&nbsp;/g, " ")
                .replace(/&quot/g, "'")
                .replace(/&#\d+;/gm, function (s) {
                    return String.fromCharCode(s.match(/\d+/gm)[0]);
                });
        }
        return string;
    }

    static removeHtmlTags(string) {
        if (string) {
            return string.replace(/<\/?.+?\/?>/g, '').trim();
        }
        return string;
    }

    /** 获取 html 中第一项图片的地址 */
    static getImgUrl(html) {
        if (html) {
            const urls = html.match(/(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&/~+#])?.(\.jpg|\.jpeg|\.png|\.gif|\.webp)/);
            return urls ? urls[0] : null;
        }
        return null;
    }

    static isSimpleStyle() {
        return $prefs.get(LIST_STYLE) === SIMPLE;
    }

    static setSimpleStyle(simple) {
        if (simple) {
            $prefs.set(LIST_STYLE, SIMPLE);
        } else {
            $prefs.set(LIST_STYLE, ARTICLE);
        }
    }

    static getDefaultSites() {
        return DEFAULT_SITE;
    }
}

module.exports = Util

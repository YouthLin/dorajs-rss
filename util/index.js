const LIST_STYLE = 'listStyle';
const SIMPLE = 'simple';
const ARTICLE = 'article';

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
            return (string + "").replace(/&#\d+;/gm, function (s) {
                return String.fromCharCode(s.match(/\d+/gm)[0]);
            });
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

}

module.exports = Util

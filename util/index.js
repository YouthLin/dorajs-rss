const LIST_STYLE = 'listStyle';
const SIMPLE = 'simple';
const ARTICLE = 'article';

class Util {
    static log(...args) {
        console.log(...args);
    }

    /**
     * 日期转字符串
     * @return yyyy-MM-dd HH:mm
     * */
    static dateToString(dateStr) {
        const date = new Date(dateStr);
        return date.getFullYear() +
            '-' + (date.getMonth() + 1).toString().padStart(2, '0') +
            '-' + date.getDate().toString().padStart(2, '0') +
            ' ' + date.getHours().toString().padStart(2, '0') +
            ':' + date.getMinutes().toString().padStart(2, '0');
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

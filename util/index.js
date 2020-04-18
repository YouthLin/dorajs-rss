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
        return (string + "").replace(/&#\d+;/gm, function (s) {
            return String.fromCharCode(s.match(/\d+/gm)[0]);
        })
    }

    /** 解码一些 HTML 实体 */
    static htmlDeCode(value) {
        if (value) {
            return Util.fromHtmlEntities(value.replace(/&amp;/g, "&")
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/&nbsp;/g, " ")
                .replace(/&quot/g, "'")
                .replace(/ width="(.*?)"/g, " width=\"100%\"")
                .replace(/ height="(.*?)"/g, " height=\"auto\""));
        }
        return '';
    }

    /** 获取 html 中第一项图片的地址 */
    static getImgUrl(html) {
        if (html) {
            const urls = html.match(/(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&/~+#])?.(\.jpg|\.jpeg|\.png|\.gif|\.webp)/);
            return urls ? urls[0] : null;
        }
        return null;
    }
}

module.exports = Util

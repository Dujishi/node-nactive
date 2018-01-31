module.exports = {
    /**
     * 从当前URL键值对转换成对象 如：从 ?a=11&b=22 URL参数中
     * @example
     *  var value = stringUtil.getParamsFromUrl();
     *  alert(JSON.stringify(value));//value 为{a:11,b:22}
     * @return {Object}
     */
    getParamsFromUrl() {
        const search = location.search;
        if (search.length > 0) {
            return this.parseParamsFromSplit(search.substring(1), '&', '=');
        }
        return {};
    },

    /**
     * 针对双重分隔符字符串的键值对转换成对象 如：a=11&b=22 ，依key取出value，如果是key为a，则值为11
     * @param {string} str - 原始字符串
     * @param {string} iSplit - 项分隔符，如 &
     * @param {string} vSplit - 值分隔符，如 =
     * @return {Object}
     */
    parseParamsFromSplit(str, iSplit, vSplit) {
        const rs = {};
        const params = str.split(iSplit);
        for (let i = 0; i < params.length; i++) {
            const kv = params[i].split(vSplit);
            if (kv.length === 2) {
                rs[kv[0]] = decodeURIComponent(kv[1]);
            }
        }
        return rs;
    },
    /**
     * 版本号比较判断 如： 3.4.9  3.4.10
     * @param {string}
     * @param {string}
     * @return {Boolane} v1>=v2 返回true
     */
    compareVersion(v1, v2) {
        if (v1 == v2) {
            return true;
        }
        const v1arr = v1.split('.');
        const v2arr = v2.split('.');
        let val1;
        let val2;
        for (let i = 0, len = v1arr.length; i < len; i++) {
            val1 = v1arr[i] ? parseInt(v1arr[i]) : 0;
            val2 = v2arr[i] ? parseInt(v2arr[i]) : 0;
            if (val1 == val2) { continue; }
            if (val1 > val2) {
                return true;
            }
            return false;
        }
        return false;
    }
};

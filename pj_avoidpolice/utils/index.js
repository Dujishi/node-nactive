const RedisPage = require('@server/redis/page');
const moment = require('moment');
const md5 = require('md5');

const getKey = getRedisKey('avoidpolice');

/**
 * @example
 * const getKey = getRedisKey('vip20160720');
 * const key = getKey('openid', 123455);
 */
function getRedisKey(k) {
    return (...args) => {
        args.unshift(k);
        return args.join(':');
    };
}

/**
 * 判断是否是大于等于0的数字
 * @param {Number} num
 */
function isNumber(num) {
    return /^[1-9]\d*|0$/.test(num);
}

/**
 * 获取排行榜
 * @param {Number} rankId 排行榜id
 */
function getRank(rankId) {
    return new RedisPage({
        prefix: getKey('phone'),
        key: `rankId_${rankId}`,
        pagesize: 10
    });
}

/**
 * 获取星期一的日期
 * @param {Number} day 数值，比如上个星期一传入7，上上个星期一传入14，以此类推
 */
function getMondayTimestamp(day = 0) {
    const now = new Date();
    return now.setDate(now.getDate() - (now.getDay() - 1) - day);
}

/**
 * 根据每个周一的日期生成排行榜id
 */
function getRankId(day = 0) {
    const date = getMondayTimestamp(day);
    return moment(date).format('YYYYMMDD');
}

/**
 * 获取上个星期的排行榜id
 */
function getPrevRankId() {
    return getRankId(7);
}

function formatScore(data, rankId) {
    return data.map((v) => {
        v.score = v[`score_${rankId}`];
        return v;
    });
}

/**
 * 对分数进行一些加密处理
 */
function getSign(score, salt1) {
    const salt2 = Math.PI.toFixed(2);
    const sign = md5(score + salt1 + salt2);
    return sign.split('').reverse().join('');
}

module.exports = {
    getKey,
    isNumber,
    getRank,
    getRankId,
    getPrevRankId,
    formatScore,
    getMondayTimestamp,
    getSign,
};

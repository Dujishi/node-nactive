const redis = require('@server/redis');
const utils = require('../utils');

module.exports = async function (code) {
    const redisKey = utils.getKey(code);
    const goodsInfo = await redis.hgetall(redisKey);
    return goodsInfo;
};

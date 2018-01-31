const redis = require('@server/redis');
const utils = require('../utils');
const { goodsList } = require('../config');

async function getGoodsList(codes) {
    const list = [];
    for (let i = 0; i < codes.length; i++) {
        const redisKey = utils.getKey(codes[i]);
        const goodsInfo = await redis.hgetall(redisKey);
        list.push(goodsInfo);
    }
    return list;
}

module.exports = async function () {
    const codes = Object.keys(goodsList);
    const list = await getGoodsList(codes);

    return list;
};

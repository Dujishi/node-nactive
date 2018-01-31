/**
 * @description
 * @author  yinshi
 * @date 16/11/30.
 */


const redis = require('@server/redis');
const redisKey = require('../config/redisKey');


module.exports = async function (activeName) {
    const current = await redis.get(redisKey.currentNumber(activeName));
    const total = await redis.get(redisKey.totalNumber(activeName));
    const leave = await redis.llen(redisKey.lotteryPool(activeName, current));
    if(total <= current && !leave ){
        return true
    }
    return false
}
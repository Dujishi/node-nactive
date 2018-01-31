/**
 * @description
 * @author  yinshi
 * @date 16/10/18.
 */



const redisKey = require('../config');

const redis = require('../utils/seckill_redis');

const key = 'seckill161016';
exports.addActive = function(active = key, options) {

    return redis.hmset(redisKey.redis.active(active), options);
};

exports.addProduct = function(active = key, options) {

    return redis.hmset(redisKey.redis.product(active), options);
};

exports.addRule = function(active = key, val) {

    return redis.set(redisKey.redis.rule(active), val);
};

exports.addWhitelist = function(active = key, arr) {

    return redis.sadd(redisKey.redis.whitelist(active), ...arr)
};

exports.addQualified = function(active = key, arr) {
    return redis.sadd(redisKey.redis.qualified(active), ...arr)
};

exports.smembers = function() {
    return redis.lrange("seckill:accessuser:seckill161016");
}

exports.addStock = function(active = key, stock) {
    redis.del(redisKey.redis.stock(active));
    var arr = [];

    for (var i = 0; i < stock; i++) {
        arr.push(1);
    }
    return redis.rpush(redisKey.redis.stock(active), arr)
};
const redis = require('@server/redis');

const shopsKey = 'node_storelist:shops:';

/**
 * 获取商户ID
 */
exports.getShopListByCache = function (key) {
    return redis.get(`${shopsKey}${key}`);
}
;

/**
 * 设置商户ID
 */
exports.setShopListByCache = function (key, value) {
    return redis.set(`${shopsKey}${key}`, value);
}
;

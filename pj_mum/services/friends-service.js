const redis = require('@server/redis');
const utils = require('../utils');

module.exports = async function (bonusId) {
    const redisKey = utils.getKey(`bonusId:${bonusId}`);
    const bonusInfo = await redis.hgetall(redisKey);
    let friendsInfo = null;
    if (bonusInfo && bonusInfo.friends) {
        friendsInfo = JSON.parse(bonusInfo.friends);
    }
    return friendsInfo;
};

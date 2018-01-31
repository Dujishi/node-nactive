/**
 * @description 获取参与信息
 * @author  yinshi
 * @date 16/11/26.
 */


const redis = require('@server/redis');
const redisKey = require('../config/redisKey');

module.exports = async function (activeName) {
    const current = redis.get(redisKey.currentNumber(activeName));
    const totalRound = redis.get(redisKey.totalNumber(activeName));
    const totalMember = redis.zcard(redisKey.payMemberList(activeName));
    const nowMember = redis.llen(redisKey.lotteryPool(activeName, current));

    const datas = await Promise.all([current, totalRound, totalMember, nowMember]);
    return {
        current: datas[0],
        totalRound: datas[1],
        totalMember: datas[2],
        nowMember: datas[3],
    };
};

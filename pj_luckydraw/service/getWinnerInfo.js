/**
 * @description
 * @author  yinshi
 * @date 16/11/25.
 */

const redis = require('@server/redis');

const response = require('@util/response-json');
const redisKey = require('../config/redisKey');
const util = require('../util');
module.exports = async function ( activeName) {
    // if (!userId) {
    //     return response.json_err('请你先登录', -1);
    // }
    const winnerInfo = await redis.hgetall(redisKey.lotteryWinnerInfo(activeName));

    const winnerList = [];
    if (winnerInfo) {
        let num = 1;
        while (winnerInfo[num]) {
            const member = JSON.parse(winnerInfo[num]);
            const paidTime = new Date();
            paidTime.setTime(member.paidTime);
            winnerList.push({
                round: member.round,
                phone: util.hidePhone(member.phone),
                headimgurl: member.headimgurl,
                date: [paidTime.getFullYear(),
                    util.addZero(paidTime.getMonth() + 1), util.addZero(paidTime.getDate())].join('.'),
                time: [
                    [util.addZero(paidTime.getHours()),
                        util.addZero(paidTime.getMinutes()),
                        util.addZero(paidTime.getSeconds())].join(':'),
                    util.addZero1000(paidTime.getMilliseconds())].join('.'),
            });
            num++;
        }
    }
    return response.json_success(winnerList.sort(function (list1,list2) {
        return list2.round - list1.round
    }));
};

/**
 * @description 获取用户基本信息
 * @author  yinshi
 * @date 16/11/23.
 */

const redis = require('@server/redis');
const validation = require('@util/validation');
const response = require('@util/response-json');
const redisKey = require('../config/redisKey');
const util = require('../util')

/**
 * 初始化用户信息
 * @param userId
 * @param activeName
 * @return {Promise}
 */
module.exports = async function (userId, activeName) {
    let current,
        leave,
        total;

    current = await redis.get(redisKey.currentNumber(activeName)) - 0;
    total = await redis.get(redisKey.totalNumber(activeName)) - 0;

    leave = await redis.llen(redisKey.lotteryPool(activeName, current));

    if (!userId) {
        //判断活动是否结束
        if (!leave && Number(total) <= Number(current)) {
            return response.json_err('对不起，活动已经结束', 4003);
        }
        return response.json_success({
            joined: false,
            current,
            leaveNumber: leave,
            joinedNumber: 499 - leave,
            totalNumber: 499,
        });
    }


    // 判断是否支付过
    const payTime = await redis.zscore(redisKey.payMemberList(activeName), userId);

    // 已经支付过，则获取用户信息返回具体内容
    if (payTime !==null) {
        const userInfo = await redis.hgetall(redisKey.payMemberInfo(activeName, userId));


        // 异步操作下，如果用户信息不存在，说明支付完成但此时信息用户信息还为添加，提示正在分配抽奖码
        if (userInfo) {
            let winnerInfo = {};

            current = userInfo.round;
            leave = await redis.llen(redisKey.lotteryPool(activeName, current));
            // 获取当前轮数是否中奖
            if (leave == 0) {
                let winnerInfoList = await redis.hget(redisKey.lotteryWinnerInfo(activeName), current);

                winnerInfoList = winnerInfoList ? JSON.parse(winnerInfoList) : {};
                winnerInfo = {
                    code: winnerInfoList.code,
                    phone: util.hidePhone(winnerInfoList.phone),
                    headimgurl: winnerInfoList.headimgurl,
                };
            }

            return response.json_success({
                joined: true,
                code: userInfo.code,
                paidTime: userInfo.paidTime,
                current,
                isWinner: userInfo.code == winnerInfo.code,
                winnerInfo: winnerInfo.code ? winnerInfo : null,
                leaveNumber: leave,
                joinedNumber: 499 - leave,
                totalNumber: 499,
            });
        } else {
            return response.json_success({
                joined: true,
                current,
                leaveNumber: leave,
                joinedNumber: 499 - leave,
                totalNumber: 499,
            });
        }
    }

    //判断活动是否结束
    if (!leave && Number(total) <= Number(current)) {
        return response.json_err('对不起，活动已经结束', 4003);
    }

    // 是否黑名单用户
    const isBlacker = await redis.sismember(redisKey.blackList(activeName), userId);
    if (isBlacker) {
        const res= response.json_err('对不起，您未获得参与资格', 4002);
        res.data = {
            joined: false,
            current,
            leaveNumber: leave,
            joinedNumber: 499 - leave,
            totalNumber: 499,
        };
        return res;
    }

        // 判断是否为最后一轮，如果不是最后一轮则可以参与
    if (leave == 0 && total > current) {
        current = Number(current) + 1;
        leave = await redis.llen(redisKey.lotteryPool(activeName, current));
    }
    //是否需要弹窗
    const isAlert = await redis.hget(redisKey.payMemberInfo(activeName,userId),'isAlert')

        // 获取基本信息
    return response.json_success({
        isAlert:!isAlert,
        joined: false,
        current,
        joinedNumber: 499 - leave,
        leaveNumber: leave,
        totalNumber: 499,
    });
};

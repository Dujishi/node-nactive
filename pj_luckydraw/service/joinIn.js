/**
 * @description
 * @author  yinshi
 * @date 16/11/24.
 */


const getActiveInfo = require('./getActiveInfo');

const response = require('@util/response-json');

const orderSoa = require('../model/morderSoa');

const redis = require('@server/redis');
const redisKey = require('../config/redisKey');

const validation = require('@util/validation');
module.exports = async function (ctx, activeName = 'cmb161201') {
    if (!validation.isApp(ctx.headers)) {
        return response.json_err('本次活动只能在典典养车APP中参加', 4010);
    }

    const body = ctx.request.body || ctx.headers;

    const userId = body.userId;
    if (!userId) {
        return response.json_err('请您先登录', -1);
    }

    const isBlack = await redis.sismember(redisKey.blackList(activeName), userId);

    if (isBlack) {
        return response.json_err('对不起，您未获得参与资格', 4002);
    }

    const paidTime = await redis.zscore(redisKey.payMemberList(activeName), userId);

    if (paidTime !== null) {
        return response.json_err('对不起，本次活动每人只能参与一次', 4001);
    }
    const current = await redis.get(redisKey.currentNumber(activeName)) - 0;
    const total = await redis.get(redisKey.totalNumber(activeName)) - 0;
    if (Number(current) >= Number(total)) {
        const code = await redis.llen(redisKey.lotteryPool(activeName, current));
        if (!code) {
            return response.json_err('对不起，活动已经结束', 4003);
        }
    }

    //获取有没有下过单
    const exitOrder = await orderSoa.selectExistOrder(1,body.userId,['S290040'])
    if(exitOrder.success && exitOrder.data){
        return response.json_success(exitOrder.data)
    }
    redis.hmset(redisKey.payMemberInfo(activeName,userId),{
        isAlert:true
    })
    const orderResult = await orderSoa.createGoodsOrder({
        userId: body.userId,
        shopId: 1,
        latitude: body.lat,
        longitude: body.lng,
        orderSource: 0,
        orderType: 14,
        packageName: '1元抢绝版年卡',
    }, [ { goodsCode: 'S290040', amount: '1' } ]);

    if (orderResult.success) {
        await redis.hmset(redisKey.payMemberInfo(activeName, userId), {
            orderId: orderResult.data,
            orderTime: new Date().getTime(),
        });
        redis.rpush(redisKey.orderMemberList(activeName), userId);
    }
    return orderResult;
};

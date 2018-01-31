const serviceRedis = require('../services/redis');
const serviceUtils = require('../services/utils');
const resJson = require('@util/response-json');
const config = require('../config');

/**
 * 用户领抽奖接口
 * @url /nactive/dialdraw/prize
 * @param userId
 * @return res {Object}
 * @return res.success {Boolean}
 * @return res.code {int} 状态码
 * @return res.message {String} 错误信息
 * {
 *      success: true,
 *      data: '',
 *      code: 1,  // 状态码，200: 没有错误，-1: 没有抽奖资格, -2:还没有加入VIP, -3:已抽奖的用户
 * }
 */
exports.get = async (ctx) => {
    const userId = ctx.query.userId;
    const status = await serviceUtils.checkStatus(userId);
    if (status !== 0) {
        const text = config.statusMap[status];
        ctx.body = resJson.json_err(text, status);
        return;
    }

    const prize = await serviceRedis.getPrize(userId);
    const err = await serviceUtils.doH5Exchange(userId, prize.type);

    /*
    switch (prize.type) {
    case 'ticket': // 电影票发送短信通知
        err = await serviceUtils.sendMessage(userId, prize.data);
        break;
    case 'wash_0': // 0元免费洗车
    case 'wash_10': // 10元欧式精洗
    case 'gas_10': // 10元加油充值卡红包
        err = await serviceUtils.doH5Exchange(userId, prize.type);
        break;
    default: // 没有奖品
        break;
    }
    */
    if (err) {
        ctx.body = err;
    } else {
        ctx.body = resJson.json_success(prize);
    }
};


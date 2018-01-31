const serviceUtils = require('../services/utils');
const serviceRedis = require('../services/redis');
const resJson = require('@util/response-json');
const config = require('../config');
/**
 * 判断用户中奖状态接口
 * @url /nactive/dialdraw/status
 * @param userId
 * @return obj {Object}
 * {
 *      success: true,
 *      code : 0, // 0:可以抽奖， -1:没有抽奖资格, -2：不是vip, -3: 已抽奖
 *      data: {
 *          type : 'ticket', // 奖品类型， code==1时，才有该字段
 *          data : 'qwert'   // 电影票兑换code, type==ticket时，才有该字段
 *      }
 * }
 */

exports.get = async (ctx) => {
    const userId = ctx.query.userId;
    const info = await serviceRedis.getWinInfo(userId);
    if (info) {
        ctx.body = resJson.json_success(info, '', -3);
        return;
    }
    try {
        const status = await serviceUtils.checkStatus(userId);
        const text = config.statusMap[status];
        ctx.body = resJson.json_success(text, '', status);
    } catch (e) {
        ctx.body = resJson.json_err(e.message);
    }
    // ctx.body = resJson.json_success({
    //     type: 'ticket',
    // }, '', -3);
};

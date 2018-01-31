const serviceUtils = require('../services/utils');
const resJson = require('@util/response-json');
/**
 * 获取抽奖次数
 * @url /nactive/turntable/status
 * @param userId
 * @return obj {Object}
 */

exports.get = async (ctx) => {
    const { userId } = ctx.session;
    if (!userId) {
        ctx.body = resJson.json_err('请登录', -1);
        return;
    }
    const info = await serviceUtils.getTime(userId);
    if (!info || !info.success) {
        ctx.body = resJson.json_err('次数获取失败');
        return;
    }
    ctx.body = resJson.json_success(info.data);
};

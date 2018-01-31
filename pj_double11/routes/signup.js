const response = require('@util/response-json');
const redisService = require('../service//redis');

/**
 * 报名记录
 */
exports.post = async (ctx) => {
    const userId = ctx.session.userId;
    if (!userId) {
        ctx.body = response.json_err('请先登录', -1);
        return;
    }

    const isExist = await redisService.queryRecord(userId);
    if (isExist) {
        // 已记录不做任何事情
        ctx.body = response.json_success();
        return;
    }

    await redisService.signRecord(userId, ctx.session.phone);

    ctx.body = response.json_success();
};

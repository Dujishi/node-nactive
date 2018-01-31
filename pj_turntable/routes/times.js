const resJson = require('@util/response-json');
const serviceUtil = require('../services/utils');
const redis = require('../services/redis');

// 添加次数

exports.post = async function(ctx) {
    const { userId } = ctx.session;
    if (!userId) {
        ctx.body = resJson.json_err('请登录', -1);
        return;
    }

    const dayInfo = await redis.getUserPreDayTimes(userId);
    if (!dayInfo || (dayInfo && !dayInfo.share)) { // share未使用
        await serviceUtil.updateTimes(userId, 1);
        await redis.addUserPreDayTimes(userId, null, 1, null);
    }

    ctx.body = resJson.json_success();
    return;
};


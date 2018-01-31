const redis = require('@server/redis');
const config = require('../config');

exports.post = async function(ctx) {
    const userId = ctx.session.userId || ctx.request.body.userId;
    const viewResult = await redis.llen(config.totalViewRedisKey(userId));
    ctx.body = {
        success: true,
        data: viewResult
    };
};

const redis = require('@server/redis');
const utils = require('../utils');
const response = require('@util/response-json');

exports.get = async (ctx) => {
    await ctx.render('/pj_avoidpolice/views/admin', {});
};

exports.post = async function (ctx) {
    const body = ctx.request.body;
    const password = body.password;
    const pw = 'xiaoka123';

    if (password !== pw) {
        ctx.body = response.json_err('请输入正确的密码');
        return;
    }

    const redisKey = utils.getKey('over');
    await redis.set(redisKey, 'true');

    ctx.body = {
        success: true,
        data: 'ok'
    };
};

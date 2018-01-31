const redis = require('@server/redis');
const utils = require('../utils');
const { pw, goodsList } = require('../config');

async function getGoodsList(codes) {
    for (let i = 0; i < codes.length; i++) {
        const redisKey = utils.getKey(codes[i]);
        await redis.del(redisKey);
    }
}

exports.post = async function (ctx) {
    const body = ctx.request.body;
    const password = body.password;

    if (password !== pw) {
        ctx.body = {
            success: false,
            message: '密码错误'
        };
        return false;
    }

    const codes = Object.keys(goodsList);
    await getGoodsList(codes);

    ctx.body = {
        success: true,
        message: '删除成功'
    };
};

const redis = require('@server/redis');
const utils = require('../utils');
const { pw, goodsList } = require('../config');

async function addGoodsInfo(key, value) {
    const redisKey = utils.getKey(key);
    await redis.hmset(redisKey, value);
}

exports.get = async function (ctx) {
    await ctx.render('/pj_mum/views/create-goods', {});
};

exports.post = async function (ctx) {
    const body = ctx.request.body;
    const password = body.password;
    const codes = Object.keys(goodsList);
    const firstGoodsCode = codes[0];

    if (await redis.isExist(utils.getKey(firstGoodsCode))) {
        ctx.body = {
            success: false,
            message: '商品数据已存在'
        };
        return false;
    }

    if (password !== pw) {
        ctx.body = {
            success: false,
            message: '密码错误'
        };
        return false;
    }

    codes.forEach(async function(v) {
        goodsList[v].code = v;
        await addGoodsInfo(v, goodsList[v]);
    });

    ctx.body = {
        success: true,
        message: '添加成功'
    };
};


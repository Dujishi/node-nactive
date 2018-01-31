const redis = require('@server/redis');
const utils = require('../utils');
const { pw, goodsList } = require('../config');
const goodsService = require('../services/goods-service');

async function addGoodsInfo(key, value) {
    const redisKey = utils.getKey(key);
    await redis.hmset(redisKey, value);
}

exports.post = async function (ctx) {
    const body = ctx.request.body;
    const password = body.password;
    const codes = Object.keys(goodsList);

    if (password !== pw) {
        ctx.body = {
            success: false,
            message: '密码错误'
        };
        return false;
    }

    codes.forEach(async function(v) {
        const goodsInfo = await goodsService(v);
        goodsList[v].code = v;
        goodsList[v].sell = goodsInfo.sell;
        await addGoodsInfo(v, goodsList[v]);
    });

    ctx.body = {
        success: true,
        message: '更新成功'
    };
};


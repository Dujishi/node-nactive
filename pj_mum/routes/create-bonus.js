const soaApi = require('@server/soa-api');
const validation = require('@util/validation');
const redis = require('@server/redis');
const utils = require('../utils');
const goodsService = require('../services/goods-service');
const { goodsList, scoreList } = require('../config');


exports.post = async function (ctx) {
    const body = ctx.request.body;
    const code = body.code;
    const score = Number(body.score);
    const userId = ctx.session.userId;

    if (!code || !goodsList[code] || scoreList.indexOf(score) === -1) {
        ctx.body = {
            success: false,
            message: '参数有误',
        };
        return;
    }

    const amount = goodsList[code][`self${score}`] || 0;

    const soaResp = await soaApi('marketing-core/playMumActivityService/addMumActivityBonus', userId, code, amount);
    // const soaResp = {
    //     success: true,
    //     data: {
    //         bonusId: 1,
    //         amount,
    //     }
    // };

    if (soaResp.success) {
        const redisKey = utils.getKey(`bonusId:${soaResp.data.bonusId}`);
        // const redisKey = utils.getKey(`userId:${userId}:${code}`);
        await redis.hmset(redisKey, {
            userId,
            code,
            amount,
            bonusId: soaResp.data.bonusId
        });

        const goodsInfo = await goodsService(code);
        goodsInfo.sell = Number(goodsInfo.sell) + 1;
        await redis.hmset(utils.getKey(code), goodsInfo);
    }

    ctx.body = soaResp;
};

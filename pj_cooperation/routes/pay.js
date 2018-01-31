/**
 * @description
 * @author  yinshi
 * @date 17/6/9.
 */
const config = require('@server/config');
const response = require('@util/response-json');
const validation = require('@util/validation');
const service = require('../service');
const redis = require('@server/redis');
const wechatApi = require('@server/wechat');
const validateStatus = require('../service/check');

const cardKey = userId => `cooperation:spdb:${userId}`;

exports.get = async function (ctx) {
    const userId = ctx.session.userId;
    const card = await redis.get(cardKey(userId));
    const isWechat = validation.isWechat(ctx.headers);
    const data = {
        iswechat: isWechat
    };
    if (isWechat) {
        const unionid = ctx.session.unionid;
        console.log(`unionid===>${unionid}`);
        if (!unionid) {
            await ctx.render('/views/error', {
                message: '只能在微信中访问'
            });
            return;
        }

        const wechat = await wechatApi.getJsConfig(ctx.href);
        Object.assign(data, {
            wechat,
        });
    } else {
        await ctx.render('/views/error', {
            message: '只能在微信中访问'
        });
        return;
    }
    data.card = card;
    data.tongDun = config.tongDun;
    data.sessionId = ctx.session.sessionId;

    await ctx.render('/pj_cooperation/views/pay', data);
};

/**
 * 验证图形验证码
 * @param {Object} ctx
 */
function validImageCode(ctx) {
    const { imgCode } = ctx.request.body;
    const sImageCode = ctx.session.spdbImageCode;
    console.log(imgCode);
    console.log(sImageCode);
    if (sImageCode && imgCode) {
        return imgCode.toLowerCase() == sImageCode.toLowerCase();
    }
    return false;
}

exports.post = async function (ctx) {
    const card = ctx.request.body.card;
    const phone = ctx.session.phone;
    const userId = ctx.session.userId;
    ctx.session.spdbCard = '';// 初始化缓存中卡片信息
    // 校验卡号是否是浦发信用卡，如果不是，不允许下单

    const unionid = ctx.session.unionid;
    console.log(`unionid===>${unionid}`);
    if (!unionid) {
        ctx.body = response.json_err('只能在微信中访问');
        return;
    }

    if (!validImageCode(ctx)) {
        ctx.body = response.json_err('图形验证码不正确，请重新填写!');
        return;
    }

    const validReulst = await validateStatus(userId, card, true);
    // 如果校验不通过
    if (validReulst.success === false) {
        ctx.body = validReulst;
        return;
    }
    // 如果存在下的单
    if (validReulst.data !== true) {
        ctx.session.spdbCard = card;
        const updateResult = await service.updateCard(validReulst.data, card);
        if (!updateResult.success) {
            ctx.body = updateResult;
            return;
        }
        ctx.body = response.json_success(validReulst.data);
        redis.set(cardKey(userId), card);
        // 过期时间设置为一个月
        redis.expire(cardKey(userId), 30 * 24 * 60 * 60);
        return;
    }
    // 下单,下单前需要进行校验资格 和是否存在未支付订单。此时接口已经做了，所以不需要重复调用
    const orderResult = await service.order(userId, phone, card, ctx.session.latitude, ctx.session.longitude);
    // 下单失败了返回失败的接口
    if (!orderResult.success) {
        ctx.body = orderResult;
        return;
    }
    // 返回订单信息
    ctx.session.spdbCard = card;
    redis.set(cardKey(userId), card);
    // 过期时间设置为一个月
    redis.expire(cardKey(userId), 30 * 24 * 60 * 60);
    ctx.body = orderResult;
};

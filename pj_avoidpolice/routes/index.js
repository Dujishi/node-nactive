const wechat = require('@server/wechat');
const validation = require('@util/validation');
const redis = require('@server/redis');
const utils = require('../utils');

exports.get = async (ctx) => {
    const isapp = validation.isApp(ctx.headers);
    const iswechat = validation.isWechat(ctx.headers);
    const url = ctx.origin + ctx.url;
    const wechatConfig = iswechat ? await wechat.getJsConfig(url) : {};

    if (!isapp && !iswechat && !ctx.query.debug) {
        ctx.redirect('http://dl.ddyc.com');
        return;
    }

    const redisKey = utils.getKey('over');
    const isOver = await redis.get(redisKey) === 'true';

    if (isOver) {
        await ctx.render('/views/error', {
            message: '活动已结束'
        });
        return;
    }

    await ctx.render('/pj_avoidpolice/views/index', {
        iswechat,
        isapp,
        isLogin: !!ctx.session.userId,
        wechat: wechatConfig,
        shareUrl: url,
        isDebug: ctx.query.debug
    });
};

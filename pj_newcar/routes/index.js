const validation = require('@util/validation');
const wechatApi = require('@server/wechat');
const share = require('../config/share');
const redis = require('@server/redis');
const keys = require('../config/key');

exports.get = async function (ctx, next) {
    const isWechat = validation.isWechat(ctx.headers);
    const endTime = await redis.get(keys.endTime());
    const data = {
        isapp:validation.isApp(ctx.headers),
        iswechat: isWechat,
        endTime
    };
    share.shareUrl = ctx.origin + share.sharePath;
    Object.assign(data, share);
    if(isWechat){
        const wechat = await wechatApi.getJsConfig(ctx.href);
        Object.assign(data, {
            wechat,
        });
    }
    await  ctx.render('/pj_newcar/views/index',data);
};
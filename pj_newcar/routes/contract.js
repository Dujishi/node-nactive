const validation = require('@util/validation');
const wechatApi = require('@server/wechat');
const share = require('../config/share')

exports.get = async function (ctx) {
    const isWechat = validation.isWechat(ctx.headers);
    const data = {
        isapp:validation.isApp(ctx.headers),
        iswechat: isWechat,
    }
    share.shareUrl = ctx.origin + share.sharePath;
    Object.assign(data, share);
    if(isWechat){
        const wechat = await wechatApi.getJsConfig(ctx.href);
        Object.assign(data, {
            wechat,
        });
    }
    await  ctx.render('/pj_newcar/views/contract', data)
};
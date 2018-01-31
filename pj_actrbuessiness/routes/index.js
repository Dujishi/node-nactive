const validation = require('@util/validation');
const wechatApi = require('@server/wechat');
const share = require('../config/share');
const redis = require('@server/redis');

exports.get = async function (ctx, next) {
    const isWechat = validation.isWechat(ctx.headers);
    let openId = ctx.session.openid || '';
    const data = {
        isapp:validation.isApp(ctx.headers),
        iswechat: isWechat
    };
    share.shareUrl = ctx.origin + share.sharePath;
    Object.assign(data, share);
    if(isWechat){
        const wechat = await wechatApi.getJsConfig(ctx.href);
        // const wechat = await wechatApi.getJsConfig('https://new-m.ddyc.com/nactive/actrbuessiness/index');
        Object.assign(data, {
            wechat,
        });
    }
    await  ctx.render('/pj_actrbuessiness/views/index',data);
};
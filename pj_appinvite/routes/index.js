const soaApi = require('@server/soa-api');
const wechatApi = require('@server/wechat');
const validation = require('@util/validation');
const getFullUrl = require('../../lib/utils/get_full_url');

exports.get = async function (ctx) {
    const isApp = validation.isApp(ctx.headers);
    const url = getFullUrl(ctx);
    const isWechat = validation.isWechat(ctx.headers);
    let openId;
    let wechatShare;
    if (isWechat) {
        const redirectUrl = `https://${ctx.host + ctx.path}`;
        const token = await wechatApi.getOauthToken(ctx, redirectUrl);
        if (!token) { // redirect
            return;
        }
        openId = token.openid;
        wechatShare = await wechatApi.getJsConfig(url);
    }
    const data = {
        iswechat: isWechat,
        isapp: isApp,
        openid: openId,
        wechat: wechatShare,
        shareUrl: url,
        isDebug: true,
    };
    await ctx.render('/pj_appinvite/views/index.html', data);
};

exports.post = async function (ctx) {
    const userId = ctx.request.body.userId;
    const shareRequest = await soaApi('car/oldPullNewService/share', parseInt(userId, 10));
    console.log(shareRequest);
    if (shareRequest.success) {
        ctx.body = {
            success: true,
            data: shareRequest.data,
            msg: shareRequest.message || '请求成功！',
        };
    } else {
        ctx.body = {
            success: shareRequest.success,
            errCode: shareRequest.errCode,
            data: shareRequest.data,
            msg: shareRequest.message || '请求失败',
        };
    }
};

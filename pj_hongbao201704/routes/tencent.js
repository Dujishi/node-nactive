const soaApi = require('@server/soa-api');
const wechatApi = require('@server/wechat');
const validation = require('@util/validation');
const getFullUrl = require('../../lib/utils/get_full_url');

exports.get = async function (ctx) {
    const isApp = validation.isApp(ctx.headers);
    const url = ctx.href;
    const iswechat = validation.isWechat(ctx.headers);

    let openid;
    let wechatShare;
    if (iswechat) {
        const redirectUrl = url;
        const token = await wechatApi.getOauthToken(ctx, redirectUrl);
        if (!token) { // redirect
            return;
        }
        openid = token.openid;
        wechatShare = await wechatApi.getJsConfig(url);
    }
    const data = {
        iswechat,
        isapp: isApp,
        openid,
        wechat: wechatShare,
        shareUrl: url,
        isDebug: true
    };

    await ctx.render('/pj_hongbao201704/views/tencent.html', data);
};
exports.post = async function (ctx) {
    const req = ctx.request.body;
    const phone = req.phone;
    // 验证手机号码是否正确
    if (!validation.isPhone(phone)) {
        ctx.body = { success: false, message: '请输入正确的手机号码' };
        return false;
    }

    const soaRet = await soaApi('platform/userCenterService/isNewCarUser', phone);
    ctx.body = soaRet;
};

const soaApi = require('@server/soa-api');
const platform = require('@server/model-soaapi').platform;
const wechatApi = require('@server/wechat');
const validation = require('@util/validation');
const getFullUrl = require('../../lib/utils/get_full_url');

exports.get = async function (ctx) {
    const isApp = validation.isApp(ctx.headers);
    const url = getFullUrl(ctx);
    const iswechat = validation.isWechat(ctx.headers);

    let openid;
    let wechatShare;
    if (iswechat) {
        const redirectUrl = `https://${ctx.host}${ctx.path}`;
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
    await ctx.render('/pj_hongbao201704/views/index.html', data);
};
exports.post = async function (ctx) {
    const req = ctx.request.body;
    const phone = req.phone;
    // 验证手机号码是否正确
    if (!validation.isPhone(phone)) {
        ctx.body = { success: false, message: '请输入正确的手机号码' };
        return false;
    }

    const userInfo = platform.userCenterService.getUserInfoByPhone(phone, 1);
    if (userInfo && userInfo.data && userInfo.data.channelId && userInfo.data.channelId === 45) {
        ctx.body = {
            success: false,
            message: '您已是典典特权用户，无法领取新人红包'
        };
        return false;
    }
    const soaRet = await soaApi('platform/userCenterService/isNewCarUser', phone);
    ctx.body = soaRet;
};

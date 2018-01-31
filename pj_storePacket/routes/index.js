const soaApi = require('@server/soa-api');
const wechatApi = require('@server/wechat');
const validation = require('@util/validation');
const getFullUrl = require('../../lib/utils/get_full_url');

exports.get = async function(ctx) {
    let jssdkConfig = {};
    const url = getFullUrl(ctx); // 当前页面完整地址
    const iswechat = validation.isWechat(ctx.headers);
    let phone = null;
    if (iswechat) {
        jssdkConfig = await wechatApi.getJsConfig(url);
        const soaRes = await soaApi('platform/userWechatOpenIdSOAService/getUserInfo', ctx.session.openid);
        if (soaRes.success && soaRes.data) {
            phone = soaRes.data.phone;
        }
    }

    await ctx.render('/pj_storePacket/views/index', {
        isapp: validation.isApp(ctx.headers),
        iswechat,
        shareUrl: `${ctx.origin}/nactive/storePacket/index`,
        wechat: jssdkConfig,
        phone: phone || '',
        openid: ctx.session.openid,
    });
};

/*
 * @Author: Yard
 * @Date: 2016-12-21 17:11:50
 * @Last Modified by: Yard
 * @Last Modified time: 2017-02-07 14:10:08
 */
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

    await ctx.render('/pj_ticketpayment/views/index', {
        isapp: validation.isApp(ctx.headers),
        iswechat,
        shareUrl: `${ctx.origin}/nactive/ticketpayment/index`,
        wechat: jssdkConfig,
        phone: phone || '',
        openid: ctx.session.openid,
    });
};

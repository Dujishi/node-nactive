const soaApi = require('@server/soa-api');
const wechatApi = require('@server/wechat');
const validation = require('@util/validation');
const shareTextConfig = require('../config/share.json');
const config = require('../../config');
const stringUtil = require('@util/string-util');

exports.get = async function(ctx) {
    const isApp = validation.isApp(ctx.headers);
    const isWechat = validation.isWechat(ctx.headers);
    const version = ctx.headers.version;
    appKey = ctx.request.query.appKey;
    ctx.session.appKey = appKey;
    let jssdkConfig = {};
    // let openId = '';
    let activityStatus;

    if (isWechat) {
        const url = ctx.origin + ctx.url;
        jssdkConfig = await wechatApi.getJsConfig(url);
    }

    // console.log(productData);
    const shareText = {
        shareTitle: shareTextConfig.shareTitle,
        shareContent: shareTextConfig.shareContent,
        shareSubTitle: shareTextConfig.shareSubTitle,
        shareUrl: `${ctx.origin}/nactive/group/index`,
        shareImgUrl: shareTextConfig.shareImgUrl
    };

    const data = {
        iswechat: isWechat,
        isapp: isApp,
        // openid: openId,
        wechat: jssdkConfig,
        shareText,
        status: activityStatus,
    };
    await ctx.render('/pj_group/views/history', data);
};
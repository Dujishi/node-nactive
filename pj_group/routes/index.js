const soaApi = require('@server/soa-api');
const wechatApi = require('@server/wechat');
const validation = require('@util/validation');
const shareTextConfig = require('../config/share.json');
const config = require('../../config');
const stringUtil = require('@util/string-util');
const pro = require('../config/product');
const productDataArr = ['L2441942'];
let appKey;

exports.get = async function(ctx) {
    const isApp = validation.isApp(ctx.headers);
    const isWechat = validation.isWechat(ctx.headers);
    const userId = ctx.session.userId;
    const version = ctx.headers.version;
    appKey = ctx.request.query.appKey;
    ctx.session.appKey = appKey;
    let jssdkConfig = {};
    let openId = '';
    let activityStatus;

    if (1) {
        await ctx.render('/views/error', {
            message: '活动已结束啦，下次找点来哦~'
        });
        return;
    }

    // version = '3.8.0';
    if (version && stringUtil.compareVersion('3.9.0', version)) {
        const url = 'https://statics.ddyc.com/ddyc/common/upgrade.html';
        ctx.redirect(url);
        return;
    }

    if (isWechat) {
        const url = ctx.origin + ctx.url;
        jssdkConfig = await wechatApi.getJsConfig(url);
        openId = ctx.session.openid;
    }

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
        openId,
        wechat: jssdkConfig,
        shareText,
        status: activityStatus,
    };
    await ctx.render('/pj_group/views/index', data);
};

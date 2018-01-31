const wechatApi = require('@server/wechat');
const validation = require('@util/validation');
const config = require('../../config');
let openId;

exports.get = async function (ctx, next) {
    let jssdkConfig = {};
    const isWechat = validation.isWechat(ctx.headers);
    const isApp = validation.isApp(ctx.headers);
    const url = ctx.href;

    // if (!isApp && !isWechat && !ctx.query.debug) {
    //     ctx.redirect('http://dl.ddyc.com');
    //     return;
    // }

    if (isWechat) {
        jssdkConfig = await wechatApi.getJsConfig(url);
    }

    if (config.env === 'dev') {
        ctx.session.userId = 1001;
    }

    const userId = ctx.session.userId;
    console.log('获取userId为：', userId);
    console.log(ctx.session.wechatUserInfo);
    if (isWechat && ctx.session.openid) {
        openId = ctx.session.openid;
        console.log('获取openId为', openId);
    }
    const shareData = {
        shareUrl: url,
        shareTitle: '我刚在翻菊花的游戏中赢得了xx元现金，剩下的，靠你了！',
        shareContent: '你的兄弟邀请你翻菊花，赢现金！',
        shareSubTitle: '你的兄弟邀请你翻菊花，赢现金！',
        shareImgUrl: 'http://store.ddyc.com/res/xkcdn/icons/share/icon_mum.png'
    };

    const data = {
        isapp: isApp,
        iswechat: isWechat,
        wechat: jssdkConfig,
        shareData,
        openId,
        isLogin: !!ctx.session.userId,
    };

    await ctx.render('/pj_mum/views/index', data);
};

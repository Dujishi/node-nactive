const soaApi = require('@server/soa-api');
const wechatApi = require('@server/wechat');
const validation = require('@util/validation');
const payment = require('@util/native-bridge/lib/payment');
let openId;

exports.get = async function (ctx, next) {
    let jssdkConfig = {};
    const isWechat = validation.isWechat(ctx.headers);
    const isApp = validation.isApp(ctx.headers);
    const url = ctx.href;
    if (isWechat) {
        jssdkConfig = await wechatApi.getJsConfig(url);
    }

    const userId = isApp ? ctx.headers.userid : ctx.session.userId;
    console.log('获取userId为：',userId);
    if(isWechat && ctx.session.openid){
        openId = ctx.session.openid;
        console.log('获取openId为',openId);
    }
    const shareData = {
        shareUrl: url,
        shareTitle:'这是分享标题',
        shareContent:'这是分享的内容，hello！',
        shareSubTitle:'这是分享副标题',
        shareImgUrl:'https://store.ddyc.com/res/xkcdn/icons/share/icon_storelist.png'
    };

    const data = {
        isapp: isApp,
        iswechat: isWechat,
        wechat: jssdkConfig,
        shareData:shareData,
        openId
    };

    await ctx.render('/pj_template/views/index', data);
}

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
        shareTitle:'典典养车，洗车加油违章处理5折起',
        shareContent:'典典超值VIP免费体验一个月，更多权益请在app内查看！',
        shareSubTitle:'典典超值VIP免费体验一个月，更多权益请在app内查看！',
        shareImgUrl:'https://store.ddyc.com/res/xkcdn/icons/share/icon_storelist.png'
    };

    const data = {
        isapp: isApp,
        iswechat: isWechat,
        wechat: jssdkConfig,
        shareData:shareData,
        openId
    };

    await ctx.render('/pj_newgreet/views/index', data);
}

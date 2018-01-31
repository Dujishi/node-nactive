const soaApi = require('@server/soa-api');
const wechatApi = require('@server/wechat');
const validation = require('@util/validation');
let htmlTitle;

exports.get = async function (ctx) {
    const isApp = validation.isApp(ctx.headers);
    const isWechat = validation.isWechat(ctx.headers);
    const isbuy = ctx.request.query.isbuy;
    let userId = ctx.session.userId || ctx.headers.userid ||'';
    if(isbuy=="no"){
        htmlTitle = "附近服务商家";
    }else{
        htmlTitle = "请选择服务商家";
    }
    const data = {
        iswechat: isWechat,
        isapp: isApp,
        openid: '',
        userId:userId,
        wechat: '',
        shareUrl:'',
        shareTitle: '',
        shareSubTitle: '',
        shareContent: '',
        htmlTitle
    };
    await ctx.render(`/pj_upkeep/views/shoplist`,data);
}
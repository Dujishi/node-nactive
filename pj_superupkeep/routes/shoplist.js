const soaApi = require('@server/soa-api');
const wechatApi = require('@server/wechat');
const validation = require('@util/validation');

exports.get = async function (ctx) {
    const isApp = validation.isApp(ctx.headers);
    const isWechat = validation.isWechat(ctx.headers);
    const data = {
        iswechat: isWechat,
        isapp: isApp,
        openid: '',
        wechat: '',
        shareUrl:'',
        shareTitle: '',
        shareSubTitle: '',
        shareContent: ''
    };
    await ctx.render(`/pj_superupkeep/views/shoplist`,data);
}

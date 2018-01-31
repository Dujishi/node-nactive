const wechatApi  = require('@server/wechat');
const validation = require('@util/validation');
const getFullUrl = require('../../lib/utils/get_full_url');

exports.get = async function(ctx, next) {
    let jssdkConfig = {};
    let url = getFullUrl(ctx); // 当前页面完整地址
    if (validation.isWechat(ctx.headers)) {
        jssdkConfig = await wechatApi.getJsConfig(url);
    }
    
    await ctx.render('/pj_zsal160714/views/index',{
        isapp : validation.isApp(ctx.headers),
        shareUrl : ctx.origin + '/nactive/zsal160714/index',
        wechat : jssdkConfig
    });
}
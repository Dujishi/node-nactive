const validation = require('@util/validation');
const getFullUrl = require('../../lib/utils/get_full_url');
const wechatApi = require('@server/wechat');

exports.get = async (ctx, next) => {
    let jssdkConfig = {};
    
    if (validation.isWechat(ctx.headers)) {
        let url = ctx.origin + ctx.path;
        jssdkConfig = await wechatApi.getJsConfig(url);
    }
    
    await ctx.render('/pj_cxxb160704/views/main',{
        touse : true,
        isapp : validation.isApp(ctx.headers),
        wechat : jssdkConfig
    });
}
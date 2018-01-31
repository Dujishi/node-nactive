const validation = require('@util/validation');
const getFullUrl = require('../../lib/utils/get_full_url');
const wechat = require('@server/wechat');
// new-m.ddyc.com
// open平台接口，需要添加渠道参数
exports.get = async function (ctx) {
    // let name = 'unknow'
    // if (ctx.session.name) {
    //     name = ctx.session.name;
    // }
    // ctx.session.name = 'hhhhh';
    // await ctx.render('/pj_demo/views/index',{
    //     session : name
    // });

    const iswechat = validation.isWechat(ctx.headers);
    const isapp = validation.isApp(ctx.headers);

    if (!iswechat && !isapp) {
        ctx.redirect('http://dl.ddyc.com');
        return;
    }

    let openid = '';
    let jsConfig = {};
    if (iswechat) {
        const url = getFullUrl(ctx); // 当前页面完整地址, 包括queryString参数
        const redirectUrl = ctx.origin + ctx.path;
        const token = await wechat.getOauthToken(ctx, redirectUrl, { foo: 'bar' });
        if (!token) { // redirect
            return;
        }
        openid = token.openid;
        jsConfig = await wechat.getJsConfig(url);
    }

    const data = {
        isapp,
        wechat: jsConfig,
        openid,
        shareUrl: ctx.origin + ctx.path
    };

    await ctx.render('/pj_demo/views/index', data);
};

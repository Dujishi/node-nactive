const openApi = require('@server/model').openApi;
const validation = require('@util/validation');
const wechatApi = require('@server/wechat');

exports.get = async function (ctx) {
    const isWechat = validation.isWechat(ctx.headers);
    const data = {
        isapp: validation.isApp(ctx.headers),
        iswechat: isWechat
    };

    if (isWechat) {
        const wechat = await wechatApi.getJsConfig(ctx.href);
        Object.assign(data, {
            wechat,
        });
    }
    const appkey = ctx.query.appkey;
    const userId = ctx.session.userId;
    ctx.session.appkey = appkey || ctx.session.appkey;
    const lat = ctx.query.lat || ctx.session.latitude || 0;
    const lng = ctx.query.lng || ctx.session.longitude || 0;
    const result = await openApi.getOpenApi('tb/inspection/shop/list', {
        userId,
        lat,
        lng,
        type: 2
    }, appkey);
    console.log(`商家列表数据=>${JSON.stringify(result)}`);
    if (!result.success) {
        await ctx.render('/views/error', {
            message: result.message
        });
        return;
    }
    data.shopList = result.data;
    await ctx.render('/pj_cooperation/views/shoplist', data);
};

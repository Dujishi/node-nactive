const soaApi = require('@server/soa-api');
const config = require('../../config');
const validation = require('@util/validation');
const customConfig = require('../config');
const response = require('@util/response-json')

exports.post = async function (ctx) {
    const body = ctx.request.body;
    const code = 'anxiang';
    const userId = Number(body.userId) || Number(ctx.session.userId);
    const itemCode = body.itemCode;
    const itemName = body.itemName;
    const shopId = body.shopId;
    // const cityId = body.cityId;
    const orderSource = Number(body.orderSource);
    const lat = Number(body.lat);
    const lng = Number(body.lng);
    const iswechat = validation.isWechat(ctx.headers);

    if (!userId) {
        ctx.body = response.json_err('当前用户未登录', -1);
        return;
    }

    // if (iswechat && !userId) {
    //     if (!userId) {
    //         const url = encodeURIComponent(`${ctx.origin}/nactive/anxiang/index`);
    //         ctx.redirect(`${ctx.origin}/feopen/login/index?url=${url}`);
    //         return;
    //     }
    // }

    const currentUrl = encodeURIComponent(`https://${ctx.host}${config.pathPrefix}/anxiang/index`);
    // const soaResp = await soaApi('car/generalMonthActivitySoaService/buy', code, userId, itemCode, itemName, orderSource, lat, lng, true);

    const soaResp = await soaApi('car/generalMonthActivitySoaService/buy20', {
        activityId: customConfig.activityId,
        userId,
        itemCode,
        itemName,
        shopId,
        orderSource,
        lat,
        lng,
        ingoreStatus: true,
    });

    console.log('========= generalMonthActivitySoaService ==========');
    console.log(soaResp);

    if (soaResp.success) {
        const openid = ctx.session.openid;
        const orderId = soaResp.data;
        const payUrl = `${config.payHost}/payaccount/jspcashier/pay?source=WAP&userId=${userId}&orderId=${orderId}&openid=${openid}&callback=${currentUrl}`;
        ctx.body = {
            success: true,
            data: {
                orderId,
                payUrl,
                msg: '下单成功'
            }
        };
    } else {
        ctx.body = soaResp;
    }
    console.log(soaResp);
};

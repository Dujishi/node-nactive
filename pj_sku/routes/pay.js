/**
 * Created by youmu on 2017/3/8.
 */
const validation = require("@util/validation");
const soaApi = require('@server/soa-api');
const config = require('../../config');
const response = require('@util/response-json')

exports.post = async function (ctx) {
    const body = ctx.request.body;
    const isApp = validation.isApp(ctx.headers);
    let userId = isApp ? body.userId : ctx.session.userId;
    const lat = body.lat || ctx.session.latitude || 0;
    const lng = body.lng || ctx.session.longitude || 0;
    const goodsCode = body.commodityCode || ctx.session.commodityCode;
    const itemName = body.commodityName || ctx.session.commodityName;
    const code = body.activeId || ctx.session.activeId;
    const currentUrl = encodeURIComponent(`https://${ctx.host}${config.pathPrefix}/sku/index?activeId=${code}`);
    const orderSource = isApp ? 0 : 2;

    if (!userId) {
        ctx.body = response.json_err('当前用户未登录', -1);
        return
    }

    const orderRes = await soaApi('car/generalMonthActivitySoaService/buy', code, userId, goodsCode, itemName, orderSource, Number(lat), Number(lng), true);

    if (!orderRes.success) {
        ctx.body = orderRes;
        return
    }

    const orderId = orderRes.data;
    const payUrl = `${config.payHost}/payaccount/jspcashier/pay?source=WAP&userId=${userId}&orderId=${orderId}&callback=${currentUrl}`;
    ctx.body = response.json_success({
        orderId: orderRes.data,
        uri: payUrl,
    }, '下单成功');
}

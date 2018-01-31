const soaApi = require('@server/soa-api');

exports.post = async function (ctx) {
    const body = ctx.request.body;
    const goodsCode = body.goodsCode;
    const goodsAmount = body.goodsAmount;
    const shopId = body.shopId;
    const shopResult = await soaApi('morder-car/order/create/flashsales/order', goodsCode, goodsAmount, shopId);
    ctx.body = shopResult;
};
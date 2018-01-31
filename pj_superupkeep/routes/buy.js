const soaApi = require('@server/soa-api');
const config = require('../../config');

exports.post = async function (ctx) {
    const body   = ctx.request.body;
    const userId = body.userId || ctx.session.userId;
    const goodsCode = body.goodsCode;
    const goodsAmount = 1;
    const shopId = body.shopId;
    const lat = body.lat;
    const lng = body.lng;
    const activeId = body.activeId;


    //  morder-soa/orderCreateSOAService/flashSalesOrder
    const currentUrl = encodeURIComponent(`https://${ctx.host}${config.pathPrefix}/superupkeep/index?activeId=${activeId}`);
    //const soaResp = await soaApi('morder-car/order/create/flashsales/order', goodsCode, goodsAmount, shopId);
    const soaResp = await soaApi('morder-soa/orderCreateSOAService/flashSalesOrder',
        {orderSource:0,btype:1,shopId:1,features:{careShopId:shopId},userId:userId,latitude:lat,longitude:lng},
        [{goodsCode:goodsCode, amount:goodsAmount}]);

    console.log(JSON.stringify(soaResp));
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

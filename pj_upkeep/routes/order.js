const soaApi = require('@server/soa-api');
const config = require('../../config');

exports.post = async function (ctx) {
    const body   = ctx.request.body;
    const userId = body.userId || ctx.session.userId;
    const goodsCode = body.goodsCode;
    const goodsAmount = 1;
    const shopId = body.shopId;
    const lat = body.lat;
    const lon = body.lon;
    const activityId = body.activityId;
    const appKey = ctx.session.appKey;
    let channelId = '';

    if(!userId || userId==='undefined'){
        ctx.body = {
            success: false,
            code:-1,
            message:'用户未登录！',
            data: {}
        };
        return ;
    }

    if(appKey){
        const channelData = await soaApi('/online-soa/channelSoaService/getChannelBaseInfo',appKey);
        if(channelData && channelData.success && channelData.data){
            channelId = channelData.data.channelId || '';
        }
    }

    const currentUrl = encodeURIComponent(`https://${ctx.host}${config.pathPrefix}/upkeep/index?activityId=${activityId}`);
    let para ;
    if(lat && lon && lat!='undefined' && lon!='undefined'){
        para = {orderSource:0,btype:1,shopId:1, ordertype:12,channel:channelId, features:{careShopId:shopId},userId:userId,latitude:lat,longitude:lon};
    }else{
        para = {orderSource:0,btype:1,shopId:1, ordertype:12,channel:channelId, features:{careShopId:shopId},userId:userId};
    }


    const soaResp = await soaApi('morder-soa/orderCreateSOAService/flashSalesOrder',
        para, [{goodsCode:goodsCode, amount:goodsAmount}]);

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

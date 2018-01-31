const soaApi = require('@server/soa-api');
const config = require('../../config');

exports.post = async function (ctx) {
    // if(config.env !== 'prod' && config.env !== 'pre'){
    //     userId = '3699033';
    // }
    const body = ctx.request.body;
    // const activityId = body.activityId;
    // const commodityCode = body.commodityCode;
    const cityId = body.cityId;
    const lon = body.lon;
    const lat = body.lat;
    const pageSize = body.pageSize || 10;
    const pageNumber = body.pageNumber;
    const showStatus = body.showStatus || 1;
    const userId = body.userId || ctx.session.userId || ctx.headers.userid;

    // 写死数据
    const shopResult = await soaApi('marketing-core/saleActivityService/searchCareShopBaseInfoByActivity', 222, 'L222', cityId);
    // console.log(shopResult);
    if (shopResult.success && shopResult.data && shopResult.data.length > 0) {
        let shopBase;
        if (lon && lat) {
            shopBase = {
                lon,
                lat,
                userId,
                pageNumber,
                pageSize,
                careShopIdList: shopResult.data,
                showStatus
            };
        } else {
            shopBase = {
                userId,
                pageNumber,
                pageSize,
                careShopIdList: shopResult.data,
                showStatus
            };
        }

        const shopDataResult = await soaApi('shop-car/shopSearchService/searchCareShopBaseInfo', shopBase);
        // shop-car/shopSearchService/searchNearbyCareShop
        console.log(shopDataResult);
        ctx.body = shopDataResult;
    } else {
        if (shopResult.data && shopResult.data.length == 0) {
            ctx.body = {
                success: false,
                message: '该城市没有商家参与该活动！',
                code: -2000,
                data: []
            };
        } else {
            ctx.body = shopResult;
        }
    }
};

const soaApi = require('@server/soa-api');
// const wechatApi = require('@server/wechat');
const validation = require('@util/validation');

exports.get = async function (ctx) {
    const isApp = validation.isApp(ctx.headers);
    const isWechat = validation.isWechat(ctx.headers);
    const commodityCode = ctx.request.query.commodityCode || 'L1054652';
    let lv1CategoryId = '';
    let lv2CategoryId = '';
    let commodityId = '';
    let imgUrl = [];

    const productDetailData = await soaApi('commodity/commoditySoaService/selectCommodityByCodeAndShopId', commodityCode, 1);
    console.log(productDetailData);
    if (productDetailData.success) {
        lv1CategoryId = productDetailData.data.lv1CategoryId;
        lv2CategoryId = productDetailData.data.lv2CategoryId;
        commodityId = productDetailData.data.commodityId;
    }
    const soaRes = await soaApi('shop-car/commodityRecommendService/getImgTextList', null, lv1CategoryId, commodityId);
    console.log(soaRes);
    if (soaRes.success) {
        imgUrl = soaRes.data;
    }

    const data = {
        iswechat: isWechat,
        isapp: isApp,
        imgUrl,
    };
    await ctx.render('/pj_upkeep/views/detail', data);
};

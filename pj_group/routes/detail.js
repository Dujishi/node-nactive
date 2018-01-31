const soaApi = require('@server/soa-api');
const wechatApi = require('@server/wechat');
const validation = require('@util/validation');
const shareTextConfig = require('../config/share.json');

exports.get = async function (ctx) {
    const isApp = validation.isApp(ctx.headers);
    const isWechat = validation.isWechat(ctx.headers);
    const commodityCode = ctx.request.query.commodityCode;
    let lv1CategoryId = '';
    let lv2CategoryId = '';
    let commodityId = '';
    let imgUrl = [];
    let jssdkConfig = {};
    let openId = '';

    if (isWechat) {
        const url = ctx.origin + ctx.url;
        jssdkConfig = await wechatApi.getJsConfig(url);
        openId = ctx.session.openid;
    }

    const productDetailData = await soaApi('commodity/commoditySoaService/selectCommodityByCodeAndShopId', commodityCode, 1);
    console.log('productDetailData', productDetailData);
    if (productDetailData.success && productDetailData.data) {
        lv1CategoryId = productDetailData.data.lv1CategoryId;
        lv2CategoryId = productDetailData.data.lv2CategoryId;
        commodityId = productDetailData.data.commodityId;
    }
    const soaRes = await soaApi('shop-car/commodityRecommendService/getImgTextList', null, lv1CategoryId, commodityId);
    console.log(soaRes);
    if (soaRes.success) {
        imgUrl = soaRes.data;
    }

    const shareText = {
        shareTitle: shareTextConfig.shareTitle,
        shareContent: shareTextConfig.shareContent,
        shareSubTitle: shareTextConfig.shareSubTitle,
        shareUrl: `${ctx.origin}/nactive/group/index`,
        shareImgUrl: shareTextConfig.shareImgUrl
    };

    const data = {
        iswechat: isWechat,
        isapp: isApp,
        imgUrl,
        shareText,
        openId,
        wechat: jssdkConfig,
    };
    await ctx.render('/pj_group/views/detail', data);
};

const soaApi = require('@server/soa-api');
const wechatApi = require('@server/wechat');
const validation = require('@util/validation');
const shareTextConfig = require('../config/share.json');
const config = require('../../config');
const stringUtil = require('@util/string-util');
const pro = require('../config/product');
const productDataArr = [];
const productDataOriginArr = [];
pro.forEach((ele) => {
    productDataArr.push(ele.code);
});
pro.forEach((ele) => {
    productDataOriginArr.push(ele.originCode);
});

exports.post = async function(ctx) {
    // const body = ctx.request.body;
    let productData = await soaApi('commodity/commoditySoaService/selectCommodityByCodesAndShopId', productDataArr, 1);
    if (!productData.success) {
        ctx.body = productData;
        return;
    }

    let priceData = await soaApi('sale-price/careBusinessServicePriceSoaService/selectCommodityPriceList', { careShopId: 1, commodityCodes: productDataArr, pricingType: 2 });
    if (!priceData.success) {
        ctx.body = priceData;
        return;
    }

    let priceOriginData = await soaApi('sale-price/careBusinessServicePriceSoaService/selectCommodityPriceList', { careShopId: 1, commodityCodes: productDataOriginArr, pricingType: 2 });
    if (!priceOriginData.success) {
        ctx.body = priceOriginData;
        return;
    }

    productData = productData.data;
    priceData = priceData.data;
    priceOriginData = priceOriginData.data;
    productData.forEach((item, index) => {
        priceData.forEach((solt) => {
            if (solt.code == item.commodityCode) {
                productData[index].appPrice = solt.appPrice;
                productData[index].posPrice = solt.posPrice;
                productData[index].buyNow = true;
            }
        });
        pro.forEach((ele) => {
            if (ele.code == item.commodityCode) {
                item.commodityOriginCode = ele.originCode;
            }
        });
    });
    productData.forEach((item, index) => {
        priceOriginData.forEach((solt) => {
            if (solt.code == item.commodityOriginCode) {
                productData[index].commodityOriginCodePrice = solt.appPrice;
            }
        });
    });

    ctx.body = {
        success: true,
        code: 200,
        message: 'ok',
        data: productData,
    };
};

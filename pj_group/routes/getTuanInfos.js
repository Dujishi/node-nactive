const soaApi = require('@server/soa-api');
const carModel = require('@server/model/carModel');
const config = require('../../config');
const pro = require('../config/product');
const defaultAvatar = require('../config/avatar');

exports.post = async function (ctx) {
    const userId = ctx.session.userId || ctx.request.body.userId;
    const status = ctx.request.body.status;
    console.log(status);
    if (!userId) {
        ctx.body = {
            success: false,
            code: -200,
            message: '未登录',
            data: null,
        };
        return;
    }
    let info = await soaApi('morder-soa/pintuanService/getTuanInfos', parseInt(userId));
    if (!info.success) {
        ctx.body = info;
        return;
    }
    const productDataArr = [];
    const productDataOriginArr = [];
    info.data.forEach((ele) => {
        productDataArr.push(ele.commodityCode);
        pro.forEach((solt) => {
            if (ele.commodityCode == solt.code) {
                ele.commodityOriginCode = solt.originCode;
                productDataOriginArr.push(solt.originCode);
            }
        });
    });

    let avatar = 'https://store.ddyc.com/res/xkcdn/icons/default/car_logo@2x.png';
    const userInfo = await soaApi('platform/userCenterService/getUserBase', [parseInt(userId)]);
    if (userInfo.success && userInfo.data && userInfo.data.length > 0) {
        if (userInfo.data[0].avatar) {
            avatar = userInfo.data[0].avatar;
        } else {
            avatar = defaultAvatar;
        }
    }

    let productData = await soaApi('commodity/commoditySoaService/selectCommodityByCodesAndShopId', productDataArr, 1);
    if (!productData.success) {
        ctx.body = productData;
        return;
    }
    let productOriginData = await soaApi('sale-price/careBusinessServicePriceSoaService/selectCommodityPriceList', { careShopId: 1, commodityCodes: productDataOriginArr, pricingType: 2 });
    if (!productOriginData.success) {
        ctx.body = productOriginData;
        return;
    }
    let priceData = await soaApi('sale-price/careBusinessServicePriceSoaService/selectCommodityPriceList', { careShopId: 1, commodityCodes: productDataArr, pricingType: 2 });
    if (!priceData.success) {
        ctx.body = priceData;
        return;
    }
    info = info.data;
    productData = productData.data;
    priceData = priceData.data;
    productOriginData = productOriginData.data;
    info.forEach((item) => {
        productData.forEach((ele) => {
            if (item.commodityCode === ele.commodityCode) {
                item.commodityName = ele.commodityName;
                item.thumbImg = ele.thumbImg;
                item.buyNow = false;
            }
        });
        priceData.forEach((obj) => {
            if (item.commodityCode === obj.code) {
                item.appPrice = obj.appPrice;
                item.posPrice = obj.posPrice;
            }
        });
        productOriginData.forEach((solt) => {
            if (item.commodityOriginCode === solt.code) {
                item.commodityOriginCodePrice = solt.appPrice;
            }
        });
        item.userId = '';
        item.avatar = [avatar, 'https://store.ddyc.com/res/xkcdn/icons/default/car_logo@2x.png'];
    });

    const returnInfo = [];
    info.forEach((item) => {
        if (status) {
            if (status == 1 && item.status == 1) {
                returnInfo.push(item);
            } else if (status == 2 && item.status != 1) {
                returnInfo.push(item);
            }
        } else {
            returnInfo.push(item);
        }
    });

    if (returnInfo.length == 0) {
        ctx.body = {
            success: true,
            code: 400,
            message: '没有匹配的团！',
            data: [],
        };
        return;
    }

    ctx.body = {
        success: true,
        code: 200,
        message: 'ok',
        data: returnInfo,
    };
};

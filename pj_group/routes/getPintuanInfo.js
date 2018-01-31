const soaApi = require('@server/soa-api');
const carModel = require('@server/model/carModel');
const config = require('../../config');
const pro = require('../config/product');
const defaultAvatar = require('../config/avatar');

exports.post = async function (ctx) {
    const body = ctx.request.body;
    const id = body.id;
    const userId = ctx.session.userId || ctx.request.body.userId;
    let info = await soaApi('morder-soa/pintuanService/get', id);
    if (!info.success || !info.data) {
        ctx.body = info;
        return;
    }
    let productData = await soaApi('commodity/commoditySoaService/selectCommodityByCodeAndShopId', info.data.commodityCode, 1);
    if (!productData.success) {
        ctx.body = productData;
        return;
    }
    let priceData = await soaApi('sale-price/careBusinessServicePriceSoaService/selectCommodityPriceList', { careShopId: 1, commodityCodes: [info.data.commodityCode], pricingType: 2 });
    if (!priceData.success) {
        ctx.body = priceData;
        return;
    }
    pro.forEach((ele) => {
        if (ele.code == info.data.commodityCode) {
            info.data.commodityOriginCode = ele.originCode;
        }
    });
    let priceOriginData = await soaApi('sale-price/careBusinessServicePriceSoaService/selectCommodityPriceList', { careShopId: 1, commodityCodes: [info.data.commodityOriginCode], pricingType: 2 });
    if (!priceOriginData.success) {
        ctx.body = priceOriginData;
        return;
    }
    info = info.data;
    productData = productData.data;
    priceData = priceData.data;
    priceOriginData = priceOriginData.data;
    productData = Object.assign(productData, info);
    // productData.commodityName = info.commodityName;
    // productData.thumbImg = info.thumbImg;
    productData.appPrice = priceData[0].appPrice;
    productData.posPrice = priceData[0].posPrice;
    productData.commodityOriginCodePrice = priceOriginData[0].appPrice;
    if (userId == productData.userId) {
        ctx.body = {
            success: true,
            code: 400,
            message: '该团为自己参与的团！',
            data: [],
        };
        return;
    }

    if (productData.status != 1) {
        ctx.body = {
            success: true,
            code: 500,
            message: '该团已经完成或者失效！',
            data: [],
        };
        return;
    }
    const userInfo = await soaApi('platform/userCenterService/getUserBase', [parseInt(productData.userId)]);
    productData.userPhone = '你的好友';
    productData.avatar = [];
    console.log(userInfo);
    if (userInfo.success && userInfo.data && userInfo.data.length > 0) {
        const phone = userInfo.data[0].phone;
        productData.userPhone = `${phone.slice(0, 4)}****${phone.slice(7, 11)}`;
        if (userInfo.data[0].avatar) {
            productData.avatar.push(userInfo.data[0].avatar);
        } else {
            productData.avatar.push(defaultAvatar);
        }
    }
    productData.avatar.push('https://store.ddyc.com/res/xkcdn/icons/default/car_logo@2x.png');
    // const len = productData.limit.length - productData.avatar.length;
    // if (len > 0) {
    //     for (let i = 0; i < len; i++) {
    //         productData.avatar.push('https://store.ddyc.com/res/xkcdn/icons/default/car_logo@2x.png');
    //     }
    // }
    productData.userId = '';
    ctx.body = {
        success: true,
        code: 200,
        message: 'ok',
        data: productData,
    };
};

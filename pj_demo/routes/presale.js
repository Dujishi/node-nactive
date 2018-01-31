/**
 * 测试预售页面
 */
const soaApi = require('@server/soa-api');
const wechatApi = require('@server/wechat');
const validation = require('@util/validation');
const kLog = require('@server/kafka-log');
const carModel = require('@server/model/carModel');
const config = require('../../config');
const getFullUrl = require('../../lib/utils/get_full_url');

// 项目名称
const pjName = '/pj_demo';


/**
 * 获取预售信息
 */
async function getPreSaleInfo(ids) {
    return await soaApi('marketing-core/preSaleActivityService/getPreSaleList', ids);
}

exports.get = async function(ctx) {
    let jssdkConfig = {};
    const url = getFullUrl(ctx); // 当前页面完整地址
    const iswechat = validation.isWechat(ctx.headers);

    if (iswechat) {
        jssdkConfig = await wechatApi.getJsConfig(url);
    }

    let result = {};
    const ids = ctx.request.query.ids ? ctx.request.query.ids.split(',') : [];
    if (ids.length > 0) {
        result = await getPreSaleInfo(ids);
        console.log(`result ==> ${result}`);
        if (!result.success) {
            ctx.body = result;
            return;
        }
        /**
         * result.data 格式
         * [ {
         *      "bookingTime": 1495618717000, //预订开始时间
         *      "bookingEndTime": 1495705119000,//预订结束时间
         *      "finalPaymentEndTime": 1496140740000,//付尾款结束时间
         *      "proName": "调整调整",//促销名称
         *      "preSaleSku": { //sku信息
         *          "commodityCode": "L5001", //商品编码
         *          "commodityName": "sdsd", //商品名称
         *          "carShopIds": [ 14, 318 ], //支持商家id
         *          "earnestMoney": 20,//定金
         *          "finalPayment": 280, //尾款
         *          "price": 300, // 商品价格
         *          "limitNum": 1 // 单人限购数量
         *      }
         * } ]
         */
    }


    await ctx.render(`${pjName}/views/presale`, {
        isapp: validation.isApp(ctx.headers),
        iswechat,
        result: result.data,
        wechat: jssdkConfig
    });
};


/**
 * 提交数据
 */
exports.post = async function(ctx) {
    const userId = ctx.session.userId;
    const { shopId, goodsCode, lat, lng, shopPrice, goodsName } = ctx.request.body;

    const isapp = validation.isApp(ctx.headers);
    const iswechat = validation.isWechat(ctx.headers);
    const url = getFullUrl(ctx); // 当前页面完整地址

    const orderType = 1;
    const orderSource = 120;
    const priceSource = 1;

    // 获取用户默认车辆
    const defaultCar = await carModel.getDefaultCar(userId);

    console.log(`${JSON.stringify(defaultCar)}`);

    if (!defaultCar.success) {
        ctx.body = {
            success: false,
            message: defaultCar.message,
            data: {}
        };
        return;
    }
    let carId = '';
    if (defaultCar.data && defaultCar.data.id) {
        carId = defaultCar.data.id;
    }

    // 组合参数
    const goodsItems = [{
        goodsCode,
        amount: 1,
        price: parseFloat(shopPrice).toFixed(2)
    }];
    const params = {
        userId,
        shopId,
        orderType,
        orderSource,
        goodsItems,
        priceSource,
        packageName: goodsName,
        userCarId: carId,
        payPrice: parseFloat(shopPrice).toFixed(2),
        latitude: lat,
        longitude: lng,
    };

    // 下单
    const result = await soaApi('morder-soa/orderCreateSOAService/createFranchiseOrder', params);

    // 日志
    kLog.log(JSON.stringify(result));

    // 处理错误情况
    if (!result.success) {
        ctx.body = {
            success: false,
            message: result.message,
            data: {}
        };
        return;
    }

    const orderId = result.data;
    let openid = '';
    if (iswechat) {
        openid = ctx.session.openid;
    }

    // 默认情况采用h5支付
    let data = `${config.payHost}/payaccount/jspcashier/pay?source=WAP&userId=${userId}&orderId=${orderId}&openid=${openid}&callback=${url}`;

    // 如果是APP 采用 app 支付
    if (isapp) {
        data = orderId;
    }

    ctx.body = {
        success: true,
        message: '',
        data
    };
};

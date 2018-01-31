const wechatApi = require('@server/wechat');
const soaApi = require('@server/soa-api');
const validation = require('@util/validation');
const queryString = require('@util/string-util/query-string');
const config = require('../config');
const conf = require('../conf');


exports.post = async function(ctx, next) {

    let iswechat = validation.isWechat(ctx.headers);
    let isapp = validation.isApp(ctx.headers);

    let body = ctx.request.body;
    let cityId = body.cityId;
    let cityName = body.cityName;
    let lat = body.lat;
    let lng = body.lng;
    let commodityCode = body.commodityCode;
    let goodsName = body.goodsName;

    //如果body中有userId，首先获取body中，否则获取session中用户信息
    let userId = null;
    if (body.userId - 0 > 0) {
        userId = body.userId;
        if (!ctx.session.userId) {
            ctx.session.userId = userId;
        }
    } else if (ctx.session.userId - 0 > 0) {
        userId = ctx.session.userId;
    }

    if (!cityId) {
        ctx.body = {
            success: false,
            data: {},
            msg: '请选择城市'
        }
        return;
    }

    //判断用户是否绑定
    if (!userId) {
        ctx.body = {
            success: false,
            data: {},
            msg: '请先登录后在抢购'
        }
        return;
    }

    //数据信息
    const sendOrderInfo = {
        "latitude": lat || null,
        "longitude": lng || null,
        "orderSource": 0,
        "shopId": 1,
        "userCarId": null,
        "userId": userId,
        "cityId": cityId,
        "cityName": cityName,
        "packageName": goodsName
    };
    const goodsInfo = [{
        "amount": 1,
        "goodsCode": commodityCode,
    }];

    //下单
    // console.log("===下单参数==")
    // console.log([sendOrderInfo, goodsInfo, []]);

    let orderInfo = await soaApi("morder-soa/orderCreateSOAService/createActivityOrder", sendOrderInfo, goodsInfo, []);

    //成功
    if (orderInfo.success) {
        let url = '';
        if (!isapp) {
            let uriIndex = ctx.origin + '/nactive/' + conf.pjPath + '/index';
            url = queryString.urlAppend(config.payHost + '/payaccount/jspcashier/pay', {
                orderId: orderInfo.data,
                userId: userId,
                source: 'WAP',
                callback: uriIndex
            });
            orderInfo.data = url;
        }
        ctx.body = orderInfo;
        return;
    }

    //已下过单
    if (orderInfo && orderInfo.errCode - 0 == 6602) {
        ctx.body = {
            success: false,
            data: {},
            errCode: orderInfo.errCode,
            msg: '不要贪心哦，您已经抢购过此项目'
        }
        return;
    }

    //打印错误日志
    console.error(orderInfo)


    ctx.body = {
        success: false,
        data: {},
        msg: '下单失败，请稍候重试'
    };
};
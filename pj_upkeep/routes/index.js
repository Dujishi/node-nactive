const soaApi = require('@server/soa-api');
const wechatApi = require('@server/wechat');
const validation = require('@util/validation');
const shareTextConfig = require('../config/share.json');
const config = require('../../config');
const stringUtil = require('@util/string-util');

const productDataArr = ['L1072428', 'L1072430', 'L1072431', 'L1072433', 'L1072434'];
let appKey;

exports.get = async function(ctx) {
    const isApp = validation.isApp(ctx.headers);
    const isWechat = validation.isWechat(ctx.headers);
    const version = ctx.headers.version;
    appKey = ctx.request.query.appKey;
    ctx.session.appKey = appKey;
    let jssdkConfig = {};
    // let openId = '';
    let activityStatus;
    // version = '3.8.0';
    if (version && stringUtil.compareVersion('3.9.0', version)) {
        const url = 'https://statics.ddyc.com/ddyc/common/upgrade.html';
        ctx.redirect(url);
        return;
    }
    // 活动时间判断
    if (config.env == 'prod' || config.env == 'pre') {
        const time = (new Date()).getTime() / 1000;
        if (time < 1502294400) {
            activityStatus = -1;
            await ctx.render('/views/error', {
                errCode: 404,
                title: '超级保养',
                message: '活动尚未开始，等待吧~',
            });
            return;
        } else if (time > 1514735999) {
            activityStatus = 0;
            await ctx.render('/views/error', {
                errCode: 404,
                title: '超级保养',
                message: '活动已结束咯，下次早点来吧~',
            });
            return;
        } else if (time > 1502294400 && time < 1514735999) {
            activityStatus = 1;
        }
    }

    if (isWechat) {
        const url = ctx.origin + ctx.url;
        jssdkConfig = await wechatApi.getJsConfig(url);
    }

    // console.log(productData);
    const shareText = {
        shareTitle: shareTextConfig.shareTitle,
        shareContent: shareTextConfig.shareContent,
        shareSubTitle: shareTextConfig.shareSubTitle,
        shareUrl: `${ctx.origin}/nactive/upkeep/index`,
        shareImgUrl: shareTextConfig.shareImgUrl
    };

    const data = {
        iswechat: isWechat,
        isapp: isApp,
        // openid: openId,
        wechat: jssdkConfig,
        shareText,
        status: activityStatus,
    };
    await ctx.render('/pj_upkeep/views/index', data);
};

exports.post = async function(ctx) {
    const body = ctx.request.body;
    const cityId = body.cityId;
    const productData = [];
    const promises = [];

    productDataArr.forEach((code) => {
        promises.push(soaApi('commodity/commoditySoaService/selectCommodityByCodeAndShopId', code, 1));
    });
    await Promise.all(promises).then((values) => {
        // console.log(values[0]);
        values.forEach((data) => {
            if (data.success) {
                productData.push(data.data);
            }
        });
    });

    let priceData = await soaApi('sale-price/careBusinessServicePriceSoaService/selectCommodityPriceList', { careShopId: 1, commodityCodes: productDataArr, pricingType: 2 });
    if (priceData.success) {
        priceData = priceData.data;
        await productData.forEach((item, index) => {
            switch (index) {
            case 0:
                productData[index].commodityCode2 = 'L2003';
                break;
            case 1:
                productData[index].commodityCode2 = 'L2005';
                break;
            case 2:
                productData[index].commodityCode2 = 'L1054650';
                break;
            case 3:
                productData[index].commodityCode2 = 'L1054651';
                break;
            case 4:
                productData[index].commodityCode2 = 'L1054653';
                break;
            default:
                productData[index].commodityCode2 = 'L1054653';
            }
            priceData.forEach((data) => {
                if (data.code == item.commodityCode) {
                    productData[index].posPrice = data.posPrice;
                }
            });
        });

        // await priceData.forEach((item) => {
        //     productData.forEach((data, index) => {
        //         if (item.code == data.commodityCode) {
        //             productData[index].appPrice = item.appPrice;
        //         }
        //     });
        // });
    }
    if (cityId == 3 || cityId == 8 || cityId == 141) {
        productData.shift();
    }
    ctx.body = {
        success: true,
        data: productData,
        code: 200,
        message: 'ok',
    };
};

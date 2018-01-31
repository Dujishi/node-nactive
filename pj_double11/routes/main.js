// const wechatApi = require('@server/wechat');
// const validation = require('@util/validation');
// const shareConfig = require('../config/share');
// const idsConfig = require('../config/ids');
// const getFullUrl = require('../../lib/utils/get_full_url');
// const redisService = require('../service//redis');
const soaApi = require('@server/soa-api');
const resposeJson = require('@util/response-json');


/**
 *  双十一主会场
 */
// exports.get = async (ctx) => {
//     // 验证app
//     const isapp = validation.isApp(ctx.headers);
//     const iswechat = validation.isWechat(ctx.headers);
//     const url = getFullUrl(ctx);
//
//     // 如果有userId
//     if (ctx.query.userId) {
//         ctx.session.userId = ctx.query.userId - 0;
//     }
//
//
//     let data = {
//         isapp,
//         iswechat,
//         shareData: Object.assign({
//             shareUrl: url
//         }, shareConfig.mainRoom),
//     };
//
//
//     if (iswechat) {
//         const wechat = await wechatApi.getJsConfig(url);
//         data = Object.assign(data, {
//             wechat
//         });
//     }
//
//
//     await ctx.render('/pj_double11/views/mainRoom', data);
// };

// 获取去污打蜡数据
function getWaxInfo(waxIds) {
    return soaApi('marketing-core/saleActivityService/getClientH5ActByActIds', waxIds);
}

// 获取机油保养数据
function getOildInfo(oilIds) {
    return soaApi('marketing-core/saleActivityService/getClientH5ActByActIds', oilIds);
}

// 格式化时间方法;
function formatTime(countDown) {
    let hour = parseInt(countDown / 3600);
    // const day = parseInt(hour / 24);
    const restSecond = countDown % 3600;


    let minut = parseInt(restSecond / 60);
    let second = restSecond % 60;
    hour = hour < 10 ? `0${hour}` : hour;
    minut = minut < 10 ? `0${minut}` : minut;
    second = second < 10 ? `0${second}` : second;
    return `${hour}:${minut}:${second}`;
    // return day;
}

exports.post = async (ctx) => {
    const body = ctx.request.body;
    const waxIds = body.waxIds;
    const oilIds = body.oilIds;
    const oilSkuList = [];

    const retData = {};

    // 获取去污打蜡数据
    const waxRes = await getWaxInfo(waxIds);

    if (!waxRes || !waxRes.success) {
        ctx.body = resposeJson.json_err(waxRes ? waxRes.message : '获取列表出错');
        return;
    }

    // 获取保养数据
    const oilRes = await getOildInfo(oilIds);
    if (!oilRes || !oilRes.success) {
        ctx.body = resposeJson.json_err(oilRes ? oilRes.message : '获取列表出错');
        return;
    }


    // 格式化倒计时间
    const nowDate = Date.now();
    const endDate = new Date('2017-11-11 23:59:59').getTime();
    const countdownTime = parseInt((endDate - nowDate) / 1000);
    console.log(countdownTime, nowDate, endDate);
    const countDownStr = formatTime(countdownTime);


    // 组装数据
    retData.status = waxRes.data[0].status;
    retData.status.countDownStr = countDownStr;
    retData.waxSkuList = waxRes.data[0].skuList;
    retData.waxSkuList[0].commodityItems = waxRes.data[0].commodityItems;

    // console.log(waxRes.data);
    // 将配件信息装入列表中
    oilRes.data.map((item) => {
        item.skuList[0].commodityItems = item.commodityItems.join(',');
        oilSkuList.push(item.skuList[0]);
    });

    retData.oilSkuList = oilSkuList;


    ctx.body = resposeJson.json_success(retData);
};

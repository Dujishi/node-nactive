const redis = require('@server/redis');
const resJson = require('@util/response-json');
const soaApi = require('@server/soa-api');
const soaModel = require('@server/model-soaapi');
const moment = require('moment');
const config = require('../../config');

const whiteListKey = 'node_bjbank:whitelist';

async function inWhiteList(phone) {
    return await redis.sismember(whiteListKey, phone);
}
function formatDate(date) {
    return moment(date).format('YYYY-MM-DD');
}

// exchangeId 测试环境是602
// 生产环境是2600
let exchangeId = 602;
if (config.env === 'prod') {
    exchangeId = 2600;
}

exports.getCoupons = async (phone) => {
    if (!await inWhiteList(phone)) {
        return resJson.json_err('抱歉，您没有资格', 102);
    }
    const userInfo = await soaModel.platform.userCenterService.getUserInfoByPhone(phone, 23);
    if (userInfo.success) {
        const userId = userInfo.data.userId;
        const resCoupon = await soaApi('car/promotionSoaService/exchangeCouponInfo', userId, exchangeId);
        if (resCoupon.success) {
            resCoupon.data.beginTime = formatDate(resCoupon.data.beginTime);
            resCoupon.data.endTime = formatDate(resCoupon.data.endTime);
        }
        return resCoupon;
    }
    return userInfo;
    // return {
    //     success: true,
    //     data: {
    //         beginTime: '2017-01-01',
    //         endTime: '2018-01-01',
    //         count: 10
    //     }
    // };
};

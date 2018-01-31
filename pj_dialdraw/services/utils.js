const soaApi = require('@server/soa-api');
const serviceRedis = require('./redis');
const { prizeMap } = require('../config');
/**
 * 发送电影票兑换码
 */
// exports.sendMessage = async (userId, ticketCode) => {
//     const infoResp = await soaApi('platform/userCenterService/getUserInfoById', userId, 1);
//     if (!infoResp.success) {
//         return infoResp;
//     }

//     const phone = infoResp.data.phone;
//     const text = `恭喜您获得2张《一万公里的约定》电影票，打开爱奇艺APP点击乐活-电影票，选择电影、影院、场次、座位后，支付时输入兑换码${ticketCode}即可完成兑换。回TD退订`;
//     const msgResp = await soaApi('platform/sendMessageService/sendMessage', phone, text);
//     if (!msgResp.success) {
//         return msgResp;
//     }
//     return null;
// };

/**
 * 领取优惠劵和红包
 */
exports.doH5Exchange = async (userId, type) => {
    const resp = await soaApi('car/promotionSoaService/doH5Exchange', userId, prizeMap[type], null);
    if (!resp.success) {
        return resp;
    }
    return null;
};

/**
 * 判断时间戳，是否在配置的时间区间内
 * @param time {Date}
 * @return err {Number} 0:是， -1:否
 */
async function compareTime(time) {
    const activityTime = await serviceRedis.getActivityTime();
    const start = new Date(activityTime.start).getTime();
    const end = new Date(activityTime.end).getTime();
    if (time > start && time < end) {
        return 0; // 表示没有错误，可以抽奖
    }
    return -1;
}
exports.compareTime = compareTime;
/**
 * 根据时间判断用户抽奖资格
 * @param userId {Number}
 * @return {Number}
 *  0:可以抽奖
 *  -1:加入VIP的时间不符合活动时间
 *  -2:还没有加入VIP
 */
async function checkTimeStatus(userId) {
    const soaResp = await soaApi('car/promotionSoaService/getVipBeginTime', userId);
    if (soaResp.success) {
        if (!soaResp.data) {
            return -2;
        }
        return await compareTime(soaResp.data);
    }
    throw new Error(soaResp.message);
}
exports.checkTimeStatus = checkTimeStatus;

/**
 * 判断用户是否可以抽奖
 * @param userId {Number}
 * @return {Number} -3: 已抽奖， -2:还没有加入VIP， -1:加入VIP的时间不符合活动时间， 0： 可以抽奖
 */
exports.checkStatus = async (userId) => {
    const info = await serviceRedis.getWinInfo(userId);
    if (info) {
        return -3;
    }
    return await checkTimeStatus(userId);
};


const wechatUser = require('@server/wechat/lib/user');
const soaApi = require('@server/soa-api');

/**
 * 判断时间戳，是否在配置的时间区间内
 * @param  {Date} time
 * @param  {Object} activityTime
 * @param  {string} activityTime.start
 * @param  {string} activityTime.end
 */
function compareTime(time, activityTime) {
    const start = new Date(activityTime.start).getTime();
    const end = new Date(activityTime.end).getTime();
    if (time > start && time < end) {
        return 0; // 表示没有错误，可以抽奖
    }
    return -1;
}
exports.compareTime = compareTime;

/**
 * 获取微信用户信息
 * @param  {string} openid
 */
async function getWechatUserInfo(openid) {
    const userInfo = await wechatUser.getUserInfo(openid);
    if (userInfo.headimgurl && userInfo.headimgurl.indexOf('http://') > -1) {
        userInfo.headimgurl = userInfo.headimgurl.replace('http://', 'https://');
    }
    return userInfo;
}
exports.getWechatUserInfo = getWechatUserInfo;

/**
 * 获取用户
 * @param  {String} unionid
 */
async function getUserInfo(unionid) {
    const res = await soaApi('marketing-core/shareActivityUserRefPhoneService/getShareUserInfo', unionid);
    return res;
}
exports.getUserInfo = getUserInfo;

/**
 * 获取活动信息
 * @param  {String} orderId
 */
async function getActInfo(orderId) {
    const res = await soaApi('marketing-core/shopActivityService/getShopActivityByOrderId', orderId);
    return res;
}
exports.getActInfo = getActInfo;


/**
 * 更新手机号
 */
async function updatePhone(userPhone, uniqueId, userHeadImgUrl, userHeadName) {
    const res = await soaApi('marketing-core/shareActivityUserRefPhoneService/updateShareUserInfo', {
        userPhone,
        uniqueId,
        userHeadImgUrl,
        userHeadName
    });
    return res;
}
exports.updatePhone = updatePhone;

/**
 * 时间处理
 * @param {Date} nowDate
 * @param {string} reveiceTimeStr
 */
function nearTime(nowDate, reveiceTimeStr) {
    if (!reveiceTimeStr) {
        return '';
    }
    const nTime = nowDate.getTime();
    console.log(reveiceTimeStr);
    const rTime = (new Date(reveiceTimeStr)).getTime();
    const sTime = nTime - rTime;
    if (sTime <= 1 * 60 * 1000) {
        return '刚刚';
    }
    if (sTime <= 60 * 60 * 1000) {
        return `${Math.floor(sTime / (1000 * 60))}分钟前`;
    }
    if (sTime <= 24 * 60 * 60 * 1000) {
        return `${Math.floor(sTime / (1000 * 60 * 60))}小时前`;
    }
    return `${Math.floor(sTime / (1000 * 60 * 60 * 24))}天前`;
}

/**
 * 获取红包信息
 * @param  {number} userId
 * @param  {string} encryptOrderId
 * @param  {string} phone
 * @param  {string} headImgUrl
 * @param  {string} headTitle
 */
async function getPacketInfo(userId, orderId, actId, uniqueId, phone, headImgUrl, headTitle) {
    const res = await soaApi('marketing-core/shareBonusesActivityService/saveAfterGetShareBonusesByOrder', {
        orderId,
        actId,
        userId,
        phone,
        headImgUrl,
        headTitle,
        uniqueId
    });

    if (!res || (res && !res.success)) {
        return res;
    }
    const data = {
        isOptimum: false,
        mine: {
            mine: false,
            price: res.data.ownBonusesInfo.price,
            userPhone: res.data.ownBonusesInfo.userPhone ? res.data.ownBonusesInfo.userPhone.replace(/(\d{3})(\d{4})(\d{4})/, '$1****$3') : '',
            expireTimeStr: res.data.ownBonusesInfo.expireTimeStr,
            commodityName: res.data.ownBonusesInfo.commodityName,
            isOptimum: !!res.data.ownBonusesInfo.isOptimum,
            status: res.data.ownBonusesInfo.status,
            limitRuleDesc: res.data.ownBonusesInfo.limitRuleDesc
        },
        list: []
    };
    if (data.mine.status === 3) {
        data.mine.over = true;
        data.mine.overTxt = '红包已领完';
    } else if (data.mine.status === 4) {
        data.mine.over = false;
    } else if (data.mine.status === 5) {
        data.mine.over = true;
        data.mine.overTxt = '今日领取次数已用完';
    }

    if (res.data && res.data.shareBonusesList && res.data.shareBonusesList.length > 0) {
        const nDate = new Date();
        res.data.shareBonusesList.forEach((it) => {
            if (!data.isOptimum) {
                data.isOptimum = !!it.isOptimum;
            }
            data.list.push({
                headImgUrl: it.headImgUrl,
                headTitle: it.headTitle,
                price: it.price,
                commodityName: it.commodityName,
                isOptimum: it.isOptimum,
                reveiceTimeStr: nearTime(nDate, it.reveiceTimeStr)
            });
        });
    }

    return { success: true, data };
}
exports.getPacketInfo = getPacketInfo;

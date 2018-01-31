const soaApi = require('@server/soa-api');
const kafka = require('@server/kafka-log');
const serviceRedis = require('./redis');
const dateUtil = require('./date');
const { prizeMap, chances, chances2 } = require('../config');

/**
 * 发送短信
 */
const sendMessage = async (phone, text) => {
    text = `恭喜您抽中了${text}，只需支付1元就可以了啦，赶快去典典养车APP中奖记录支付吧~`;
    const msgResp = await soaApi('platform/sendMessageService/sendMessage', phone, text);
    if (!msgResp.success) {
        return msgResp;
    }
    return null;
};
exports.sendMessage = sendMessage;

/**
 * 领取优惠劵和红包
 */
const doH5Exchange = async (userId, type) => {
    const resp = await soaApi('car/promotionSoaService/doH5Exchange', userId, prizeMap[type].code, null);
    return resp;
};
exports.doH5Exchange = doH5Exchange;

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
 * 获取用户抽奖次数
 */
const getTime = (userId) => {
    const dateTime = dateUtil(new Date(), 'yyyyMMdd');
    return soaApi('morder-soa/orderLogicSOAService/queryQualification', { dateTime, userId });
};
exports.getTime = getTime;

/**
 * 更新用户抽奖次数
 * number 新增正数，扣减负数
 */
const updateTimes = (userId, number) => {
    const dateTime = dateUtil(new Date(), 'yyyyMMdd');
    return soaApi('morder-soa/orderLogicSOAService/updateQualification', { dateTime, userId, number });
};
exports.updateTimes = updateTimes;


/**
 * 概率
 */
const chance = (chancesMap) => {
    const rdm = Math.floor((Math.random() * 100) + 1);// 随机数
    console.log('抽奖随机数=>', rdm);
    const keys = Object.keys(chancesMap);
    for (let i = 0; i < keys.length; i++) {
        const start = i === 0 ? 1 : chancesMap[keys[i - 1]] + 1;
        if (rdm >= start && rdm <= chancesMap[keys[i]]) {
            return keys[i];
        }
    }
    return 'prize_5';
};
exports.chance = chance;

/**
 * 获取商品库存
 */
const getStockGoods = async () => {
    const goodsCodesObj = await serviceRedis.getGoodsCodesList();
    if (!goodsCodesObj) {
        return false;
    }
    const keys = Object.keys(goodsCodesObj);
    const res = await soaApi('dstock/commodityStockSoaService/queryCommodityStockByShopIdAndCommodityCodes', 1, Object.values(goodsCodesObj));
    console.log('实物商品信息=>', JSON.stringify(res));
    if (res && res.success && res.data && res.data.length > 0) {
        const data = res.data;
        for (let i = 0; i < data.length; i++) {
            if (data[i].useCount && data[i].useCount > 0) {
                // 获取商品code
                for (let j = 0; j < keys.length; j++) {
                    if (data[i].commodityCode === goodsCodesObj[keys[j]]) {
                        return keys[j]; // 检查到有库存就立即返回 商品code
                    }
                }
            }
        }
    }
    return false;
};

/**
 * 根据商品code查询商品
 * @param {string} code
 */
const getGoodsInfoByCode = code => soaApi('commodity/ddycCommoditySoaService/selectCommodityByCode', code);

/**
 * 减库存
 */
const reduceStockGoods = async (commodityCode, number) => {
    const goodsCodes = await serviceRedis.getGoodsCodesList();
    let res = null;
    if (goodsCodes) {
        res = await soaApi('dstock/commodityStockSoaService/subVirtualCommodityStock', 1, goodsCodes[commodityCode], number);
    }
    return res;
};

/**
 * 抽奖奖品
 */
exports.getPrize = async (userId, isApp, phone) => {
    let type = 'hb';
    let prize = null;
    let name = '谢谢惠顾';
    if (!isApp) {
        // 如果是非APP，不走实物逻辑
        prize = chance(chances);
        if (prizeMap[prize]) {
            name = prizeMap[prize].name;
        }
    } else {
        // 先判断实物逻辑是否有库存, 如果有则抽奖实物
        const goodsCode = await getStockGoods();

        let isExist = false;
        if (goodsCode) {
            // 判断当前用户是否已经抽中到该商品，如果已抽到就不会抽了
            isExist = await serviceRedis.checkPrizeGoodsByUser(userId, goodsCode);
        }
        if (goodsCode && !isExist) {
            // 如果有库存 改变抽奖概率
            const cPrize = chance(chances2);
            if (cPrize === 'sw') {
                type = 'sw';
                prize = goodsCode;
                // 减库存
                const rest = await reduceStockGoods(goodsCode, 1);
                if (rest.success) {
                    const goodsInfo = await getGoodsInfoByCode(prize);
                    if (goodsInfo && goodsInfo.success) {
                        name = goodsInfo.data.commodityName;
                    }
                } else {
                    kafka.error('库存扣减失败', 'nodejs', rest);

                    type = 'hb';
                    prize = chance(chances);
                    if (prizeMap[prize]) {
                        name = prizeMap[prize].name;
                    }
                }
            } else {
                prize = cPrize;
                if (prizeMap[prize]) {
                    name = prizeMap[prize].name;
                }
            }
        } else {
            prize = chance(chances);
            if (prizeMap[prize]) {
                name = prizeMap[prize].name;
            }
        }
    }
    await updateTimes(userId, -1); // 减机会
    if (type === 'hb' && prize !== 'prize_5' && prize !== 'prize_6') {
        // 发红包
        const ret = await doH5Exchange(userId, prize);
        if (!ret || (ret && !ret.success)) {
            kafka.error('领取红包失败', 'nodejs', ret);
            prize = 'prize_5';
        }
    }

    if (prize === 'prize_5') {
        type = 'sm';
        name = '神秘红包';
    }

    if (prize === 'prize_6') {
        type = '';
        name = '谢谢惠顾';
    }

    // 记录抽奖信息
    const date = dateUtil(new Date(), 'yyyy-MM-dd hh:mm:ss');
    await serviceRedis.recordPrizeInfo(userId, prize, name, type, date, phone);

    if (type === 'sw') {
        setTimeout(async () => {
            await sendMessage(phone, name);
        }, 3000);
    }

    const data = {
        type,
        prize,
        name
    };

    console.log('抽奖信息=>', JSON.stringify(data));

    return data;
};

/**
 * 从订单检查用户和商品的订单是否未支付的
 * @param {number} userId
 * @param {string} goodsCode
 */
const checkOrderPaid = (userId, goodsCode) => soaApi('morder-soa/activityOrderSOAService/userOrdersByGoodsCodeTime', userId, [goodsCode], new Date('2017-09-11 00:00:00'), new Date());
exports.checkOrderPaid = checkOrderPaid;

/**
 * 从订单检查用户和商品的订单是否有未下过单
 * @param {number} userId
 * @param {string} goodsCode
 */
const checkHasOrder = (userId, goodsCode) => soaApi('morder-soa/orderQuerySOAService/getOrderByGoodsCode', userId, goodsCode);
exports.checkHasOrder = checkHasOrder;

/**
 * 获取奖品记录列表
 */
exports.getPrizeRecordList = async (userId) => {
    const list = await serviceRedis.getRecordPrizeList(userId);
    if (list && list.length) {
        const checkPaid = [];
        const indexs = [];
        const rsList = [];

        // 判断奖品列表中是否有实物奖品
        list.forEach((it, index) => {
            const item = JSON.parse(it);
            if (item.type === 'sw') { // 如果有实物奖品从缓存中看是否已经支付完成
                indexs.push(index);
                checkPaid.push(serviceRedis.checkPaid(userId, item.prize));
            } else {
                item.name = prizeMap[item.prize] ? prizeMap[item.prize].name : '谢谢惠顾';
            }
            rsList.push(item);
        });

        // 如果有实物奖品
        if (checkPaid.length) {
            const checkList = await Promise.all(checkPaid);
            const getOrderList = [];
            const orderCheckList = [];
            const index2s = [];
            const index2s1 = [];
            console.log('checkList===>', checkList);
            checkList.forEach((it2, index) => {
                const item = rsList[indexs[index]];
                rsList[indexs[index]].paid = it2 === 'false' ? !1 : true;
                if (it2 === 'false') { // 检查是否已下过单
                    index2s.push(indexs[index]);
                    orderCheckList.push(checkHasOrder(userId, item.prize));
                } else {
                    index2s1.push(indexs[index]);
                    getOrderList.push(serviceRedis.getOrderId(userId, item.prize));
                }
            });

            // 获取订单ID
            if (getOrderList.length) {
                const orderRes = await Promise.all(getOrderList);
                orderRes.forEach((ito, index) => {
                    rsList[index2s1[index]].order = true;
                    rsList[index2s1[index]].orderId = ito || '';
                });
            }


            // 如果有下过单，检查是否已支付完成
            console.log('orderCheckList===>', orderCheckList);
            if (orderCheckList && orderCheckList.length) {
                const orderResList = await Promise.all(orderCheckList);
                const checkPaidList = [];
                const index3s = [];
                orderResList.forEach((it3, index) => {
                    const prize = rsList[index2s[index]].prize;
                    if (it3 && it3.success && it3.data) { // 有下过单，检查是否完成支付
                        rsList[index2s[index]].order = true;
                        rsList[index2s[index]].orderId = it3.data;
                        index3s.push(index2s[index]);
                        checkPaidList.push(checkOrderPaid(userId, prize));
                    }
                });

                // 有下单
                if (checkPaidList.length) {
                    const checkPaidRes = await Promise.all(checkPaidList);
                    const updatePaidList = [];
                    checkPaidRes.forEach((it4, index) => {
                        const prize = rsList[index3s[index]].prize;
                        const orderId = rsList[index3s[index]].orderId || '';
                        if (it4 && it4.success && it4.data && it4.data[prize]) {
                            rsList[index3s[index]].paid = true;
                            updatePaidList.push(serviceRedis.updatePaid(userId, prize, orderId)); // 检查是否已支付
                        } else {
                            rsList[index3s[index]].paid = false;
                        }
                    });

                    // 更新
                    console.log('updatePaidList===>', updatePaidList);
                    if (updatePaidList && updatePaidList.length) {
                        await Promise.all(updatePaidList);
                    }
                }
            }
        }
        console.log('抽奖列表=>', JSON.stringify(rsList));
        return rsList;
    }
    return list;
};

/**
 * 检查是否可以抽奖
 * return 0：没有抽奖次数，1：可抽奖，-1：服务器繁忙
 */
exports.checkStatus = async (userId) => {
    const resTimes = await getTime(userId);
    if (resTimes && resTimes.success) {
        if (resTimes.data > 0) {
            return 1;
        }
        // return 1;
        return 0;
    }
    return '-1';
};

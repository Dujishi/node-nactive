const redis = require('@server/redis');
const dateUtil = require('./date');

/**
 * redis操作封装
 * node_turntable:win:<userId> {hash}  中奖记录列表
 * node_turntable:prize {list}    剩余奖品列表
 */

const keyStart = 'node_turntable:start';
const keyEnd = 'node_turntable:end';
const keyDayInfo = 'node_turntable:dayinfo:';
const keyGoodsCodes = 'node_turntable:goodscodes';
const keyPrizeRecords = 'node_turntable:records:'; // 记录用户抽奖列表
const keyPrizeRecordSw = 'node_turntable:recordsw:'; // 记录实物抽奖
const keyShareNumber = 'node_turntable:sharenumber'; // 记录实物抽奖

/**
 * 获取活动的开始和结束时间
 */
exports.getActivityTime = async () => {
    const start = await redis.get(keyStart);
    const end = await redis.get(keyEnd);
    return {
        start,
        end,
    };
};

/**
 * 获取商品codes
 */
exports.getGoodsCodesList = async () => {
    const str = await redis.get(keyGoodsCodes);
    if (str) {
        const goodsCodes = JSON.parse(str);
        return goodsCodes;
    }
    return null;
};

/**
 * 查询抽奖信息
 */
exports.getRecordPrizeList = async (userId) => {
    const key = `${keyPrizeRecords}${userId}`;
    const list = await redis.lrange(key, 0, -1);
    return list || [];
};

/**
 * 判断用户是否已经抽到此商品
 */
exports.checkPrizeGoodsByUser = async (userId, prize) => {
    // const key = `${keyPrizeRecordSw}${userId}:${prize}`;
    const key = `${keyPrizeRecordSw}${userId}:*`;
    const res = await redis.keys(key);
    return res ? !!res.length : false;
};

/**
 * 记录抽奖信息
 * userId 用户ID
 * prize 奖品信息
 * type 奖品类型 hb/sw
 */
exports.recordPrizeInfo = async (userId, prize, name, type, date, phone) => {
    const data = {
        userId,
        prize, // 奖品
        name, // 名称
        type, // 奖品类型
        date, // 抽奖时间
        phone
    };
    if (type === 'sw') {
        await redis.hmset(`${keyPrizeRecordSw}${userId}:${prize}`, {
            paid: false,
            userId,
            name,
            phone,
            date,
            prize
        });
    }
    await redis.rpush(`${keyPrizeRecords}${userId}`, JSON.stringify(data));
};

/**
 * 检查是否已支付完成
 */
exports.checkPaid = (userId, goodsCode) => {
    const key = `${keyPrizeRecordSw}${userId}`;
    return redis.hget(`${key}:${goodsCode}`, 'paid');
};

/**
 * 获取订单id
 */
exports.getOrderId = (userId, goodsCode) => {
    const key = `${keyPrizeRecordSw}${userId}`;
    return redis.hget(`${key}:${goodsCode}`, 'orderId');
};

/**
 * 更新抽奖商品已支付完成
 */
exports.updatePaid = (userId, goodsCode, orderId) => {
    const key = `${keyPrizeRecordSw}${userId}`;
    return redis.hmset(`${key}:${goodsCode}`, {
        paid: true,
        orderId
    });
};

/**
 * 获取实物抽奖的列表
 */
exports.getSwPrizeList = async () => {
    const key = `${keyPrizeRecordSw}*`;
    const res = await redis.keys(key);
    const infos = [];
    res.forEach((it) => {
        infos.push(redis.hgetall(it));
    });
    const list = Promise.all(infos);
    return list;
};

/**
 * 分享次数
 */

const getShareNumber = async () => {
    let res = await redis.get(keyShareNumber);
    if (!res) {
        res = 2798;
    }
    return res;
};
exports.getShareNumber = getShareNumber;

/**
 * 设置分享次数
 */
const setShareNumber = async () => {
    const rdm = Math.floor((Math.random() * 100) + 1);
    let shareNumber = await getShareNumber();
    shareNumber = shareNumber ? shareNumber - 0 : 2798;

    const res = await redis.set(keyShareNumber, shareNumber + rdm);
    return res;
};
exports.setShareNumber = setShareNumber;

/**
 * 获取用户每天的免费、分享、登录
 * 存储结构
 * node_turntable:dayinfo:userId
 * {
 *    2017-09-01: {
 *      free:1,
 *      share:1,
 *      login:1
 *    }
 * }
 */
exports.getUserPreDayTimes = async (userId) => {
    const date = dateUtil(new Date(), 'yyyy-MM-dd');
    const dayInfo = await redis.hget(`${keyDayInfo}${userId}`, date);
    if (dayInfo && typeof dayInfo === 'string') {
        return JSON.parse(dayInfo);
    }
    return null;
};

/**
 * 记录用户每天的免费、分享、登录
 * 存储结构
 * node_turntable:dayinfo:userId
 * {
 *    2017-09-01: {
 *      free:1,
 *      share:1,
 *      login:1
 *    }
 * }
 */
exports.addUserPreDayTimes = async (userId, free, share, login) => {
    const date = dateUtil(new Date(), 'yyyy-MM-dd');
    const dayInfo = await redis.hget(`${keyDayInfo}${userId}`, date);
    let obj = {};
    if (dayInfo && typeof dayInfo === 'string') {
        obj = Object.assign(obj, JSON.parse(dayInfo));
    }
    if (free) {
        obj.free = 1;
    }
    if (share) {
        obj.share = 1;
    }
    if (login) {
        obj.login = 1;
    }
    const res = await redis.hmset(`${keyDayInfo}${userId}`, date, JSON.stringify(obj));
    return res;
};


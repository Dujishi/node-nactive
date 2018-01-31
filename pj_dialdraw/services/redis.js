const redis = require('@server/redis');

/**
 * redis操作封装
 * node_dialdraw:win:<userId> {hash}  中奖记录列表
 * node_dialdraw:prize {list}    剩余奖品列表
 */

const keyWin = 'node_dialdraw:win2:';
const keyPrize = 'node_dialdraw:prize';
const keyStart = 'node_dialdraw:start';
const keyEnd = 'node_dialdraw:end';

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
 * 奖品发放
 */
exports.getPrize = async (userId) => {
    let prizeData = await redis.lpop(keyPrize);

    if (prizeData === null) { //  奖品发完，默认发放0元洗车劵
        prizeData = 'wash_0';
    }
    const arr = prizeData.split('|');
    const type = arr[0];
    const ret = { type };

    if (type === 'ticket') {
        ret.data = arr[1];
    }
    // 保存中奖记录
    await redis.set(keyWin + userId, prizeData);
    return ret;
};

/**
 * 已经抽奖过的用户
 */
exports.getWinInfo = async (userId) => {
    const info = await redis.get(keyWin + userId);
    if (info === null) {
        return null;
    }
    const arr = info.split('|');
    return {
        type: arr[0],
        data: arr[1]
    };
};

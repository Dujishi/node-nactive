/**
 * @description
 * @author  yinshi
 * @date 16/11/24.
 */

const redis = require('@server/redis');
const redisKey = require('../config/redisKey');

const util = require('../util');

function initPool(activeName, totalNumber, currentNumber = 1) {
    // 初始化抽奖池
    const data = [];
    for (let n = currentNumber + 1; n <= totalNumber; n++) {
        const codes = [];
        for (let i = 1; i < 500; i++) {
            codes.push(10000 + i);
        }
        data.push(redis.rpush(redisKey.lotteryPool(activeName, n), ...codes));
    }
    return Promise.all(data);
}

async function init(activeName, totalNumber, currentNumber = 1) {
    for (let n = currentNumber; n <= totalNumber; n++) {
        const codes = [];
        for (let i = 1; i < 500; i++) {
            codes.push(10000 + i);
        }
        await redis.del(redisKey.lotteryPool(activeName, n));
    }
    const t = redis.set(redisKey.totalNumber(activeName), totalNumber);
    const c = redis.set(redisKey.currentNumber(activeName), currentNumber);
    const init = initPool(activeName, totalNumber, currentNumber);
    return Promise.all([t, c, init]);
}
async function restart(activeName, totalNumber, currentNumber = 1) {
    const keys = await redis.keys(redisKey.activeKey(activeName, '*'));
    await redis.del(...keys);
    return init(activeName, totalNumber, currentNumber);
}


async function change(activeName, totalNumber) {
    const oldTotal = await redis.get(redisKey.totalNumber(activeName));
    const current = await redis.get(redisKey.currentNumber(activeName));

    if (current >= totalNumber) {
        return false;
    }
    console.log(arguments);
    await redis.set(redisKey.totalNumber(activeName), totalNumber);
    if (oldTotal - totalNumber > 0) {
        console.log('error')
        // for (let n = totalNumber + 1; n <= oldTotal; n++) {
        //     redis.del(redisKey.lotteryPool(activeName, n));
        // }
    } else {
        await initPool(activeName, Number(totalNumber), Number(oldTotal));
    }
}

function addBlackList(activeName, userids) {
    let userId = userids;
    if (typeof userids == 'string' || typeof userids == 'number') {
        userId = [userids];
    }
    return redis.sadd(redisKey.blackList(activeName), ...userId);
}

// 更新用户抽奖时间
async function paidCb(activeName, userId) {
    const time = new Date().getTime();
    const mock = {
        userId,
        paidTime: new Date().getTime(),
        logo: '',
    };
    redis.zadd(redisKey.payMemberList(activeName), time, userId);
    let current = await redis.get(redisKey.currentNumber(activeName));
    let code = await redis.rpop(redisKey.lotteryPool(activeName, current));

    // 如果存在code
    if (!code) {
        await choujiang(activeName, current);
        current = await redis.incr(redisKey.currentNumber(activeName));
        const totalRound = await redis.get(redisKey.totalNumber(activeName));
        //
        if (current <= totalRound) {
            code = await redis.rpop(redisKey.lotteryPool(activeName, current));
        }
    }
    mock.code = code;
    mock.currentNumber = current;
    await redis.hmset(redisKey.payMemberInfo(activeName, userId), mock);
    return await redis.rpush(redisKey.participantsList(activeName, current), JSON.stringify(mock));
}

async function checkChoujiangResult(activeName, current) {
    const members = await redis.lrange(redisKey.participantsList(activeName, current), 0, -1);

    let total = 0;
    console.log(members.length)
    members.sort(function (memberStr1,memberStr2) {
        const member1 = JSON.parse(memberStr1);
        const member2 = JSON.parse(memberStr2);
        return member2.paidTime - member1.paidTime
    }).forEach((item,index) => {
        const member = JSON.parse(item);
        console.log( member.paidTime)
        if(index>=50){
            return false
        }


        const paidTime = new Date();
        member.paidTime && paidTime.setTime(member.paidTime);

        const dateNumber  = [util.addZero(paidTime.getHours()),
            util.addZero(paidTime.getMinutes()),
            util.addZero(paidTime.getSeconds()),
            util.addZero1000(paidTime.getMilliseconds())].join('')
        // console.log(member.paidTime,dateNumber)
        total += Number(dateNumber);
    });
    const result = total % 499 + 10001;

    const userid = await redis.hget(redisKey.codeBindUserid(activeName, current), result);

    const userInfo =await redis.hgetall(redisKey.payMemberInfo(activeName, userid));

    return {
        code: result,
        userId: userid,
        userInfo,
    };
}
exports.restart = restart;
exports.init = init;
exports.change = change;
exports.addBlack = addBlackList;
exports.mockPaied = paidCb;
exports.checkChoujiangResult = checkChoujiangResult;


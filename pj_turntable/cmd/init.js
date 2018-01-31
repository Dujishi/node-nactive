/**
 * 数据导入脚本， 包含电影票
const redis = require('./redis');
const tickets = require('./tickets');

const config = {
    ticket: tickets.length,
    insure: 710,
    wash_10: 80,
    wash_0: 10,
    gas_10: 10
};


function main() {
    let ticketIndex = 0; // 电影票索引
    const keys = Object.keys(config);
    const prizeList = [];

    keys.forEach((key) => {
        const len = config[key];
        for (let i = 0; i < len; i++) {
            if (key === 'ticket') {
                const ticketCode = tickets[ticketIndex];
                ticketIndex += 1;
                prizeList.push(`ticket|${ticketCode}`);
            } else {
                prizeList.push(key);
            }
        }
    });
    prizeList.sort(() => Math.random() - 0.5);
    // 测试环境不允许发送短信，为了验证短信接口
    // 插入一条电影票奖品记录
    prizeList.unshift('ticket|9982-572A-CE9C-XXXX,9987-08BF-4275-XXXX');
    function lpush() {
        const value = prizeList.pop();
        if (value) {
            console.log(`push: ${value}`);
            redis.lpush('node_turntable:prize', value, lpush);
        }
    }
    redis.set('node_turntable:start', '2017-01-06 00:00:00', () => {
        redis.set('node_turntable:end', '2017-01-10 23:59:59', () => {
            redis.del('node_turntable:prize', lpush);
        });
    });
}

main();
 */

const redis = require('@server/redis');
// const redis = require('./redis');

const config = {
    wzdb_0: 300, // 0元违章代办
    wash_0: 600, // 0元精致洗车
    wash_1: 90, // 0元欧式精洗
    wash_2: 10 // 0内室精洗
};


async function main() {
    // const keys = Object.keys(config);
    // const prizeList = [];

    // keys.forEach((key) => {
    //     const len = config[key];
    //     for (let i = 0; i < len; i++) {
    //         prizeList.push(key);
    //     }
    // });
    // prizeList.sort(() => Math.random() - 0.5);

    // function lpush() {
    //     const value = prizeList.pop();
    //     if (value) {
    //         console.log(`push: ${value}`);
    //         redis.lpush('node_turntable:prize', value, lpush);
    //     } else {
    //         console.log('数据导入成功');
    //         process.exit();
    //     }
    // }
    // const res = await redis.set('node_turntable:goodscodes', JSON.stringify({
    //     L2441955: 'S2441962',
    //     L2441957: 'S2441963',
    //     L2441956: 'S2441964',
    //     L2441959: 'S1060799',
    //     L2441958: 'S2441965',
    //     L2441960: 'S1070823',
    //     L2441961: 'S1070832',
    //     L2441944: 'S1070836'
    // }));
    // const res = await redis.set('node_turntable:goodscodes', JSON.stringify({
    //     L1080142: 'S693729',
    //     L1080143: 'S1080150',
    //     L1080144: 'S1080158',
    //     L1080145: 'S1070568',
    //     L1080146: 'S1070823',
    //     L1080149: 'S1060793',
    //     L1080147: 'S1070836',
    //     L1080148: 'S1060799'
    // }));
    // console.log(res);

    // const res1 = await redis.get('node_turntable:goodscodes');
    // console.log(JSON.parse(res1));

    // const res2 = await redis.set('node_turntable:start', '2017-09-12 00:00:00');
    // console.log(res2);
    // const res1 = await redis.set('node_turntable:end', '2017-09-30 23:59:59');
    // console.log(res1);

    const res = await redis.keys('node_turntable:recordsw:*');
    console.log(res);

    // 3698776, 'L2441955', '真皮座椅', 'sw', '2017-09-22 23:23;33', '13867468434'

    // const res = await redis.hmset('node_turntable:recordsw:3698776;L2441955', {
    //     paid: false
    // });

    // const res = await redis.set('node_turntable:sharenumber', 27986);
    // console.log(res);

    // redis['HMSET']('node_turntable:recordsw:3698776:L2441955', {
    //     paid: true
    // }, (err, ret) => {
    //     console.log(ret);
    // });
}

main();

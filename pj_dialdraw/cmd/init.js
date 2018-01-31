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
            redis.lpush('node_dialdraw:prize', value, lpush);
        }
    }
    redis.set('node_dialdraw:start', '2017-01-06 00:00:00', () => {
        redis.set('node_dialdraw:end', '2017-01-10 23:59:59', () => {
            redis.del('node_dialdraw:prize', lpush);
        });
    });
}

main();
 */

const redis = require('./redis');

const config = {
    wzdb_0: 300, // 0元违章代办
    wash_0: 600, // 0元精致洗车
    wash_1: 90, // 0元欧式精洗
    wash_2: 10  // 0内室精洗
};


function main() {
    const keys = Object.keys(config);
    const prizeList = [];

    keys.forEach((key) => {
        const len = config[key];
        for (let i = 0; i < len; i++) {
            prizeList.push(key);
        }
    });
    prizeList.sort(() => Math.random() - 0.5);

    function lpush() {
        const value = prizeList.pop();
        if (value) {
            console.log(`push: ${value}`);
            redis.lpush('node_dialdraw:prize', value, lpush);
        } else {
            console.log('数据导入成功');
            process.exit();
        }
    }
    redis.set('node_dialdraw:start', '2017-02-23 00:00:00', () => {
        redis.set('node_dialdraw:end', '2017-02-28 23:59:59', () => {
            redis.del('node_dialdraw:prize', lpush);
        });
    });
}

main();



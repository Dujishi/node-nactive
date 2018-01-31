const redis = require('@server/redis');
const soaApi = require('@server/soa-api');
const fs = require('fs');
const path = require('path');

async function main() {
    const res1 = await redis.keys('node_turntable:records:*');
    const arr = [];
    let str = '';
    const arr2 = [];

    res1.forEach(async (it) => {
        arr2.push(it.split(':')[2]);
        arr.push(redis.lrange(it, 0, -1));
    });
    const ret = await Promise.all(arr);

    // const arr3 = [];
    // arr2.forEach((it) => {
    //     arr3.push(soaApi('platform/userCenterService/getUserInfoById', it - 0, 1));
    // });

    // const ret4 = await Promise.all(arr3);
    const ret4 = [];

    const rsl = {};

    ret.forEach((it2, index) => {
        const userInfo = ret4[index] || { data: {} };
        it2.forEach((it3) => {
            const ob2 = JSON.parse(it3);
            const phone = ob2.phone ? ob2.phone : userInfo.data.phone;
            const userId = arr2[index];
            const date = ob2.date.split(' ')[0];
            let str1 = '';
            if (ob2.type === 'sw') {
                str1 = ',是';
            }
            const str = `${phone},${userId},${ob2.name},${ob2.date}${str1}\n`;
            if (rsl[date]) {
                if (rsl[date].users.indexOf(userId) === -1) {
                    rsl[date].users.push(userId);
                }
                rsl[date].infos.push({ date: ob2.date, str });
            } else {
                rsl[date] = { users: [userId], infos: [{ date: ob2.date, str }] };
            }
        });
    });

    let keys = Object.keys(rsl);
    let str1 = '';
    keys = keys.sort((a, b) => a > b ? -1 : 1);
    for (let i = 0; i < keys.length; i++) {
        const rsArr = rsl[keys[i]];
        str1 += `${keys[i]},${rsArr.users.length},${rsArr.infos.length}\n`;
        rsArr.infos = rsArr.infos.sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));
        rsArr.infos.forEach((it4) => {
            str += it4.str;
        });
    }
    str = `手机号,用户ID,奖品,时间,是否为实物\n${str}`;
    str1 = `日期,抽奖人数,抽奖次数\n${str1}`;

    fs.writeFileSync(path.join(__dirname, './prize.csv'), str);
    fs.writeFileSync(path.join(__dirname, './total.csv'), str1);
    process.exit(0);
}

main();

const redis = require('@server/redis');
const soaApi = require('@server/soa-api');
const fs = require('fs');
const path = require('path');

function getUserInfo(userId) {
    return soaApi('platform/userCenterService/getUserInfoById', userId - 0, 1);
}

async function main() {
    const keys = await redis.keys('node_double11:sign*');
    const phoneRes = [];
    keys.forEach((it) => {
        const strs = it.split(':');
        phoneRes.push(getUserInfo(strs[2]));
    });

    const data = await Promise.all(phoneRes);

    const phones = [];
    data.forEach((it2) => {
        phones.push(`${it2.data.phone},\n`);
    });

    fs.writeFileSync(path.join(__dirname, './phones.csv'), phones.join(''));
    console.log('完成！');
}

main();

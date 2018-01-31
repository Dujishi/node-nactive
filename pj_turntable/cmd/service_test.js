const redis = require('../services/redis');
const serviceUtil = require('../services/utils');

async function testAddUserPreDayTimes() {
    const res = await redis.addUserPreDayTimes(1, null, 1);
    console.log(res);
}

async function getUserPreDayTimes() {
    const res = await redis.getUserPreDayTimes(1);
    console.log(res);
}

async function main() {
    // testAddUserPreDayTimes();

    // getUserPreDayTimes();

    // for (let i = 0; i < 100; i++) {
    //     console.log(serviceUtil.chance());
    // }

    // await redis.recordPrizeInfo(3698776, 'L2441955', '真皮座椅', 'sw', '2017-09-22 23:23;33', '13867468434');
    // const res = await redis.getSwPrizeList();
    // console.log(res);

    // await redis.updatePaid(3698776, 'L2441955');
    // console.log(await redis.checkPrizeGoodsByUser(3698776));

    // const data = ['13065748062', '15958182337', '13920583723', '13083977265', '15160077434', '18605711859', '13916171219'];
    // const data = ['13867468434'];
    // data.forEach(async (item) => {
    //     const res = await serviceUtil.sendMessage(item, 'tibao引擎清洗油');
    //     console.log(res);
    // });

    // const res = await redis.checkPaid(1, 'dafasdf');
    // const res1 = await serviceUtil.getPrize(1, 1);
    // console.log(res1);
    // const res = await serviceUtil.getPrizeRecordList(1);
    // console.log(res);
    // const res = await redis.getSwPrizeList();
    // console.log(res);

    process.exit(0);
}

main();

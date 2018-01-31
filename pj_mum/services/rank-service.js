const soaApi = require('@server/soa-api');

module.exports = async function (code) {
    const soaResp = await soaApi('marketing-core/playMumActivityService/getMumGoodsBonusRanking', code);
    // const soaResp = {
    //     success: true,
    //     data: [
    //         { index: 1, phoneNum: '101****0001', amount: 100 },
    //         { index: 2, phoneNum: '101****0002', amount: 90 },
    //         { index: 3, phoneNum: '101****0003', amount: 80 },
    //         { index: 4, phoneNum: '101****0004', amount: 70 },
    //         { index: 5, phoneNum: '101****0005', amount: 60 },
    //     ]
    // };
    return soaResp;
};

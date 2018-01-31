const soaApi = require('@server/soa-api');

module.exports = async function (userId) {
    const soaResp = await soaApi('marketing-core/playMumActivityService/getMumActivityBonus', userId, '');
    // const soaResp = {
    //     success: true,
    //     data: [
    //         {
    //             bonusId: 1,
    //             remainTime: 10 * 60 * 60 * 1000,
    //             amount: 50,
    //             goodsCode: 'code1',
    //         },
    //         {
    //             bonusId: 2,
    //             remainTime: 10 * 60 * 60 * 1000,
    //             amount: 60,
    //             goodsCode: 'code2',
    //         },
    //     ]
    // };

    return soaResp;
};

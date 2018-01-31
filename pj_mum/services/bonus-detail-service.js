const soaApi = require('@server/soa-api');

module.exports = async function (bonusId) {
    // const soaResp = await soaApi('marketing-core/playMumActivityService/getMumActivityBonus', userId, code);
    const soaResp = await soaApi('marketing-core/playMumActivityService/getBonusById', bonusId);
    // const soaResp = {
    //     success: true,
    //     data: {
    //         bonusId: 1,
    //         amount: 50,
    //         goodsCode: code,
    //         userId,
    //         remainTime: 10 * 60 * 60 * 1000,
    //     }
    // };

    return soaResp;
};

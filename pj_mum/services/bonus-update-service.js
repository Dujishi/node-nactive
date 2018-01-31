const soaApi = require('@server/soa-api');

module.exports = async function (bonusId, amount) {
    const soaResp = await soaApi('marketing-core/playMumActivityService/raiseMumActivityBonusAmount', bonusId, amount);
    // const soaResp = {
    //     success: true,
    //     data: {
    //         bonusId: 1,
    //         time: 10 * 60 * 60 * 1000,
    //         amount: 50,
    //     }
    // };

    return soaResp;
};

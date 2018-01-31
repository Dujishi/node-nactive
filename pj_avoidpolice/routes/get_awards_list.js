const utils = require('../utils');

exports.post = async function (ctx) {
    const rankId = utils.getPrevRankId();
    // const rankId = utils.getRankId();
    const rankList = utils.getRank(rankId);

    const total = await rankList.getTotal();
    const data = await rankList.getData(1);
    let awardsList = data.filter((v, i) => i < 5);
    awardsList = utils.formatScore(awardsList, rankId);

    ctx.body = {
        success: true,
        data: {
            total,
            awardsList
        }
    };
};

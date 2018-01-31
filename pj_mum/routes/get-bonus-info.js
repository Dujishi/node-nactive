const bonusDetailService = require('../services/bonus-detail-service');
const friendsService = require('../services/friends-service');

exports.post = async function (ctx) {
    const body = ctx.request.body;
    const bonusId = body.bonusId;
    const userId = ctx.session.userId;

    const discountInfoResp = await bonusDetailService(bonusId);

    if (!discountInfoResp.success) {
        ctx.body = discountInfoResp;
        return;
    }

    const discountInfo = discountInfoResp.data;
    let isSelf = false;

    // 判断是否是自己的红包
    if (discountInfo && discountInfo.userId == userId) {
        isSelf = true;
    }

    const friendsInfo = await friendsService(bonusId);

    let hasHelp = false;

    if (friendsInfo && friendsInfo.length > 0) {
        friendsInfo.forEach((v) => {
            if (v.userId == userId) {
                hasHelp = true;
            }
        });
    }

    ctx.body = {
        success: true,
        data: {
            friendsInfo,
            discountInfo,
            isSelf,
            hasHelp,
        }
    };
};

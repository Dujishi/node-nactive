const validation = require('@util/validation');
const goodsService = require('../services/goods-service');
const bonusDetailService = require('../services/bonus-detail-service');
const friendsService = require('../services/friends-service');
const rankService = require('../services/rank-service');
const response = require('@util/response-json')

exports.post = async function (ctx) {
    const body = ctx.request.body;
    const code = body.code;
    const bonusId = body.bonusId;
    const userId = ctx.session.userId;

    const goodsInfo = await goodsService(code);
    const discountInfo = await bonusDetailService(bonusId);
    const friendsInfo = await friendsService(bonusId);
    const rankInfoResp = await rankService(code);

    if (!discountInfo.success) {
        ctx.body = discountInfo;
        return;
    }

    if (!rankInfoResp.success) {
        ctx.body = rankInfoResp;
        return;
    }

    let rankInfo = rankInfoResp.data;

    if (rankInfo && rankInfo.length > 0) {
        rankInfo = rankInfo.map((v) => {
            v.phoneNum = `${v.phoneNum.substr(0, 3)}****${v.phoneNum.substr(7)}`;
            return v;
        });
    }

    ctx.body = {
        success: true,
        data: {
            goodsInfo,
            discountInfo: discountInfo.data,
            friendsInfo,
            rankInfo,
        }
    };
};

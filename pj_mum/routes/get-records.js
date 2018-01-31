const validation = require('@util/validation');
const bonusListService = require('../services/bonus-list-service');
const goodsListService = require('../services/goods-list-service');
const response = require('@util/response-json');

exports.post = async function (ctx) {
    const userId = ctx.session.userId;

    const bonusListResp = await bonusListService(userId);

    if (!bonusListResp.success) {
        ctx.body = bonusListResp;
        return;
    }

    const goodsList = await goodsListService();
    const bonusList = bonusListResp.data || [];
    const recordsList = [];

    goodsList.forEach((v, i) => {
        let flag = false;
        bonusList.forEach((v1) => {
            if (v1.goodsCode === v.code) {
                flag = true;
                recordsList.push({
                    goodsInfo: v,
                    bonusInfo: v1,
                });
            }
        });
        if (flag) {
            goodsList[i].isGetted = true;
        }
    });

    ctx.body = {
        success: true,
        data: {
            recordsList,
            goodsList,
        }
    };
};

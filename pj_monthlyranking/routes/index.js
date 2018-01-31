const soaApi = require('@server/soa-api');


exports.get = async function(ctx) {
    const shopId = ctx.query.shopId || '';
    await ctx.render('/pj_monthlyranking/views/index', {
        shopId
    });
};

exports.post = async function(ctx) {
    let body = ctx.request.body;
    let shopId = body.shopId;
    let soaRet = await soaApi(
        'car/tradeInfoQuerySoaService/queryPurchaseAmountRankingData',
        shopId
    );

    ctx.body = soaRet;
};

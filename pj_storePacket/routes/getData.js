const soaApi = require('@server/soa-api');

exports.post = async function(ctx) {
    const body = ctx.request.body;
    console.log(body);
    const userId = Number(body.shopId);
    const exchangeId = Number(body.exchangeId);

    const res = await soaApi('marketing-core/exchangeActivityService/getActivityGMById', userId, exchangeId);

    console.log(res);

    ctx.body = res;
};

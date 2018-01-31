const soaApi = require('@server/soa-api');

exports.post = async function (ctx) {
    const body = ctx.request.body;
    const userId = body.userId;
    const soaResp = await soaApi('car/smActivityService/getExchangeRecord', userId);
    ctx.body = soaResp;
};

const soaApi = require('@server/soa-api');

exports.post = async function(ctx) {
    const body = ctx.request.body;
    const userId = 	Number(body.id);
    const exchangeId = Number(body.exchangeId);
    const phone = null;

    const res = await soaApi('marketing-core/exchangeActivityService/exchangeById', userId, phone, exchangeId);

    ctx.body = res;
};

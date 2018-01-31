const soaApi = require('@server/soa-api');

exports.get = async function(ctx) {
    ctx.body = await soaApi('platform/locationService/getById', 1);
}
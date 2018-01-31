const soaApi = require('@server/soa-api');

exports.post = async function (ctx) {
    const body = ctx.request.body;
    const lon = body.lon;
    const lat = body.lat;

    const soaResult = await soaApi('platform/locationService/getAddress', lat, lon);
    ctx.body = soaResult;
    console.log(JSON.stringify(soaResult));
};

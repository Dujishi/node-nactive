const soaApi = require('@server/soa-api');

exports.post = async function (ctx) {
    const body = ctx.request.body;
    const lng = body.lng;
    const lat = body.lat;

    const soaResult = await soaApi('platform/locationService/getAddress', lat, lng);
    ctx.body = soaResult;
    console.log(JSON.stringify(soaResult));
};

const soaApi = require('@server/soa-api');

// 获取地理位置
exports.post = async function (ctx) {
    const body = ctx.request.body;
    const lng = body.lng;
    const lat = body.lat;

    const soaResult = await soaApi('platform/locationService/getAddress', lat, lng);
    ctx.body = soaResult;
};

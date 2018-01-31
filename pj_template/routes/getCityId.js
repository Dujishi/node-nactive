const soaModel = require('@server/model-soaapi');
const response = require('@util/response-json');
const config = require('@server/config')
const client = require('@server/http-client');

const phoHost = config.get('illegalPhpHost')
/**
 * 根据经纬度获取地理位置
 * @param ctx
 */
exports.get = async function (ctx) {
    const query = ctx.query;
    const lat = query.lat;
    const lng = query.lng;
    const needSn = query.sn; // 是否需要车牌号
    if (lat && lng) {
        const result = await soaModel.platform.locationService.getAddress(lat, lng);
        console.log(result);
        ctx.body = result;
        return;
    }
    ctx.body = response.json_err('经纬度不能为空', 4001);
};
const soaApi = require('@server/soa-api');
const config = require('../../config');

config.env === 'dev' && soaApi.use(config.soaHost, {
    // xkzone: 'ndsm.2.1'
    xkzone: ''
});

exports.post = async function (ctx) {
    const body = ctx.request.body;
    const commodityCodes = body.commodityCodes.split(',');

    const soaResult = await soaApi('ndsm/purchaseCommoditySoaService/selectByCommodityCodeList', commodityCodes);
    ctx.body = soaResult;
};

/**
 * @description
 * @author  yinshi
 * @date 16/12/13.
 */

const validation = require("@util/validation");
const wantedService = require('../service/wantedService');
exports.post = async function (ctx) {
    const body = ctx.request.body;
    const isApp = validation.isApp(ctx.headers);
    const data = {
        userId: isApp?body.userId : ctx.session.userId,
        userName: body.userName,
        phone: body.phone,
        city: body.city,
        modelName: body.modelName,
        modelId: body.modelId,
        seriesName: body.seriesName,
        seriesId: body.seriesId,
        brandId: body.brandId,
        brandName: body.brandName
    };
    ctx.body = await wantedService(data);
}
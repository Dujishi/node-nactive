/**
 * @description 预购下单接口
 * @author  yinshi
 * @date 16/12/12.
 */
const validation = require("@util/validation");
const prepayService = require('../service/prepayService');

exports.post = async function (ctx) {
    const body = ctx.request.body;
    const isApp = validation.isApp(ctx.headers);
    const userId = isApp ? ctx.request.body.userId : ctx.session.userId;
    const lat = body.lat || ctx.session.latitude;
    const lng = body.lng || ctx.session.longitude;
    const  uri = ctx.origin + '/nactive/newcar/index';
    ctx.body = await prepayService(userId,body.goodsCode,lat,lng,uri);
}
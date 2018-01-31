/**
 * @description 预约接口
 * @author  yinshi
 * @date 16/12/8.
 */

const validation = require("@util/validation");
const orderService = require('../service/orderService');

exports.post = async function (ctx) {
    const body = ctx.request.body;
    const isApp = validation.isApp(ctx.headers);
    const  userId = isApp ? ctx.request.body.userId : ctx.session.userId;

    ctx.body = await orderService(userId,body.userName,body.phone,body.city,body.goodsCode,body.goodsName);
}
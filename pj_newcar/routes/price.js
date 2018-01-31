/**
 * @description 获取预订金价格的接口
 * @author  yinshi
 * @date 16/12/12.
 */

const priceService = require('../service/priceService');
const validation = require('@util/validation');

exports.get = async function (ctx) {
    const query = ctx.query;
    const goodsCode = query.goodsCode;
    const isApp = validation.isApp(ctx.headers);
    const userId = isApp ? query.userId : ctx.session.userId;

    ctx.body = await priceService(userId,goodsCode);
}
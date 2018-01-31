/**
 * @description
 * @author  yinshi
 * @date 17/6/9.
 */

const response = require('@util/response-json');
const soaApi = require('@server/soa-api');
const validation = require('@util/validation');
const service = require('../service');

exports.get = async function (ctx) {
    const orderId = ctx.query.orderId;
    const card = ctx.session.spdbCard;
    const queryCard = ctx.query.card;
    const userId = ctx.session.userId;
    // 如果session里面的card和参数里面的card不一致，说明被篡改了，不通过。
    // if(!orderId || queryCard != card){
    //     ctx.redirect('/nactive/cooperation/pay');
    //     return
    // }
    const unionid = ctx.session.unionid;
    console.log(`unionid===>${unionid}`);
    if (!unionid) {
        await ctx.render('/views/error', {
            message: '只能在微信中访问'
        });
        return;
    }
    const result = await service.pay(orderId, userId, queryCard);
    if (result.success === false) {
        await ctx.render('/views/error', {
            message: result.message
        });
        return;
    }
    ctx.body = result.data.prepayDto.resp.submitFormHtml;
}
;

/**
 * @description
 * @author  yinshi
 * @date 17/6/1.
 */
const response = require('@util/response-json')
const goods = require('../config').goods
const soaApi = require('@server/soa-api')
exports.post = async function (ctx) {
    const userId = ctx.session.userId;
    const goodsId = ctx.request.body.couponId;
    const yb = Number(ctx.request.body.yb);
    console.log(goodsId)
    const couponId = goods[goodsId];
    if(!couponId){
        ctx.body = response.json_err('商品id不正确', 40001);
        return
    }
    if(isNaN(yb)){
        ctx.body = response.json_err('请选择是否需要医保', 40002);
        return
    }
    const result = await soaApi('online-soa/tianjinTaxiInspectionSoaService/getTickets', {
        userId,
        couponId,
        needCarInsurance: Boolean(yb)
    });
    console.log(result);
    ctx.body = result;
}
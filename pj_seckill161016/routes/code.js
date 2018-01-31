/**
 * @description 发送验证码
 * @author  yinshi
 * @date 16/10/17.
 */

const codeService= require('../service/codeService');

exports.get =async function (ctx,next) {

    ctx.body=await codeService(ctx.query.phone,0);
};
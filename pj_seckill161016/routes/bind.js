/**
 * @description 绑定手机号
 * @author  yinshi
 * @date 16/10/17.
 */

const bindService= require('../service/bindService')

exports.post = async function (ctx,next) {
    const body= ctx.request.body;

    ctx.body=await bindService(ctx,body.phone,body.openId,body.code);
} ;
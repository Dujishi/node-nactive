/**
 * @description 处理秒杀结果函数
 * @author  yinshi
 * @date 16/10/17.
 */


const libUtils = require('../utils');
const  seckillService= require('../service/seckillService');
exports.post=async function (ctx, next) {
    const body=ctx.request.body;
    // const isapp = libUtils.isapp(ctx.headers);
    const iswechat = libUtils.iswechat(ctx.headers);
    // const  userId= libUtils.isapp(ctx.headers)?body.userId : '';
    let userId = null;
    if (body.userId - 0 > 0) {
        userId = body.userId;
        if (!ctx.session.userId) {
            ctx.session.userId = userId;
        }
    } else if (ctx.session.userId - 0 > 0 && iswechat) {
        userId = ctx.session.userId;
    }

    ctx.body= await seckillService(body.type,body.openId,userId);

};

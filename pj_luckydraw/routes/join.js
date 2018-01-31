/**
 * @description
 * @author  yinshi
 * @date 16/11/24.
 */


const joinService = require('../service/joinIn');


exports.post = async function (ctx, next) {
    ctx.body = await joinService(ctx);
};

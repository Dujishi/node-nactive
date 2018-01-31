/**
 * @description
 * @author  yinshi
 * @date 16/11/26.
 */


const winnerListService = require('../service/getWinnerInfo');
// 去掉userid
// const validation = require('@util/validation');
exports.post = async function (ctx) {
    const body = ctx.request.body;
    // const userId = validation.isApp(ctx.headers) ?
    // body.userId || ctx.headers.userId :
    //     ctx.session.userId;

    const activeName = body.type || 'cmb161201';
    ctx.body = await winnerListService( activeName);
};

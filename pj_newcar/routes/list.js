/**
 * @description
 * @author  yinshi
 * @date 16/12/12.
 */


const validation = require("@util/validation");
const listService = require('../service/listService');

exports.get = async function (ctx) {

    const isApp =   validation.isApp(ctx.headers);
    const  userId = isApp ? ctx.query.userId : ctx.session.userId;

    ctx.body = await listService(userId);
}
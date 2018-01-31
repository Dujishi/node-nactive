/**
 * @description
 * @author  yinshi
 * @date 16/11/26.
 */

const memberService = require('../service/getMemberList');
const validation = require('@util/validation');
exports.post = async function (ctx) {
    const isApp = validation.isApp(ctx.headers);
    const body = ctx.request.body;
    const userId = isApp ? (body.userId || ctx.headers.userId) :
        ctx.session.userId;
    const activeName = ctx.query.type || 'cmb161201';

    const timeStamp = body.timeStamp || 0
    const pageSize = body.pageSize || 30
    ctx.body = await memberService(userId, activeName, Number(timeStamp), pageSize);
};

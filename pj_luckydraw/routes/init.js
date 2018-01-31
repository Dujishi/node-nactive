const validation = require('@util/validation');

const getActiveInfo = require('../service/getActiveInfo');
exports.post = async function (ctx, next) {
  // luckDraw:cmb161201:codeBindUserid:${N}
    const body = ctx.request.body;
    const userId = validation.isApp(ctx.headers) ? (body.userId || ctx.headers.userId) :
        ctx.session.userId;
    const activeName = body.type || 'cmb161201';

    ctx.body = await getActiveInfo(userId, activeName);
};

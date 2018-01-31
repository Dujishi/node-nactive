exports.get = async function(ctx) {
    await ctx.render('/views/error', {
        errCode: 404,
        message: '活动已结束' || ctx.query.message,
    });
};

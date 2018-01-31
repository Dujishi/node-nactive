
exports.get = async function (ctx, next) {
    const isapp = validation.isApp(ctx.headers);

    await ctx.render('/pj_luckydraw/views/result', {
        isapp,
    });
};

exports.get = async function(ctx, next) {
    await ctx.render('/views/error', {
        message: '活动尚未开始 </br> or 已经结束'
    });
    return;
}
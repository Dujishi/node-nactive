const validation = require('@util/validation');

const shareConfig = require('../config/share');
exports.get = async function (ctx, next) {
    const isapp = validation.isApp(ctx.headers);

    shareConfig.shareUrl = `${ctx.origin}/nactive/luckydraw/index`;
    await ctx.render('/pj_luckydraw/views/about', Object.assign({
        isapp,
    }, shareConfig));
};

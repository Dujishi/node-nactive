const wechatApi = require('@server/wechat');
const validation = require('@util/validation');
const getFullUrl = require('../../lib/utils/get_full_url');

const project = 'newyear20170122';

exports.get = async function(ctx, next) {
    const iswechat = validation.isWechat(ctx.headers);
    const isapp = validation.isApp(ctx.headers);
    const url = getFullUrl(ctx); // 当前页面完整地址
    let wechat = {};

    // if (!iswechat && !isapp) {
    //     ctx.redirect('http://dl.ddyc.com');
    //     return;
    // }

    if (iswechat) {
        wechat = await wechatApi.getJsConfig(url);
    }

    const data = {
        isapp,
        iswechat,
        wechat,
        shareUrl: url
    };

    await ctx.render(`/pj_${project}/views/index`, data);
};


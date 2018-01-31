const wechatApi = require('@server/wechat');
const validation = require('@util/validation');
const getFullUrl = require('../../lib/utils/get_full_url');
const util = require('../util');
const config = require('../../config');

exports.get = async function(ctx) {
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
    const phone = ctx.session.bjbankPhone;
    let beginTime = '';
    let endTime = '';
    let count = 0;
    if (phone) {
        const resCoupons = await util.getCoupons(phone);
        if (resCoupons.success) {
            const coupons = resCoupons.data;
            beginTime = coupons.beginTime;
            endTime = coupons.endTime;
            count = coupons.count;
        }
    }
    let washUrl = 'http://dev-mp.ddyc.com/?appid=wx325a2023a238e862';
    if (config.env === 'prod') {
        washUrl = 'https://m.ddyc.com/wechat/index.php/Wash/menu.shtml?f=x';
    }
    const data = {
        isapp,
        iswechat,
        wechat,
        shareUrl: url,
        isLogin: !!phone,
        beginTime,
        endTime,
        count,
        washUrl,
    };

    await ctx.render('/pj_bjbank/views/index', data);
};


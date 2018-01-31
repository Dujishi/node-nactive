const soaApi = require('@server/soa-api');
const wechatApi = require('@server/wechat');
const validation = require('@util/validation');
const getFullUrl = require('../../lib/utils/get_full_url');
const customConfig = require('../config');

exports.get = async function(ctx) {
    const isapp = validation.isApp(ctx.headers);
    const iswechat = validation.isWechat(ctx.headers);
    const userId = ctx.session.userId || '';
    let jssdkConfig = {};

    // 获取微信信息
    if (iswechat) {
        // const redirectUrl = ctx.origin + ctx.path;
        jssdkConfig = await wechatApi.getJsConfig(getFullUrl(ctx));
    }


    const soaRes = await soaApi('car/generalMonthActivitySoaService/getSkuActivity', customConfig.activityId, userId);

    console.log('========= getSkuActivity =========');
    console.log(JSON.stringify(soaRes));

    // const soaRes = require('../mock/getSkuActivity');
    let activityConfig = '';
    if (soaRes.success) {
        activityConfig = soaRes.data;
        if (Number(activityConfig.status.type) === 0) {
            await ctx.render('/views/error', {
                message: '活动已结束'
            });
            return;
        }
    } else {
        await ctx.render('/views/error', {
            message: '活动配置错误'
        });
        return;
    }

    // 渲染页面
    await ctx.render('/pj_anxiang/views/index', {
        isapp,
        iswechat,
        shareUrl: `${ctx.origin}/nactive/anxiang/index`,
        wechat: jssdkConfig,
        activityConfig,
        storeList: customConfig.storeList,
        activityTitle: customConfig.activityTitle,
        isLogin: Number(userId) > 0,
    });
};

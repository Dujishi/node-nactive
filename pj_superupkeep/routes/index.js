const soaApi = require('@server/soa-api');
const wechatApi = require('@server/wechat');
const validation = require('@util/validation');
const envConfig = require('../../config');

let activityId;

exports.get = async function (ctx) {
    const isApp = validation.isApp(ctx.headers);
    const isWechat = validation.isWechat(ctx.headers);
    activityId = ctx.request.query.activeId;
    let jssdkConfig = {};

    let openId = '';
    let activityStatus = 1;
    let remainSecs;
    const shareText = {
        shareTitle: '车主福利来咯！赠送最高价值3000+养车服务',
        shareContent: '典典最新推出独家保养智能适配方案，让爱车保养更省心、安心、放心。',
        shareSubTitle: '典典最新推出独家保养智能适配方案，让爱车保养更省心、安心、放心。',
    };

    if (isWechat) {
        jssdkConfig = await wechatApi.getJsConfig(ctx.href);
    }
    if (isWechat && ctx.session.openid) {
        openId = ctx.session.openid;
    }

    const userId = isApp ? ctx.headers.userid : ctx.session.userId;
    const statusResp = await soaApi('car/smActivityService/getActivityStatus', activityId);

    if (statusResp.success) {
        activityStatus = statusResp.data.status;
        remainSecs = statusResp.data.remainSecs;
    }

    if (activityStatus == 0) {
        // 活动结束
        await ctx.render('/views/error', {
            errCode: 404,
            title: '超级保养',
            message: '活动已结束咯，下次早点来吧~',
        });
        return;
    }
    if (activityStatus == -1) {
        // 活动结束
        await ctx.render('/views/error', {
            errCode: 404,
            title: '超级保养',
            message: '活动尚未开始，等待吧~',
        });
        return;
    }

    const shareUrl = `${ctx.origin}/nactive/superupkeep/index?activeId=${activityId}`;

    const data = {
        iswechat: isWechat,
        isapp: isApp,
        openid: openId,
        wechat: jssdkConfig,
        shareUrl,
        shareTitle: shareText.shareTitle,
        shareSubTitle: shareText.shareSubTitle,
        shareContent: shareText.shareContent,
        userId,
        isDebug: !(envConfig.env === 'prod'),
        status: activityStatus,
        remainSecs,
    };
    await ctx.render('/pj_superupkeep/views/index', data);
};

exports.post = async function (ctx) {
    const body = ctx.request.body;
    const userId = body.userId || ctx.session.userId;
    const cityId = body.cityId;
    activityId = body.activeId;
    const soaResp = await soaApi('car/smActivityService/getActivityAll', userId, cityId, activityId);
    ctx.body = soaResp;
};

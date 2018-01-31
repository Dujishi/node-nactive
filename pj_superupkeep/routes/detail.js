const wechatApi = require('@server/wechat');
const validation = require('@util/validation');
const soaApi = require('@server/soa-api');

exports.get = async function (ctx) {
    const isApp = validation.isApp(ctx.headers);
    const isWechat = validation.isWechat(ctx.headers);
    const activityId = ctx.request.query.activeId;
    let wechatShare;
    let activityStatus;
    const shareUrl = `${ctx.origin}/nactive/superupkeep/index?activeId=${activityId}`;
    let userId = ctx.session.userId ||'';

    const shareText = {
        shareTitle: '车主福利来咯！赠送最高价值3000+礼包',
        shareContent: '典典最新推出独家保养智能适配方案，让爱车保养更省心、安心、放心。',
        shareSubTitle: '典典最新推出独家保养智能适配方案，让爱车保养更省心、安心、放心。',
    };

    if (isWechat) {
        wechatShare = await wechatApi.getJsConfig(ctx.href);
    }

    const statusResp = await soaApi('car/smActivityService/getActivityStatus', activityId);

    if (statusResp.success) {
        activityStatus = statusResp.data.status;
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


    const data = {
        iswechat: isWechat,
        isapp: isApp,
        wechat: wechatShare,
        shareUrl,
        shareTitle: shareText.shareTitle,
        shareSubTitle: shareText.shareSubTitle,
        shareContent: shareText.shareContent,
    };
    await ctx.render('/pj_superupkeep/views/detail.html', data);
};


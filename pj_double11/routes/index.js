const wechatApi = require('@server/wechat');
const validation = require('@util/validation');
const shareConfig = require('../config/share');
const getFullUrl = require('../../lib/utils/get_full_url');
const redisService = require('../service//redis');
const idsConfig = require('../config/ids');

/**
 * 判断时间
 */
const timeLimit = async () => {
    const washEndDate = '2017-11-11 23:59:59';
    const activeEndDate = '2017-11-17 23:59:59';
    const washEndTime = new Date(washEndDate).getTime();
    const activeEndTime = new Date(activeEndDate).getTime();
    const normalDate = await redisService.getNormalTime() || '2017-11-11 00:00:00';
    const now = Date.now();
    const normalTime = new Date(normalDate).getTime();
    if (now < normalTime) {
        return 'pre';
    } else if (now > washEndTime && now < activeEndTime) {
        return 'washEnd';
    }

    if (now > activeEndTime) {
        return 'activeEnd';
    }
    return 'mainRoom';
};

/**
 *  双十一入口
 */
exports.get = async (ctx) => {
    // 验证app
    const isapp = validation.isApp(ctx.headers);
    const iswechat = validation.isWechat(ctx.headers);
    const url = getFullUrl(ctx);

    // 如果有userId
    if (ctx.query.userId) {
        ctx.session.userId = ctx.query.userId - 0;
    }

    // 阶段 默认预热
    let stage = await timeLimit();
    const washStatus = stage;

    if (stage === 'washEnd') {
        stage = 'mainRoom';
    }

    if (stage === 'activeEnd') {
        await ctx.render('/views/error', {
            message: '活动已经结束啦~'
        });
        return;
    }

    console.log(`==================${stage}`);

    let data = {
        isapp,
        iswechat,
        washStatus,
        shareData: Object.assign({
            shareUrl: url
        }, shareConfig[stage]),
    };


    // 是否已报名
    if (ctx.session.userId && stage === 'pre') {
        const isExist = await redisService.queryRecord(ctx.session.userId);
        data.isExist = !!isExist;
    }


    if (iswechat) {
        const wechat = await wechatApi.getJsConfig(url);
        data = Object.assign(data, {
            wechat
        });
    }

    if (process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'pre') {
        data = Object.assign(data, idsConfig.prod);
    } else {
        data = Object.assign(data, idsConfig.test);
    }


    await ctx.render(`/pj_double11/views/${stage}`, data);
};

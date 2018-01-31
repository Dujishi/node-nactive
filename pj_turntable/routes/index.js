/*
 * @Author: Yard
 * @Date: 2016-12-21 17:11:50
 * @Last Modified by: Yard
 * @Last Modified time: 2017-02-21 11:17:17
 */
const wechatApi = require('@server/wechat');
const validation = require('@util/validation');
const getFullUrl = require('../../lib/utils/get_full_url');
const servicesUtil = require('../services/utils');
const redis = require('../services/redis');

// 获取随机手机号和奖品
const getNumber = () => {
    const numberRandom = () => Math.floor(Math.random() * 10);
    const two = () => {
        const random = Math.random();
        let number;
        if (random < 0.333) {
            number = '3';
        } else if (random > 0.667) {
            number = '5';
        } else {
            number = '8';
        }
        return number;
    };
    const present = () => {
        const random = Math.random();
        let number;
        if (random < 0.1) {
            number = '10元路飞燃油宝红包';
        } else if (random > 0.2 && random < 0.4) {
            number = '20元德国清洗油红包';
        } else if (random > 0.4 && random < 0.6) {
            number = '20元德国轮胎红包';
        } else if (random > 0.6 && random < 0.8) {
            number = '20元机油保养红包';
        } else {
            number = '神秘红包';
        }
        return number;
    };

    return `1${two()}${numberRandom()}****${numberRandom()}${numberRandom()}${numberRandom()}${numberRandom()}获得${present()}`;
};

/**
 * 获取总机会
 * @param {Number} userId
 */
const setTimes = async (userId, isApp) => {
    const dayInfo = await redis.getUserPreDayTimes(userId);
    console.log('dayInfo===>', JSON.stringify(dayInfo));
    if (!dayInfo || (dayInfo && !dayInfo.free)) { // 免费未使用
        // 增加免费机会
        await servicesUtil.updateTimes(userId, 1);
        await redis.addUserPreDayTimes(userId, 1, null, null); // 更新当天记录
    }

    if (isApp) {
        if (!dayInfo || (dayInfo && !dayInfo.login)) { // 登录APP
            // 增加免费机会
            await servicesUtil.updateTimes(userId, 1);
            await redis.addUserPreDayTimes(userId, null, null, 1); // 更新当天记录
        }
    }
};

exports.get = async function(ctx) {
    const userId = ctx.session.userId || ctx.headers.userId || ctx.query.userId;
    if (!ctx.session.userId) {
        ctx.session.userId = ctx.headers.userId || ctx.query.userId;
    }

    const timeState = await servicesUtil.compareTime(new Date().getTime());
    if (timeState !== 0) {
        await ctx.render('/views/error', {
            message: '活动已结束'
        });
        return;
    }

    let jssdkConfig = {};
    const url = getFullUrl(ctx); // 当前页面完整地址
    const iswechat = validation.isWechat(ctx.headers);
    const isapp = validation.isApp(ctx.headers);
    if (iswechat) {
        jssdkConfig = await wechatApi.getJsConfig(url);
    }

    const numberArr = [];
    for (let i = 0; i < 20; i++) {
        numberArr.push(getNumber());
    }

    const swPrizeList = await redis.getSwPrizeList();
    if (swPrizeList && swPrizeList.length) {
        swPrizeList.forEach((it) => {
            if (it.phone.indexOf('1011') !== 0) {
                const phone = it.phone.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1****$3');
                numberArr.unshift(`${phone}获得${it.name}`);
            }
        });
    }

    // 分享数字
    const shareNumber = await redis.getShareNumber();

    // 如果用户已登录
    if (userId) {
        setTimes(userId, isapp);
    }


    await ctx.render('/pj_turntable/views/index', {
        isapp,
        iswechat,
        shareUrl: `${ctx.origin}/nactive/turntable/index`,
        wechat: jssdkConfig,
        number: numberArr,
        shareNumber
    });
};

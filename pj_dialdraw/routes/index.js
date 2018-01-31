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

// 获取随机手机号和奖品
const getNumber = () => {
    // function getRandomInt(min, max) {
    //     return Math.floor(Math.random() * (max - min + 1) + min);
    //     }
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
        if (random < 0.2) {
            number = '0元精致洗车券';
        } else if (random > 0.2 && random < 0.5) {
            number = '0元欧式精洗券';
        } else if (random > 0.5 && random < 0.7) {
            number = '0元内室清洗券';
        } else if (random > 0.7 && random < 0.8) {
            number = '0元违章代办券';
        } else if (random > 0.8 && random < 0.9) {
            number = '1000元加油充值卡';
        } else {
            number = '0元保养券';
        }
        return number;
    };

    return `1${two()}${numberRandom()}****${numberRandom()}${numberRandom()}${numberRandom()}${numberRandom()}获得${present()}`;
};

exports.get = async function(ctx) {
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
    if (iswechat) {
        jssdkConfig = await wechatApi.getJsConfig(url);
    }

    const numberArr = [];
    for (let i = 0; i < 20; i++) {
        numberArr.push(getNumber());
    }

    await ctx.render('/pj_dialdraw/views/index', {
        isapp: validation.isApp(ctx.headers),
        iswechat,
        shareUrl: `${ctx.origin}/nactive/dialdraw/index`,
        wechat: jssdkConfig,
        number: numberArr,
    });
};

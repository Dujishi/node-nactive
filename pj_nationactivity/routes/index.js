const wechatApi = require('@server/wechat');
const soaApi = require('@server/soa-api');
const validation = require('@util/validation');
const getFullUrl = require('../../lib/utils/get_full_url');
const httpClient = require('@server/http-client');
const config = require('../config');
const conf = require('../conf');

// 首页
exports.get = async function(ctx, next) {

    let iswechat = validation.isWechat(ctx.headers);
    let isapp = validation.isApp(ctx.headers);

    let startTimeStr = conf.startTime; //活动开始时间
    let startTimeStamp = (new Date(startTimeStr)).getTime(); //开始时间戳
    let endTimeStamp = (new Date(conf.endTime)).getTime(); //结束时间戳

    let nowTimeStamp = (new Date()).getTime(); //当前时间戳

    let openId = '';
    let wechat = {};
    if (iswechat) {
        let url = getFullUrl(ctx); // 当前页面完整地址

        let redirectUrl = ctx.origin + ctx.path;
        let token = await wechatApi.getOauthToken(ctx, redirectUrl);
        if (!token) { // redirect
            return;
        }
        openId = token.openid;
        wechat = await wechatApi.getJsConfig(url);

        //如果session里面没有用户，判断用户是否绑定
        if (!ctx.session.userId && iswechat) {
            //调用用户中心判断是否绑定
            const userInfo = await soaApi("platform/userWechatOpenIdSOAService/getUserId", openId);
            if (userInfo && userInfo.data > 0) {
                ctx.session.userId = userInfo.data; //放入session
            } else {
                console.log(userInfo);
            }
        }
        if (!ctx.session.openId) {
            ctx.session.openId = openId;
        }
    }

    let page = 'index';
    let shareIcon = 'https://store.ddyc.com/res/xkcdn/icons/share/icon_nationactivity.jpg';
    let shareTitle = '典典连锁周年庆，全场半价，“洗车+打蜡”低至29元，错过等一年';
    let shareContent = '11.19典典连锁周年庆，全场狂欢、赶紧来抢购';
    if ((startTimeStamp - nowTimeStamp) > 0) {
        page = 'pre';
        shareIcon = 'https://store.ddyc.com/res/xkcdn/icons/share/icon_nationactivity_pre.jpg';
    }

    let ticketTime = conf.ticketTime;
    let ticketTimeStartStamp = (new Date(ticketTime.start)).getTime(); //开始时间戳
    let ticketTimeEndStamp = (new Date(ticketTime.end)).getTime(); //开始时间戳
    let isTicketTime = false;
    if (nowTimeStamp >= ticketTimeStartStamp && nowTimeStamp <= ticketTimeEndStamp) {
        isTicketTime = true;
    }

    //如果结束现实活动已结束
    if (nowTimeStamp > endTimeStamp) {
        await ctx.render('/views/error', {
            errCode: 404,
            title: '1119典典连锁周年庆',
            message: '活动已结束咯，下次早点来吧~'
        });
        return;
    }

    let uriIndex = ctx.origin + '/nactive/' + conf.pjPath + '/index';

    let data = {
        isapp: isapp,
        isWechat: iswechat,
        wechat: wechat,
        openid: openId,
        payUrl: config.payHost + '/payaccount/jspcashier/pay',

        startTimeStr: startTimeStr,
        nowTimeStamp: nowTimeStamp,
        isTicketTime: isTicketTime,

        shareUrl: uriIndex,
        shareIcon: shareIcon,
        shareTitle: shareTitle,
        shareContent: shareContent

    };



    await ctx.render('/' + conf.pjName + '/views/' + page, data);
};

// 数据
exports.post = async function(ctx, next) {

    let iswechat = validation.isWechat(ctx.headers);
    let isapp = validation.isApp(ctx.headers);

    let body = ctx.request.body;
    let cityId = body.cityId;
    let lat = body.lat;
    let lng = body.lng;


    //如果body中有userId，首先获取body中，否则获取session中用户信息
    let userId = null;
    if (body.userId - 0 > 0) {
        userId = body.userId;
        if (!ctx.session.userId) {
            ctx.session.userId = userId;
        }
    } else if (ctx.session.userId - 0 > 0 && !isapp) {
        userId = ctx.session.userId;
    }


    console.log("lat:" + lat)
    console.log("lng:" + lng)
    console.log("城市ID-0:" + cityId)

    if (!cityId) {
        if (lat - 0 > 0 && lng - 0 > 0) {
            //如果传递了经纬度，先通过soa获取城市id，在加载数据
            let locationInfo = await soaApi("platform/locationService/getAddress", lat, lng);
            console.log(locationInfo);
            if (locationInfo.success && locationInfo.data && locationInfo.data.cityId > 0) {
                cityId = locationInfo.data.cityId;
            } else {
                ctx.body = {
                    success: false,
                    data: {},
                    msg: '请选择城市'
                }
                console.error(locationInfo);
                return;
            }
        } else {
            ctx.body = {
                success: false,
                data: {},
                msg: '请选择城市'
            }
            return;
        }
    }


    //调用商品信息
    console.log("城市ID-1:" + cityId)
    console.log("USERID:" + userId)
    if (!cityId) {
        ctx.body = {
            success: false,
            data: {},
            msg: '请选择城市'
        }
        return;
    }
    let pageInfo = await soaApi("car/anniversaryActivityService/getCouponsForApp", userId, cityId);

    //如果报错，打印日志
    if (!pageInfo.success) {
        console.error(pageInfo);
        ctx.body = {
            success: false,
            data: {
                'pageInfo': [],
                'userId': userId,
                'cityId': cityId
            },
            msg: pageInfo.message || pageInfo.msg
        }
        return;
    }

    ctx.body = {
        success: true,
        data: {
            'pageInfo': pageInfo.data || [],
            'userId': userId,
            'cityId': cityId
        },
        msg: ''
    }

};
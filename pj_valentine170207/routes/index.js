const soaApi = require('@server/soa-api');
const wechatApi = require('@server/wechat');
const validation = require('@util/validation');
const redis = require('@server/redis');
const response = require('@util/response-json');
const _ = require('lodash');
const getFullUrl = require('../../lib/utils/get_full_url');
const utils = require('../utils');
const config = require('../../config');
const getInitialData = require('../services/getInitialData');

exports.get = async function(ctx) {
    const url = getFullUrl(ctx); // 当前页面完整地址
    const iswechat = validation.isWechat(ctx.headers);
    const query = ctx.query;
    let openid = '';
    let jssdkConfig = {};
    let phone = null;
    let userInfo = {};

    // if (config.env !== 'dev' && !iswechat) {
    //     ctx.redirect('http://dl.ddyc.com');
    //     return;
    // }

    console.log('======== query ==========')
    console.log(query);

    if (config.env !== 'dev' && iswechat) {
        jssdkConfig = await wechatApi.getJsConfig(url);

        const redirectUrl = 'https://' + ctx.host + ctx.path;
        const token = await wechatApi.getOauthToken(ctx, redirectUrl, query, 'snsapi_userinfo');

        if (!token) { // redirect
            return;
        }

        openid = token.openid;

        // 判断用户信息是否存在
        if (await redis.isExist(utils.redisKey(`openid:${openid}`))) {
            userInfo = await redis.hgetall(utils.redisKey(`openid:${openid}`));
        } else {
            // 获取用户信息
            const oauth = wechatApi.getOauth();
            userInfo = await oauth.getUserInfo(token);

            if (userInfo) {
                await redis.hmset(utils.redisKey(`openid:${openid}`), {
                    headimgurl: userInfo.headimgurl || 'https://img01.yangchediandian.com/ycdd/h5/avatar_default.png',
                    nickname: userInfo.nickname,
                    openid,
                });
            }
        }
    }

    if (config.env === 'dev') {
        openid = 100001;

        if (await redis.isExist(utils.redisKey(`openid:${openid}`))) {
            userInfo = await redis.hgetall(utils.redisKey(`openid:${openid}`));
        } else {
            // 获取用户信息
            userInfo = {
                headimgurl: 'https://wx.qlogo.cn/mmhead/vPIORgnsM3aBDibELQBjMJ54d342Gh9FibiaS4GHELe5uQ/0',
                nickname: '宇尘',
                openid,
            };
            if (userInfo) {
                await redis.hmset(utils.redisKey(`openid:${openid}`), {
                    headimgurl: userInfo.headimgurl,
                    nickname: userInfo.nickname,
                    openid: userInfo.openid,
                });
            }
        }
    }

    const isPlay = userInfo.topics ? true : false;
    const initialData = await getInitialData(ctx, openid, query.type, query.asker, query.answerer, isPlay);

    const data = _.assign({
        isapp: validation.isApp(ctx.headers),
        iswechat,
        shareUrl: `${ctx.origin}/nactive/valentine170207/index`,
        wechat: jssdkConfig,
        phone: phone || '',
        openid,
        headimgurl: userInfo.headimgurl,
        nickname: userInfo.nickname,
        topics: userInfo.topics || '',
        askerInfo: {},
        answererInfo: {},
    }, initialData);

    console.log(`data=>${data}`);

    await ctx.render('/pj_valentine170207/views/index', data);
};

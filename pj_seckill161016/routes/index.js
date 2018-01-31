const libUtils = require('../utils');
const wechatApi = require('@server/wechat');
const soaApi = require('@server/soa-api');

let project = 'seckill161016';

const  redis=require('../utils/seckill_redis');

const seckillConfig= require('../config');


const indexService= require('../service/indexService');
// 首页内容渲染
exports.get = async function(ctx, next) {
    let iswechat = libUtils.iswechat(ctx.headers);
    let isapp = libUtils.isapp(ctx.headers);

    const  activeName=ctx.query.type || 'seckill161016';

    const active= await redis.hgetall(seckillConfig.redis.active(activeName));
    const product = await redis.hgetall(seckillConfig.redis.product(activeName));

    const  rule = await redis.get(seckillConfig.redis.rule(activeName));
    if(!active || !product){ //活动不存在的情况
        return next();
    }
    let url = libUtils.getFullUrl(ctx); // 当前页面完整地址
    // let openid = ctx.session.openId || '';
    let openid = '';

    let wechat =iswechat? await wechatApi.getJsConfig(url):{};

    // iswechat = true;

    if (iswechat) {

        let redirectUrl = 'https://' + ctx.host + ctx.path;
        let token = await wechatApi.getOauthToken(ctx, redirectUrl, {type: activeName});
        if (!token) { // redirect
            return
        }
        openid = token.openid;

        // openid = 10001;
        // ctx.session.userId = ''


        //如果session里面没有用户，判断用户是否绑定
        if (!ctx.session.userId) {
            //调用用户中心判断是否绑定
            const userInfo = await soaApi("platform/userWechatOpenIdSOAService/getUserId", openid);
            if (userInfo && userInfo.data > 0) {
                ctx.session.userId = userInfo.data; //放入session
            } else {
                console.log(userInfo);
            }
        }
        if (!ctx.session.openId) {
            ctx.session.openId = openid;
        }

        
    }

    const data = {
        isapp: isapp,
        wechat: wechat,
        openid: openid,
        shareUrl: 'https://' + ctx.host + '/nactive/' + project + '/index?type=' + activeName,
        active,
        product,
        type:activeName,
        rule
    };

    await ctx.render('/pj_' + project + '/views/index', data);
};

exports.post= async function (ctx, next) {
    const  body=ctx.request.body;

    const isapp = libUtils.isapp(ctx.headers);
    const iswechat = libUtils.iswechat(ctx.headers);

    const activeName= body.active || 'seckill161016';

    let userId = null;
    if (body.userId - 0 > 0) {
        userId = body.userId;
        if (!ctx.session.userId) {
            ctx.session.userId = userId;
        }
    } else if (ctx.session.userId - 0 > 0 && iswechat) {
        userId = ctx.session.userId;
    }

    ctx.body=await indexService(activeName,body.openId,userId);

};
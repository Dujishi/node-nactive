const soaApi = require('@server/soa-api');
const wechatApi = require('@server/wechat');
const validation = require('@util/validation');
const redis = require('@server/redis');
const platform = require('@server/model-soaapi').platform;
let openId;

exports.get = async function (ctx, next) {
    let jssdkConfig = {};
    const isWechat = validation.isWechat(ctx.headers);
    const isApp = validation.isApp(ctx.headers);
    const url = ctx.href;
    if (isWechat) {
        jssdkConfig = await wechatApi.getJsConfig(url);
    }

    if(isWechat && ctx.session.openid){
        openId = ctx.session.openid;
    }
    const shareData = {
        shareUrl: `${ctx.origin}/nactive/newcomer/welcome`,
        shareTitle:'送你一瓶玻璃水，赶紧去领吧!',
        shareContent:'送你一瓶玻璃水，赶紧去领吧!',
        shareSubTitle:'全国300家连锁店…进app搜索一下附近门店吧！'
    };

    const data = {
        isapp: isApp,
        iswechat: isWechat,
        wechat: jssdkConfig,
        shareData:shareData,
        openId
    };

    await ctx.render('/pj_newcomer/views/welcome', data);
};

exports.post = async function(ctx){
    const req = ctx.request.body;
    let phone = req.phone;
    const userInfo = await soaApi('platform/userCenterService/isNewCarUser', phone);
    if(!userInfo.success){
        console.log('userInfo SOA出错');
    }
    if (userInfo.data){
        ctx.body = {
            success: true,
            message: 'ok'
        };
    }else{
        ctx.body = {
            success: false,
            message: '您已是典典用户，无法领取新人红包'
        };
        return false;
    }

};

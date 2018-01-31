//const soaApi = require('@server/soa-api');
//const wechatApi = require('@server/wechat');
const validation = require('@util/validation');
const redis = require('@server/redis');
let openId;

exports.get = async function (ctx, next) {
    let jssdkConfig = {};
    const isWechat = validation.isWechat(ctx.headers);
    const isApp = validation.isApp(ctx.headers);
    //const url = ctx.href;
    // if (isWechat) {
    //     jssdkConfig = await wechatApi.getJsConfig(url);
    // }
    // if(isWechat && ctx.session.openid){
    //     openId = ctx.session.openid;
    // }

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

    await ctx.render('/pj_newcomer/views/index', data);
};

// exports.post = async function(ctx){
//     let userId = ctx.session.userId;
//     let key = `newcomer:old:${userId}`;
//     let data;
//     if(redis.isExist(key)){
//         data ={
//             success:false,
//             already:1,
//             msg:'已经参加过该活动！'
//         }
//     }else{
//         data ={
//             success:true,
//             already:0,
//             msg:'活动参加成功！'
//         };
//         redis.set(key,1);
//     }
//     ctx.body = data;
//     console.log(key,data);
// };


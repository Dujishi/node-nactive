const soaApi = require('@server/soa-api');
const wechatApi = require('@server/wechat');
const validation = require('@util/validation');
const cipher = require('@server/cipher');
const redis = require('@server/redis');
const config = require('../config');

exports.get = async function (ctx, next) {

    const isApp = validation.isApp(ctx.headers);
    const isWechat = validation.isWechat(ctx.headers);

    let shareUrl = '';
    let userId = '';
    let openId = ctx.session.openId;



    const shareTextConfig = {
        isLogin: {
            shareTitle: '办理违章不用钱？',
            shareContent: '加入典典养车，享0元办违章特权，还有新人红包相送哦！',
            shareSubTitle: '加入典典养车，享0元办违章特权，还有新人红包相送哦！',
        },
        noLogin: {
            shareTitle: '办理违章不用钱？',
            shareContent: '加入典典养车，享0元办违章特权，还有新人红包相送哦！',
            shareSubTitle: '加入典典养车，享0元办违章特权，还有新人红包相送哦！',
        }
    };
    let shareText = shareTextConfig.noLogin;


    // 每个登录的用户都有一个唯一的分享地址，对分享的 url 参数加密
    userId = ctx.session.userId || ctx.headers.userid;
    if (!userId) {
        shareUrl = `${ctx.origin}/nactive/freeticket/share`;
    } else {
        encryptedSignStr = cipher.encoder(userId.toString(), config.signKey);
        shareUrl = `${ctx.origin}/nactive/freeticket/share?signs=${encryptedSignStr}`;
        console.log(shareUrl);
        console.log(userId);
    }
     // 当前用户分享出去的链接被查看的次数，需要在页面展示的
    const totalViewCounts = await redis.llen(config.totalViewRedisKey(userId));
    console.log(totalViewCounts);

    const data = {
        iswechat: isWechat,
        isapp: isApp,
        openid: openId,
        wechat: 'wechatShare',
        shareUrl:shareUrl,
        shareTitle: shareText.shareTitle,
        shareSubTitle: shareText.shareSubTitle,
        shareContent: shareText.shareContent,
        userId:userId,
        isDebug: '',
        viewCounts: totalViewCounts,
        status:'',
        remainSecs:''
    };
    await ctx.render('/pj_freeticket/views/index',data);
};

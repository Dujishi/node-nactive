const soaApi = require('@server/soa-api');
const wechatApi = require('@server/wechat');
const validation = require('@util/validation');
const cipher = require('@server/cipher');
const redis = require('@server/redis');
const config = require('../config/index');
const getFullUrl = require('../config/get_full_url');

exports.get = async function (ctx, next) {

    const isApp = validation.isApp(ctx.headers);
    const isWechat = validation.isWechat(ctx.headers);
    const url = getFullUrl(ctx);

    let shareUrl = '';
    let userId = ctx.session.userId;
    let openId = ctx.session.openId;
    let signStr = '';
    let wechatShare;

    shareUrl = `${ctx.origin}/nactive/freeticket/share`;

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

    if (isWechat) {
        let redirectUrl = '';
        const signParam = ctx.request.query.signs;
        if( !ctx.request.query.signParam && signParam){
            ctx.session.signParam = signParam;
        }
        console.log('signParam 11->'+ signParam);
        
        if (!signParam) {
            redirectUrl = `https://${ctx.host + ctx.path}`;
        } else {
            redirectUrl = `https://${ctx.host + ctx.path}?signs=${signParam}`;
        }
        const token = await wechatApi.getOauthToken(ctx, redirectUrl);
        if (!token) { // redirect
            return;
        }
        openId = token.openid;
        wechatShare = await wechatApi.getJsConfig(url);


        console.log('userId 111->' + userId);
        // 如果session里面没有 userId，判断用户是否绑定
        if (!ctx.session.userId) {
            // 调用用户中心判断是否绑定
            const userInfo = await soaApi('platform/userWechatOpenIdSOAService/getUserId', openId);
            if (userInfo && userInfo.data > 0) {
                ctx.session.userId = userInfo.data;
                userId = userInfo.data;
            }
        }
        if (!ctx.session.openId) {
            ctx.session.openId = openId;
        }
        if (!ctx.session.userId) {
            shareText = shareTextConfig.noLogin;
        } else {
            shareText = shareTextConfig.isLogin;
        }

        signStr = ctx.session.signParam;
        console.log('signStr-> ' + signStr)

        if (signStr) {
            decryptedSignStr = cipher.decoder(signStr.toString(), config.signKey);
            
            // 用户之前有没有看过这个用户的连接
            isViewResult = await redis.hget(config.isViewRedisKey(decryptedSignStr, openId), 'isVew');
            console.log('isViewResult ->'+isViewResult);
            console.log('userId 222->'+userId);
            console.log('decryptedSignStr-> '+decryptedSignStr);
            console.log('openId-> '+openId);
            if ((userId != decryptedSignStr) && openId != '') {
                if (!isViewResult) {
                    await redis.hmset(config.isViewRedisKey(decryptedSignStr, openId), { isVew: true });
                    await redis.rpush(config.totalViewRedisKey(decryptedSignStr), JSON.stringify({ userId, openId }));
                    console.log('访问数据：'+openId);
                }
            }
            // 原分享者的链接被查看的次数，等于2的时候给他发红包
            const originalTotalViewCounts = await redis.llen(config.totalViewRedisKey(decryptedSignStr));
            console.log('originalTotalViewCounts->'+originalTotalViewCounts);
            let packetCode = '2017NJ10';
            if (originalTotalViewCounts == 2) {
                await soaApi('marketing-core/exchangeActivityService/exchange', parseInt(decryptedSignStr), packetCode);
                console.log('发红包');
            }
        }
    }else{
        // await ctx.render('/views/error', { 
        //     errCode: 404,
        //     title: '0元办违章',
        //     message: '请在微信中打开',
        // });
        // return;
    }


    const data = {
        iswechat: isWechat,
        isapp: isApp,
        openid: openId,
        wechat: wechatShare,
        shareUrl:shareUrl,
        shareTitle: shareText.shareTitle,
        shareSubTitle: shareText.shareSubTitle,
        shareContent: shareText.shareContent,
        userId:'',
        isDebug: '',
        status:'',
        remainSecs:''
    };

    await  ctx.render('/pj_freeticket/views/share',data);
};
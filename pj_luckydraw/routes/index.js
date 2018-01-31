/**
 * @description 一元夺宝入口页路由
 * @author  yinshi
 * @date 16/11/26.
 */
const wechatApi = require('@server/wechat');
const validation = require('@util/validation');

const platform = require('../model/platform');
const shareConfig = require('../config/share');
// const  checkOver = require('../service/checkOver')
exports.get = async function (ctx, next) {
    const isWechat = validation.isWechat(ctx.headers);
    const isApp = validation.isApp(ctx.headers);
    const url = ctx.href;
    // const activeName = ctx.query.type || 'cmb161201';
    shareConfig.shareUrl = ctx.origin + ctx.path;
    const renderData = {
        urlAbout: `${ctx.origin}/nactive/luckydraw/about`,
        isapp: isApp,
        iswechat: isWechat,
    };
    Object.assign(renderData, shareConfig);
    // const over = await checkOver(activeName);
    // if(over){
    //     await ctx.render('/views/error',{  message: '你来晚了，活动已经结束'});
    //     return
    // }
    // 判断是否为微信
    if (isWechat) {
        let openid = ctx.session.openid;
        if (!openid) {
            const redirectUrl = ctx.origin + ctx.path;
            const token = await wechatApi.getOauthToken(ctx, redirectUrl);
            if (!token) { // redirect
                return;
            }
            openid = token.openid;
            const userData = await platform.getUseridByOpenid(openid);
            if (userData && userData.data > 0) {
                ctx.session.userId = userData.data; // 放入session
            } else {
                console.log(userData);
            }
        }

        const wechat = await wechatApi.getJsConfig(url);


        Object.assign(renderData, {
            openid,
            wechat,
        });

    //    判断是否为app
    } else if (isApp) {

    }

    await ctx.render('/pj_luckydraw/views/index', renderData);
};

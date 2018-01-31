const wechatApi = require('@server/wechat');
const validation = require('@util/validation');
const getFullUrl = require('../../lib/utils/get_full_url');
const util = require('../service/util');

exports.get = async (ctx) => {
    const { unionid } = ctx.session;
    const { orderId, actId } = ctx.query;

    if (!orderId) {
        await ctx.render('/views/error', {
            message: '参数不合法，请核对参数'
        });
        return;
    }
    ctx.session.orderId = orderId;
    ctx.session.actId = actId;

    // 验证app
    const isapp = validation.isApp(ctx.headers);
    const iswechat = validation.isWechat(ctx.headers);

    let data = {
        isapp,
        iswechat,

    };

    // 微信信息
    const url = getFullUrl(ctx);
    let userInfo = {};
    if (iswechat) {
        const wechat = await wechatApi.getJsConfig(url);
        data = Object.assign(data, {
            wechat
        });

        if (ctx.session.wechatUserInfo) {
            userInfo = JSON.parse(ctx.session.wechatUserInfo);
            if (userInfo.headimgurl && userInfo.headimgurl.indexOf('http://') > -1) {
                userInfo.headimgurl = userInfo.headimgurl.replace('http://', 'https://');
            }
        }

        console.log('userInfo===>', JSON.stringify(userInfo));
    } else {
        await ctx.render('/views/error', {
            message: '链接只能在微信中访问哦~'
        });
        return;
    }

    // 加载活动信息
    const actRes = await util.getActInfo(orderId);
    console.log('actRes===>', JSON.stringify(actRes));
    if (!actRes || (actRes && !actRes.success)) {
        await ctx.render('/views/error', {
            message: '加载活动信息报错'
        });
        return;
    }

    // 活动已结束
    if (actRes.data === null || (typeof actRes.data.actStatus != 'undefined' && actRes.data.actStatus === 0)) {
        await ctx.render('/views/error', {
            message: '活动已结束，请下次再来哦~'
        });
        return;
    }

    // 获取用户关联信息
    const res = await util.getUserInfo(unionid);
    console.log('用户关联信息res===>', JSON.stringify(actRes));
    if (!res || (res && !res.success)) {
        await ctx.render('/views/error', {
            message: '加载用户关联信息报错'
        });
        return;
    }


    data = Object.assign(data, {
        actName: actRes.data.actName,
        shopName: actRes.data.shopName,
        shareRuleDesc: actRes.data.shareRuleDesc,
        shareData: {
            shareUrl: url,
            shareTitle: actRes.data.shareTitle,
            shareContent: actRes.data.shareSubtitle,
            shareSubTitle: actRes.data.shareSubtitle,
            shareImgUrl: actRes.data.shareImgUrl || 'https://store.ddyc.com/res/xkcdn/icons/share/icon_yearcard.png'
        },
        islogin: !!res.data
    });

    if (data.islogin) {
        // 加载领取数据
        const packetRes = await util.getPacketInfo(null, orderId, actId, unionid, res.data.userPhone, userInfo.headimgurl, userInfo.nickname);
        console.log('packetInfo===>', JSON.stringify(packetRes));
        if (!packetRes || (packetRes && !packetRes.success)) {
            await ctx.render('/views/error', {
                message: '加载红包信息失败'
            });
            return;
        }
        data = Object.assign(data, packetRes.data);
    }

    await ctx.render('/pj_luckpacket/views/index', data);
};

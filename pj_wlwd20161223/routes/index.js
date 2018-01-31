const soaApi = require('@server/soa-api');
const wechatApi = require('@server/wechat');
const validation = require('@util/validation');
const getFullUrl = require('../../lib/utils/get_full_url');
const modelSoa = require('@server/model-soaapi');

exports.get = async function(ctx) {
    let jssdkConfig = {};
    const url = getFullUrl(ctx); // 当前页面完整地址
    const iswechat = validation.isWechat(ctx.headers);
    let phone = null;
    if (iswechat) {
        jssdkConfig = await wechatApi.getJsConfig(url);
    }
    // console.log(ctx.session);
    // const soaRes = await soaApi('platform/userWechatOpenIdSOAService/getUserInfo', ctx.session.openid);
    // if (soaRes.success && soaRes.data) {
    //     phone = soaRes.data.phone;
    // }

    await ctx.render('/pj_wlwd20161223/views/index', {
        // isapp: validation.isApp(ctx.headers),
        iswechat,
        shareUrl: `${ctx.origin}/nactive/wlwd20161223/index`,
        wechat: jssdkConfig,
        // phone: phone || '',
    });
};

// 判断新老用户
exports.post = async function (ctx, next) {
    const req = ctx.request.body
    const phone = req.phone
    let code = '';
    let useid = null;
    // 验证手机号码是否正确
    if (!validation.isPhone(phone)) {
        ctx.body = { success: false, message: "请输入正确的手机号码" };
        return false;
    }

    const isNewCarUserSoaRet = await soaApi('platform/userCenterService/isNewCarUser', phone);

    if (isNewCarUserSoaRet.success) {
        code = isNewCarUserSoaRet.data ? 'xrhb1027' : 'llxhb135';
    } else {
        ctx.body = isNewCarUserSoaRet;
        return;
    }

    let soaResp = await soaApi('car/promotionSoaService/doH5Exchange', '', code, phone);
    let isTwo = "false";
    let suc = false;
    if (soaResp.success) {
        isTwo = "true";
    } else if (soaResp.errCode == "REPEAT_CODE"){
        isTwo = "false";
    } else {
        isTwo = "err";
    }
    if ( isTwo != "err") {
        suc = true;
    }
    ctx.body = {
        text: isNewCarUserSoaRet ,
        success: suc,
        isNew: isNewCarUserSoaRet.data,
        had: isTwo,
        message: soaResp.message || null,
    }
}


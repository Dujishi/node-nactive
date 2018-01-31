const soaApi = require('@server/soa-api');
const validation = require('@util/validation');
const config = require('../config');

exports.post = async function(ctx, next) {

    const body = ctx.request.body;

    let phone = body.phone.trim();

    if (!validation.isPhone(phone)) {
        ctx.body = {
            success: false,
            data: {},
            msg: '请输入正确的手机号'
        };
        return;
    }

    let preLogin = {
        phone: phone,
        appType: 3,
        notifyType: 0
    }

    const codeInfo = await soaApi("platform/userCenterService/preLogin", preLogin);

    if (codeInfo.success) {
        ctx.body = codeInfo;
        return;
    }

    ctx.body = {
        success: false,
        data: {},
        msg: '发送短信验证码失败，请稍候重新'
    };

};
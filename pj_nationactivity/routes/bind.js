const soaApi = require('@server/soa-api');
const validation = require('@util/validation');
const config = require('../config');

exports.post = async function(ctx, next) {

    const body = ctx.request.body;

    let iswechat = validation.isWechat(ctx.headers);

    let phone = body.phone;
    let code = body.code;

    if (!validation.isPhone(phone)) {
        ctx.body = {
            success: false,
            data: {},
            msg: '请输入正确的手机号'
        };
        return;
    }
    if (code.trim().length != 4) {
        ctx.body = {
            success: false,
            data: {},
            msg: '请输入正确的验证码'
        };
        return;
    }

    let loginInfo = {
        phone: phone,
        appType: 3,
        code: code
    }

    //登录验证
    let userInfo = await soaApi("platform/userCenterService/login", loginInfo);

    //打印日志
    if (!userInfo.success) {
        console.error(userInfo);
        ctx.body = {
            success: false,
            data: {},
            msg: userInfo.message || userInfo.msg
        };
        return;
    }

    //把用户信息放到session中
    console.log(userInfo)
    ctx.session.userId = userInfo.data.userId;

    //如果是微信，进行账户绑定
    let openId = ctx.session.openId;
    if (iswechat && openId && userInfo.success) {
        let appType = 3;

        let bindStatus = await soaApi("platform/userWechatOpenIdSOAService/bindingByPhone", openId, phone, appType);

        //打印错误
        if (!bindStatus.success) {
            console.error(bindStatus)
        }
    }

    ctx.body = {
        success: true,
        data: {},
        msg: ''
    };

};
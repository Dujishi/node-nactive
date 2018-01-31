const validation = require('@util/validation');
const resJson = require('@util/response-json');
const soaApi = require('@server/model-soaapi');
const util = require('../util');
/**
 * 获取洗车劵接口
 */

exports.get = async (ctx) => {
    const {
        phone,
        code
    } = ctx.query;

    if (!validation.isPhone(phone)) {
        ctx.body = resJson.json_err('手机号不能为空', 1);
        return;
    }
    if (!code) {
        ctx.body = resJson.json_err('验证码错误', 2);
        return;
    }
    const resLogin = await soaApi.platform.userCenterService.login({
        phone,
        code,
        appType: 23
    });

    if (resLogin.success) {
        if (ctx.session.openid) {
            await soaApi.platform.oldWechat.bindingByPhone(ctx.session.openid, phone, 23);
        }
        ctx.session.bjbankPhone = phone;
        ctx.body = await util.getCoupons(phone);
    } else {
        ctx.body = resLogin;
    }
};

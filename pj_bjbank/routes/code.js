const validation = require('@util/validation');
const resJson = require('@util/response-json');
const soaApi = require('@server/model-soaapi');

/**
 * 获取验证码接口
 */

exports.get = async (ctx) => {
    const phone = ctx.query.phone;

    if (!validation.isPhone(phone)) {
        ctx.body = resJson.json_err('手机号不能为空', 1);
        return;
    }
    ctx.body = await soaApi.platform.userCenterService.preLogin({ phone, appType: 23 });
};

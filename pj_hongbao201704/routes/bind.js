const soaApi = require('@server/soa-api');
const validation = require('@util/validation');

exports.post = async function(ctx) {
    const body = ctx.request.body;
    const iswechat = validation.isWechat(ctx.headers);
    const phone = body.phone;
    // 如果是微信，进行账户绑定
    const openId = ctx.session.openId;
    if (iswechat && openId) {
        const appType = 3;

        const bindStatus = await soaApi('platform/userWechatOpenIdSOAService/bindingByPhone', openId, phone, appType);
        // 打印错误
        if (!bindStatus.success) {
            console.error(bindStatus);
        }
    }
    ctx.body = {
        success: true,
        data: {},
        msg: '用户信息绑定成功'
    };
};

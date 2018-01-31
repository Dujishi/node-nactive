const soaApi = require('@server/soa-api');
const validation = require('@util/validation');
const redis = require('@server/redis');
const response = require('@util/response-json');

exports.post = async function(ctx, next) {
    const body = ctx.request.body;
    const phone = body.phone;

    let code = '';

    // 验证手机号码是否正确
    if (!validation.isPhone(phone)) {
        response.json_err('手机号格式不正确');
        return;
    }

    const isNewCarUserSoaRet = await soaApi('platform/userCenterService/isNewCarUser', phone);

    if (isNewCarUserSoaRet.success) {
        code = isNewCarUserSoaRet.data ? 'xrhb1027' : 'llxhb135';
    } else {
        ctx.body = isNewCarUserSoaRet;
        return;
    }

    const soaResp = await soaApi('car/promotionSoaService/doH5Exchange', '', code, phone);

    if (soaResp.success) {
        ctx.body = response.json_success({
            isNew: isNewCarUserSoaRet.data,
        });
    } else {
        ctx.body = soaResp;
    }
};

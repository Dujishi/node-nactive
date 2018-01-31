/*
 * @Author: Yard
 * @Date: 2016-12-21 17:11:57
 * @Last Modified by: Yard
 * @Last Modified time: 2017-02-21 09:54:03
 */
const soaApi = require('@server/soa-api');
const validation = require('@util/validation');
const response = require('@util/response-json');

exports.post = async function(ctx) {
    const body = ctx.request.body;
    const iswechat = validation.isWechat(ctx.headers);
    const userId = body.userId || null;
    const phone = body.phone || null;
    const status = body.status || false;
    const openId = ctx.session.openid || '';
    let soaResp = null;
    if (status && iswechat) {
        const soaBindRes = await soaApi('platform/userWechatOpenIdSOAService/bindingByPhone', openId, phone, 3);
        if (!soaBindRes.success) {
            console.log(soaBindRes.message);
        }
    }

    soaResp = await soaApi('car/promotionSoaService/doH5Exchange', userId, 'FDDJ10', phone);
    if (soaResp.success) {
        const data = soaResp.data;
        ctx.body = response.json_success(data);
    } else {
        ctx.body = response.json_err(soaResp.message, soaResp.errCode);
    }
};

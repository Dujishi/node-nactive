const response = require('@util/response-json');
const validation = require('@util/validation');
const soaApi = require('@server/soa-api');

exports.post = async function (ctx) {
    const body = ctx.request.body;
    const code = body.code;
    const phone = body.phone;
    const password = body.password;
    const pw = 'xiaoka123';
    const code1 = 'djjhb500';
    const code2 = 'djjhb100';

    if (!code) {
        ctx.body = response.json_err('兑换码不能为空');
        return;
    }

    if (code !== code1 && code !== code2) {
        ctx.body = response.json_err('请输入正确的兑换码');
        return;
    }

    if (!validation.isPhone(phone)) {
        ctx.body = response.json_err('手机号码格式错误');
        return;
    }

    if (password !== pw) {
        ctx.body = response.json_err('请输入正确的密码');
        return;
    }

    const soaResp = await soaApi('car/promotionSoaService/doH5Exchange', '', code, phone);

    ctx.body = soaResp;
};

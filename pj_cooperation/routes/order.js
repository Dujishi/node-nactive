/**
 * @description
 * @author  yinshi
 * @date 17/6/9.
 */
const response = require('@util/response-json');
const soaApi = require('@server/soa-api');
const validation = require('@util/validation');
const validateStatus = require('../service/check');
exports.post = async function (ctx) {
    const userId = ctx.session.userId;
    const unionid = ctx.session.unionid;
    console.log(`unionid===>${unionid}`);
    if (!unionid) {
        ctx.body = response.json_err('只能在微信中访问');
        return;
    }
    const result = await validateStatus(userId, '');
    ctx.body = result;
};

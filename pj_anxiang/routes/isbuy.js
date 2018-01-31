const soaApi = require('@server/soa-api');
const config = require('../../config');
const validation = require('@util/validation');
const customConfig = require('../config');

exports.post = async function (ctx) {
    const body = ctx.request.body;
    const userId = body.userId || ctx.session.userId;
    const codeList = body.codes.split(',');
    const soaUrl = 'car/generalMonthActivitySoaService/hasBoughtItem20';
    const iswechat = validation.isWechat(ctx.headers);
    const activityId = customConfig.activityId;

    // if (iswechat) {
    //     if (!userId) {
    //         ctx.redirect(`/feopen/login/index?url=${ctx.origin + ctx.path}`);
    //         return;
    //     }
    // }

    let soaResult0 = await soaApi(soaUrl, activityId, userId, codeList[0]);
    let soaResult1 = await soaApi(soaUrl, activityId, userId, codeList[1]);
    let soaResult2 = await soaApi(soaUrl, activityId, userId, codeList[2]);

    console.log('========== hasBoughtItem20 ==========');
    console.log(userId);
    console.log(soaResult0);
    console.log(soaResult1);
    console.log(soaResult2);

    if (soaResult0.success && soaResult1.success && soaResult2.success) {
        ctx.body = {
            success: true,
            data: [
                soaResult0.data,
                soaResult1.data,
                soaResult2.data,
            ],
        };
    } else {
        ctx.body = {
            success: false,
            message: '请求出错啦'
        };
    }
};

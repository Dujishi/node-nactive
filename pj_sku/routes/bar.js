/**
 * Created by zhoutao on 2017/3/9.
 */
const soaApi = require('@server/soa-api');
const validation = require('@util/validation');
let skuActivity;
let userType;

exports.get = async function(ctx, next) {
    const isApp = validation.isApp(ctx.headers);
    let userId;
    if(isApp){
        userId = ctx.headers.userid || ctx.query.userId;
    }else{
        userId = ctx.session.userId;
    }

    if (!userId) {
        ctx.body = response.json_err('当前用户未登录', -1);
        return
    }

    const activityId = ctx.query.activeId;
    skuActivity = await soaApi('/car/generalMonthActivitySoaService/getSkuActivity', activityId, userId || null);

    if (!skuActivity.success) {
        ctx.body = skuActivity;
        return
    }

    if (skuActivity && skuActivity.success) {
        ctx.session.userType = skuActivity.data.userType;
        userType = skuActivity.data.userType;
        const data = {
            skuActivity: skuActivity.data,
            userType :userType
        };
        await ctx.render('/pj_sku/views/body', data);
        return
    }



};

const soaApi = require('@server/soa-api');
const wechatApi = require('@server/wechat');
const validation = require('@util/validation');
const payment  = require('@util/native-bridge/lib/payment');
let skuActivity;

exports.get = async function(ctx, next) {
    let jssdkConfig = {};
    const isWechat = validation.isWechat(ctx.headers);
    const isApp = validation.isApp(ctx.headers);
    const activityId = ctx.request.query.activeId;
    const url = ctx.href;

    if (isWechat) {
        jssdkConfig = await wechatApi.getJsConfig(url);
    }

    let userId = isApp? ctx.headers.userid:ctx.session.userId;

    if (activityId) {
        skuActivity = await soaApi('/car/generalMonthActivitySoaService/getSkuActivity', activityId, userId || null );
        console.log('SOA-DATA:', skuActivity);
    }else{
        await ctx.render('/views/error', {
            message: '活动不存在'
        });
        return;
    }


    if (skuActivity && skuActivity.success) {
        let activityData = skuActivity.data;
        let activityStatus = skuActivity.data.status.type;

        if(activityStatus==0){
            await ctx.render('/views/error', {
                message: '活动已结束'
            });
            return;
        }else if(activityStatus==-1){
            await ctx.render('/views/error', {
                message: '活动尚未开始'
            });
            return;
        }
        const shareData = {
            shareTitle: activityData.shareTitle,
            shareSubTitle: activityData.shareDesc,
            shareImgUrl: activityData.sharePic,
            shareContent: activityData.shareDesc,
            shareUrl: url
        };

        let skuData = skuActivity.data.skuList[0];
        ctx.session.userType = activityData.userType;
        ctx.session.commodityCode = skuData.commodityCode;
        ctx.session.commodityName = skuData.commodityName;

        const data = {
            isapp: isApp,
            iswechat: isWechat,
            wechat: jssdkConfig,
            shareData: shareData,
            skuActivity: activityData,
            detailPics: skuData.detailPics,
            cityList: activityData.cityIds,
            commodityCode :skuData.commodityCode,
            commodityName: skuData.commodityName,
            userType :activityData.userType
        };

        await ctx.render('/pj_sku/views/index', data);
    }else{
        await ctx.render('/views/error', {
            message: '活动不存在'
        });
        console.log('SOA 数据错误');
        return;
    }



};

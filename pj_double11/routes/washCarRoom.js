const wechatApi = require('@server/wechat');
const validation = require('@util/validation');
const shareConfig = require('../config/share');
const getFullUrl = require('../../lib/utils/get_full_url');
const redisService = require('../service//redis');
const soaApi = require('@server/soa-api');
const resposeJson = require('@util/response-json');


/**
 * 判断时间
 */
const timeLimit = async () => {
    const washEndDate = '2017-11-11 23:59:59';
    const washEndTime = new Date(washEndDate).getTime();
    const normalDate = '2017-11-11 00:00:00';
    const now = Date.now();
    const normalTime = new Date(normalDate).getTime();
    if (now < normalTime) {
        return 'nostart';
    } else if (now > washEndTime) {
        return 'washEnd';
    }
    return 'washCarRoom';
};
/**
 *  双十一洗车分会场
 */
exports.get = async (ctx) => {
    // 验证app
    const isapp = validation.isApp(ctx.headers);
    const iswechat = validation.isWechat(ctx.headers);
    const url = getFullUrl(ctx);

    const stage = await timeLimit();

    if (stage === 'nostart') {
        await ctx.render('/views/error', {
            message: '活动马上开始，请时刻关注哦~'
        });
        return;
    }

    if (stage === 'washEnd') {
        await ctx.render('/views/error', {
            message: '活动已经结束啦~'
        });
        return;
    }

    // 如果有userId
    if (ctx.query.userId) {
        ctx.session.userId = ctx.query.userId - 0;
    }


    let data = {
        isapp,
        iswechat,
        shareData: Object.assign({
            shareUrl: url
        }, shareConfig.wash),
    };

    // // 是否已报名
    // if (ctx.session.userId) {
    //     const isExist = await redisService.queryRecord(ctx.session.userId);
    //     data.isExist = !!isExist;
    // }


    if (iswechat) {
        const wechat = await wechatApi.getJsConfig(url);
        data = Object.assign(data, {
            wechat
        });
    }

    await ctx.render('/pj_double11/views/washCarRoom', data);
};


async function getShopIdList(ctx, activityId) {
    const soaRes = await soaApi(
       'marketing-core/saleActivityService/getActivityShopList',
       activityId
    );
    if (soaRes.data) {
        console.log(soaRes.data);
        const careShopIdList = [];
        let serviceCodeList = [];
        const commodityItem = '';
        soaRes.data.skuList.map((item) => {
            careShopIdList.push(item.shopId);
        });
        serviceCodeList = soaRes.data.skuList[0].commodityCode.split();


        const dataObj = {
            careShopIdList,
            serviceCodeList,
            commodityItem,
        };
        ctx.session.queryData = JSON.stringify(dataObj);


        return dataObj;
    }
    return {};
}

function getShopInfoList(dataObj) {
    return soaApi('shop-car/shopSearchService/searchCareShopBaseInfo',
    dataObj);
}

function getShopPriceList(shopInfos) {
    return soaApi(
     'marketing-core/saleActivityService/getActServicePageShowInfo',
     shopInfos
 );
}


exports.post = async function(ctx) {
    const body = ctx.request.body;
    const activityId = body.activityId;

    const pageSize = body.pageSize || 20;
    const pageNumber = body.pageNumber || 1;

    const lat = body.locationData.lat;
    const lon = body.locationData.lon;

    let queryData = ctx.session.queryData;


    // 获取商家id列表
    if (!queryData) {
        queryData = await getShopIdList(ctx, activityId);
    }
    queryData = typeof queryData === 'string' ? JSON.parse(queryData) : queryData;


    const commodityItem = queryData.commodityItem;

    // 获取附近商家信息
    const shopInfoRes = await getShopInfoList({
        pageNumber,
        pageSize,
        lat,
        lon,
        careShopIdList: queryData.careShopIdList,
        serviceCodeList: queryData.serviceCodeList,
    });

    if (!shopInfoRes || !shopInfoRes.success) {
        ctx.body = resposeJson.json_err(shopInfoRes ? shopInfoRes.message : '获取商家列表报错');
        return;
    }

    // 获取商家价格
    if (shopInfoRes.data && shopInfoRes.data.length === 0) {
        ctx.body = resposeJson.json_success([]);
        return;
    }


    const priceList = [];
    shopInfoRes.data.forEach((item) => {
        priceList.push({ careShopId: item.careShopId, commodityCode: queryData.serviceCodeList[0] });
    });

    // 加载价格
    const commityPriceRes = await getShopPriceList(priceList);
    if (!commityPriceRes || !commityPriceRes.success) {
        ctx.body = resposeJson.json_err(commityPriceRes ? commityPriceRes.message : '获取商家商品价格报错');
        return;
    }

    const retData = [];
    shopInfoRes.data.forEach((item) => {
        if (item.avatar && item.avatar.indexOf('!') == -1) {
            item.avatar += '!/fwfh/70x70';
        }
        commityPriceRes.data.forEach((it1) => {
            if (item.careShopId === it1.shopId) {
                item.commodityItem = commodityItem;
                item = Object.assign(item, it1);
            }
        });
        retData.push(item);
    });
    // console.log(commityPriceRes.data);
    ctx.body = resposeJson.json_success(retData);
};

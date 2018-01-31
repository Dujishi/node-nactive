const wechatApi = require('@server/wechat');
const soaApi = require('@server/soa-api');
const validation = require('@util/validation');
const getFullUrl = require('../../lib/utils/get_full_url');
const service = require('../service/redis');
const kafka = require('@server/kafka-log');

const project = 'storelist';

exports.get = async function(ctx) {
    const iswechat = validation.isWechat(ctx.headers);
    const isapp = validation.isApp(ctx.headers);
    const url = getFullUrl(ctx); // 当前页面完整地址
    let wechat = {};

    // if (!iswechat && !isapp) {
    //     ctx.redirect('http://dl.ddyc.com');
    //     return;
    // }

    if (iswechat) {
        wechat = await wechatApi.getJsConfig(url);
    }

    const data = {
        isapp,
        iswechat,
        wechat,
        shareUrl: url
    };

    await ctx.render(`/pj_${project}/views/index`, data);
};

exports.post = async function(ctx) {
    const body = ctx.request.body;
    const careShopIdList = body.careShopIdList;
    const careShopTypeList = body.careShopTypeList;

    if (careShopIdList) {
        body.careShopIdList = body.careShopIdList.split('-');
    }
    if (careShopTypeList) {
        body.careShopTypeList = body.careShopTypeList.split('-');
    }

    if (body.shop_list_key) {
        const lists = await service.getShopListByCache(body.shop_list_key);
        body.careShopIdList = lists ? lists.split(',') : [];
        body.lv1Id = 1;// 只查看洗车
    }

    kafka.log(JSON.stringify(body));

    const soaRet = await soaApi(
        'shop-car/shopSearchService/searchNearbyCareShop',
        body
    );

    ctx.body = soaRet;
};

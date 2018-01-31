const soaApi = require('@server/soa-api');
const carModel = require('@server/model/carModel');
const config = require('../../config');

exports.post = async function (ctx) {
    const body = ctx.request.body;
    const userId = ctx.session.userId || ctx.request.body.userId;
    const goodsCode = body.goodsCode;
    let extendInfo = body.extendInfo;
    const lat = body.lat || '';
    const lon = body.lon || '';
    let modelId;
    let seriesId;
    if (extendInfo !== null && extendInfo !== undefined && extendInfo !== '') {
        extendInfo = `&extendInfo=pintuanNumber|${extendInfo}`;
    } else {
        extendInfo = '';
    }
    let tradeOrderGoodsPartParam = '';

    if (!userId) {
        ctx.body = {
            success: false,
            data: '',
            code: 'notlogin',
            message: '未登录'
        };
        return;
    }

    // 获取用户默认车辆信息
    const defaultCar = await carModel.getDefaultCar(userId);
    if (defaultCar.success) {
        if (defaultCar.data && defaultCar.data.modelId && defaultCar.data.seriesId) {
            modelId = defaultCar.data.modelId;
            seriesId = defaultCar.data.seriesId;
        } else {
            ctx.body = {
                success: false,
                data: {
                    carId: (defaultCar.data && defaultCar.data.id) ? defaultCar.data.id : ''
                },
                code: -201,
                message: '车辆信息不完整，请到 App 中完善信息'
            };
            return;
        }
    } else {
        ctx.body = defaultCar;
        return;
    }

    const productData = await soaApi('commodity/commoditySoaService/selectCommodityByCodeAndShopId', goodsCode, 1);   
    if (!productData.success) {
        ctx.body = productData;
        return;
    }
    console.log(productData);
    const commodityItems = productData.data.commodityItems;
    commodityItems.forEach(async (ele) => {
        if (ele.itemType != 6) {
            const param = `${ele.commodityDto.commodityCode}|${ele.itemAmount},`;
            tradeOrderGoodsPartParam += param;
        }
    });


    let payHost = 'https://m.ddyc.com';
    if (config.env != 'prod' && config.env != 'pre') {
        payHost = 'https://new-m.ddyc.com';
    }
    const payurl = `${payHost}/payment/prepay?goodsCode=${goodsCode}&lat=${lat}&lon=${lon}&tradeOrderGoodsPartParam=${tradeOrderGoodsPartParam}&source=1&isSupportPreSale=1${extendInfo}`;
    ctx.body = {
        success: true,
        data: { payurl, },
        code: 200,
    };
};

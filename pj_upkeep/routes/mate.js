const soaApi = require('@server/soa-api');
const carModel = require('@server/model/carModel');
const config = require('../../config');

exports.post = async function (ctx) {
    const body = ctx.request.body;
    const userId = ctx.session.userId;
    const goodsCode = body.goodsCode;
    const lat = body.lat || '';
    const lon = body.lon || '';
    let modelId;
    let seriesId;
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

    // 获取商品的基本信息和配件信息
    const productData = await soaApi('commodity/commoditySoaService/selectCommodityByCodeAndShopId', goodsCode, 1);
    console.log('productData', productData);
    if (productData.success) {
        const commodityItems = productData.data.commodityItems;
        const promises = [];
        commodityItems.forEach(async (ele) => {
            if (ele.itemType != 6) {
                if (ele.itemType == 1) {
                    const stuffCategoryList = [ele.categoryDto.categoryCode];
                    const soaRes = soaApi('shop-car/commodityRecommendService/getCommodityByModelAndSeries', modelId, seriesId, stuffCategoryList);
                    promises.push(soaRes);
                } else {
                    const param = `${ele.commodityDto.commodityCode}|${ele.itemAmount},`;
                    tradeOrderGoodsPartParam += param;
                }
            }
        });
        const soaResPromise = await Promise.all(promises);
        console.log('soaResPromise', soaResPromise);
        if (soaResPromise[0] && soaResPromise[0].data.length <= 0) {
            // ctx.body = {
            //     success: false,
            //     data: '',
            //     code: -202,
            //     message: '无法匹配到可用机滤，暂且不能购买！'
            // };
            // return;
            console.log('默认机滤---');
            tradeOrderGoodsPartParam += 'S1070356|1';
        } else {
            soaResPromise.forEach((ele, index) => {
                if (ele.success && ele.data && ele.data.length > 0) {
                    if (ele.data[0].commodityCode) {
                        const param = `${ele.data[0].commodityCode}|${productData.data.commodityItems[index].itemAmount}`;
                        tradeOrderGoodsPartParam += param;
                    }
                }
            });
        }
        let payHost = 'https://m.ddyc.com';
        if (config.env != 'prod' && config.env != 'pre') {
            payHost = 'https://new-m.ddyc.com';
        }
        const payurl = `${payHost}/payment/prepay?goodsCode=${goodsCode}&lat=${lat}&lon=${lon}&source=1&tradeOrderGoodsPartParam=${tradeOrderGoodsPartParam}&isSupportPreSale=1`;
        ctx.body = {
            success: true,
            data: { payurl, },
            code: 200,
        };
    } else {
        ctx.body = productData;
    }
};

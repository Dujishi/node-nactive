/**
 * @description
 * @author  yinshi
 * @date 17/6/9.
 */

const soaApi = require('@server/soa-api');
const soaModal = require('@server/model-soaapi');
exports.checkCard = require('./card');
const config = require('../config').spdb;
/**
 * 下单接口
 * @param userId
 * @param userPhone
 * @param card
 * @param lat
 * @param lng
 * @inheritDoc <http://doc.xiaokakeji.com:9090/index.php?s=/47&page_id=47>
 * @return {*}
 */
exports.order = function (userId, userPhone, card, lat, lng) {
    return soaApi('morder-soa/orderCreateSOAService/placeBuyCouponOrder', {
        orderType: 12,
        orderSource: config.chanelId,
        userId,
        userPhone,
        shopId: config.shopId,
        latitude: lat || 0,
        longitude: lng || 0,
        payPrice: config.price,
        goodsItems: [{
            goodsCode: config.goodsCodes[0],
            amount: 1,
            price: config.price
        }],
        features: {
            BankCardNo: card
        }
    });
};
/**
 * 判断活动资格
 * @param userId
 * @param cardNo
 * @return {Promise}
 */
exports.check = function (userId, cardNo) {
    return soaApi('marketing-core/spdbActivityService/checkQualification', userId, cardNo);
};
/**
 * 下单接口
 * @param orderId
 * @param userId
 * @param cardNo
 * @return {*}
 */
exports.pay = function (orderId, userId, cardNo) {
    return soaApi('car/tradeSoaService/doPayByUnionPay', ...arguments);
};

exports.checkStock = function () {
    return soaApi('dstock/applyCommodityStockSoaService/queryShopCommodityStockListByCommodityCodes',
        config.shopId, config.goodsCodes);
};

exports.checkExistOrder = function (userId) {
    return soaApi('morder-soa/orderCreateSOAService/selectExistOrder',
        config.shopId, userId, config.goodsCodes);
};

exports.updateCard = function (orderId, cardNo) {
    return soaApi('morder-soa/orderLogicSOAService/updateBankCardNo', orderId, cardNo);
}
;

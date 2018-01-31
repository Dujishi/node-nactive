/**
 * @description
 * @author  yinshi
 * @date 16/11/24.
 */


const soaApi = require('@server/soa-api');
const config = require('../../config');
soaApi.init(config.soaHost);
/**
 * 创建活动订单
 * @param orderInfo {Object}
 * @param orderInfo.userId  {Number|String}
 * @param orderInfo.shopId {Number|String}
 * @param orderInfo.latitude {Number|String}
 * @param orderInfo.longitude {Number|String}
 * @param orderInfo.orderSource {Number|String}
 * @param orderInfo.goodsItems {Object}
 * @param orderInfo.orderType {Number|String}
 * @param goodsInfo {Object}
 * @return {Promise}
 */
exports.createGoodsOrder = function (orderInfo, goodsInfo) {
    return soaApi('morder-soa/orderCreateSOAService/createGoodsOrder', orderInfo, goodsInfo);
};

/**
 * 获取商品是否下过单
 * @param shopId {Number} 店铺Id
 * @param userId {Number} 用户Id
 * @param goodsCodes {Array|String} 商品Code
 * @return {*}
 */
exports.selectExistOrder = function (shopId,userId,goodsCodes) {
    goodsCodes = typeof goodsCodes === 'string'?[goodsCodes]:goodsCodes
    return soaApi('morder-soa/orderCreateSOAService/selectExistOrder', shopId, userId, goodsCodes)
}
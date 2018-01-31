/**
 * @description 活动订金价格
 * @author  yinshi
 * @date 16/12/13.
 */
const soaModel = require('@server/model-soaapi');
const keys = require('../config/key');
const redis = require('@server/redis');
const response = require('@util/response-json');

module.exports = async function (userId,goodsCode) {
    if(!userId){
        return response.json_err('请先登录',-1);
    }
    if(/^\w{4,10}/.test(goodsCode) === false){
        return response.json_err('商品类型不正确',40004);
    }
    return response.json_success({
        goodsCode:goodsCode,
        price:'5000.00'
    });
    return soaModel.salePrice.getSalPriceByCode(1,goodsCode);
}
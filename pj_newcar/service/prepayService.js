/**
 * @description 支付订金接口
 * @author  yinshi
 * @date 16/12/8.
 * 判断是否预约->判断是否已经存在未支付订单->获取当前是否存在库存->进行下单->去锁库存->返回订单
 *
 */
const  response = require('@util/response-json');
const  redis = require('@server/redis');
const  keys = require('../config/key');
const  modelSoa = require('@server/model-soaapi');
const  config = require('../../config');
const queryString = require('@util/string-util/query-string');
const  message = require('../config/message');

/**
 * 付订金的接口内容
 * @param userId
 * @param goodsCode
 * @param latitude
 * @param longitude
 * @param uri
 * @return {Object}
 */
module.exports = async function (userId,goodsCode,latitude,longitude,uri) {
    const endTime = await redis.get(keys.endTime());
    const nowDate = new Date().getTime();
    const times = endTime.split('.');
    const endDate = new Date(times[0],Number(times[1])-1,times[2],times[3],times[4],times[5]).getTime();
    if(nowDate>= endDate){
        return response.json_err('ops,您来晚了，活动已经结束',40060);
    }

    //    先判断是否预约
    const isOrdered= await redis.sismember(keys.orderUser(userId),goodsCode);
    if(!isOrdered){
        return response.json_err('请先预约',40010);
    }
    //    先判断是否存在未支付订单
    const  existOrder = await modelSoa.morderSoa.selectExistOrder(1,userId,[goodsCode]);
    if(existOrder.success && existOrder.data){
        return response.json_success({
            orderId:existOrder.data,
            uri:payUri(existOrder.data,userId,uri)
        });
    }

    // 判断是否支付过
    const isPaidResult = await modelSoa.morderSoa.userOrderByGoodscode(userId,[goodsCode]);
    //如果已经支付过，则不允许下单了
    if(isPaidResult.success && isPaidResult.data[goodsCode]){
        return response.json_err('您已经支付过，不需要重复付订金哟',40030)
    }
    // 创建订单
    const orderRes = await modelSoa.morderSoa.createGoodsOrder({
        userId:userId,
        shopId:1,
        latitude:latitude,
        longitude:longitude,
        orderSource: 0,
        orderType: 16,
        packageName: '新车订金',
    },[{
        goodsCode:goodsCode,
        amount:1
    }]);
    if(orderRes.success && orderRes.data){
        orderRes.data = {
            orderId:orderRes.data,
            uri:payUri(orderRes.data,userId,uri)
        };
    }
    if(orderRes.success === false ){
        return response.json_err('ops，您下手慢了一步，已经被别人抢走啦',40070)
    }
    return orderRes
};

function payUri(orderId,userId,href) {
   return queryString.urlAppend(config.payHost + '/payaccount/jspcashier/pay', {
        orderId: orderId,
        userId: userId,
        source: 'NEW_CAR',
        callback: href
    });
}
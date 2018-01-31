/**
 * @description 预约下单
 * @author  yinshi
 * @date 16/12/8.
 */

const  response = require('@util/response-json');
const  redis = require('@server/redis');
const  keys = require('../config/key');
const soaModel = require('@server/model-soaapi');
const  message = require('../config/message')

module.exports = async function (userId,userName,phone,city,goodsCode,goodsName) {
    const endTime = await redis.get(keys.endTime());
    const nowDate = new Date().getTime();
    const times = endTime.split('.');
    const endDate = new Date(times[0],Number(times[1])-1,times[2],times[3],times[4],times[5]).getTime();
    if(nowDate>= endDate){
        return response.json_err('ops,您来晚了，活动已经结束',40060);
    }
    if(!userId){
        return response.json_err('请先登录',-1)
    }
    if(!userName || !userName.trim()){
        return response.json_err('姓名不能为空',40001);
    }
    if(/^1[34578]\d{9}$/.test(phone) === false){
        return response.json_err('手机号格式不正确',40002)
    }
    if(!city){
        return response.json_err('请输入城市',40003)
    }
    if(/^\w{6,10}$/.test(goodsCode) === false || !goodsName){
        return response.json_err('请选择合适商品进行预约',40004)
    }
    const data = {
        userId,
        userName,
        phone,
        city,
        goodsCode,
        goodsName,
        createTime:new Date().toString()
    };
    const dataStr = JSON.stringify(data);
    // 添加用户预约code集合
    await redis.sadd(keys.orderUser(userId),goodsCode);
    // 设置用户预约车辆信息填写的集合
    await redis.hmset(keys.userMess(userId),goodsCode,dataStr);
    // 添加商品预约的信息
    await redis.sadd(keys.order(goodsCode),dataStr);
    console.log('预约信息：',dataStr);

    //发送短信
    soaModel.platform.sendMessageService.sendMessage(phone, message.order(goodsName))
        .then(data=>{
            console.log('发送短信记录',phone, message.order(goodsName));
        }).catch(e=>{
            console.error(e)
    });
    return response.json_success('预约成功');
};


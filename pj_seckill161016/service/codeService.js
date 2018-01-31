/**
 * @description 发送验证码的service
 * @author  yinshi
 * @date 16/10/18.
 */



const userModel=require('../model/user');
const util = require('../utils');

const  config = require('../../config');

/**
 * 发送验证码的服务
 * @param phone {string} 手机号
 * @param notifyType {number} 发送格式
 * @return {*}
 */
module.exports=async function (phone,notifyType) {
    if(!util.isPhone(phone)){ //验证手机号
        return util.jsonError(401,'手机号格式不正确')

    }
    const result= await   userModel.preLogin({
        phone,
        notifyType
    });

    if(result.success){
        result.data=config.env=='prod'?'':result.data
    }
    return result;
};
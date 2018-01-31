/**
 * @description
 * @author  yinshi
 * @date 16/10/18.
 */



const userModel=require('../model/user');
const util = require('../utils');

const  config = require('../../config');

const redis= require('../utils/seckill_redis');
const soaApi = require('@server/soa-api');

module.exports=async function (ctx,phone,openId,code) {
      if(!util.isPhone(phone)){
          return util.jsonError(401,'手机号格式不正确')
      }

    const userInfo= await   userModel.login({phone,code});

    // if(result.success){
    //     redis.hmset(config.openidRedisKey(openid),{
    //         phone,
    //         userId:result.data.userId,
    //         token:result.data.token
    //     });
    //     result.data=''
    // }

    if (userInfo.success) {
        ctx.session.userId = userInfo.data.userId;

    }

    //如果是微信，进行账户绑定
    if (util.iswechat && openId && userInfo.success) {
        let appType = 3;

        let bindStatus = await soaApi("platform/userWechatOpenIdSOAService/bindingByPhone", openId, phone, appType);

        //打印错误
        if (!bindStatus.success) {
            console.error(bindStatus)
        }
    }

    return userInfo
};
/**
 * @description 秒杀聚合
 * @author  yinshi
 * @date 16/10/18.
 */

const  redisKey=require('../config');

const util = require('../utils');

const  config = require('../../config');
const  redis=require('../utils/seckill_redis');



const qualificationService= require('./qualificationService');

const  resultService = require('./resultService');

module.exports=async function (activeName,openid,userId) {
    const startTime= await redis.hget(redisKey.redis.active(activeName),'start_time');
    if(!startTime){
        return util.jsonError(404,'当前活动不存在');
    }
    const  now = new Date().getTime();
    const  leaveTime= startTime-now;


    // if(!openid && !userId ){
    //     return util.jsonError(-1,'请先登录',{
    //         timestamp:now
    //     })
    // }

    //判断有没有人参加活动
    // const hasJoin=await redis.isExist(redisKey.redis.joinuser(activeName));
    const stock= await redis.isExist(redisKey.redis.stock(activeName));

    // if(hasJoin){
        //    判断活动是否结束

        if(!stock){
            return await resultService(activeName,leaveTime,userId);
        }
    // }






    if(!userId){ //如果userid为空的情况下
        return util.jsonError(-1,'请先登录',{
            timestamp:now
        });
    }

    if(leaveTime>0){ //如果活动没开始的时候
        return await qualificationService(activeName,userId,now);
    }



    if(stock){
        //判断是否已经秒杀过,目前只支持一个判断。搓得很，todo 秒杀过判断
        // const accUserId=await redis.lindex(redisKey.redis.accessuser(activeName),0);
        // if(accUserId == userId){
        //     //否则返回结果页面
        //     return resultService(activeName,leaveTime,userId);
        // }

        //如果库存还在并且是白名单用户，则返回还在活动动作。

        const hasWhite =   await redis.scard(redisKey.redis.whitelist(activeName));

        if(hasWhite){//如果存在白名单的话
            const inWhite = await redis.sismember(redisKey.redis.whitelist(activeName),userId);
            if(inWhite ){
                return util.jsonSuccess({
                    status:1,
                    qualified:true,
                    timestamp:now
                })
            }
        }else{ //如果不存在白名单，并且满足资格用户
            const qualified= await redis.sismember(redisKey.redis.qualified(activeName),userId);
            if(qualified){ //活动开始
                return util.jsonSuccess({
                    status:1,
                    qualified:true,
                    timestamp:now
                })
            }
        }
    }

    //否则返回结果页面
    return resultService(activeName,leaveTime,userId);

};
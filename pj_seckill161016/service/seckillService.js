/**
 * @description  秒杀事件处理
 * @author  yinshi
 * @date 16/10/18.
 */


const  redis=require('../utils/seckill_redis');
const  redisKey=require('../config');
const  util=require('../utils');
const  config = require('../../config');

const  dealSeckillService= require('./dealSeckillService');
/**
 *
 * @param activeName
 * @param openid
 * @param userid
 * @return {*}
 */
module.exports=async function (activeName,openid,userId) {
    const starttime= await redis.hmget(redisKey.redis.active(activeName),'start_time');
    const  now = new Date().getTime();
    const  leaveTime= starttime-now;

    if(leaveTime>0){ //验证是否开始
        return util.jsonError(4001,'活动尚未开始');
    }
    // const  userId =openid? await redis.hget(config.openidRedisKey(openid),'userId')
    //     : userid;

    if(!userId){
        return util.jsonError(-1,'请先登录');
    }
    const quatified= await redis.sismember(redisKey.redis.qualified(activeName),userId);

    if(!quatified){ //不满足资格的话
        return util.jsonError(4002,'抱歉，您没有参加秒杀的资格哦');
    }
    //添加参与活动的用户
    redis.zadd(redisKey.redis.joinuser(activeName),userId,new Date().getTime());

    const  whiteListLen= await redis.isExist(redisKey.redis.whitelist(activeName));

    let status;
    if(whiteListLen){

        status = await redis.sismember(redisKey.redis.whitelist(activeName),userId);

        if(!status){

            return util.jsonError(4003,'宝贝已经被抢啦，没关系，还有下次哦');
        }
    }





    const result=await dealSeckillService(activeName,userId);

    if(result){
        return util.jsonSuccess({
            msg:'秒杀成功'
        });
    }

    return util.jsonError(4004,'宝贝已经被抢啦，没关系，还有下次哦')


};


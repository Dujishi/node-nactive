/**
 * @description 中奖结果查询
 * @author  yinshi
 * @date 16/10/18.
 */

const  redisKey=require('../config');

const  util=require('../utils');

const  config = require('../../config');
const  redis=require('../utils/seckill_redis');
const userModel=require('../model/user');


const  dealSeckillService= require('./dealSeckillService');
module.exports=async function (activeName,leaveTime,myUserid) {



    let  userId= await redis.lindex(redisKey.redis.accessuser(activeName),0);

    if(!userId){ //如果还未秒杀成功。
        //如果秒杀开始一分钟内的话
        if(leaveTime>-10*1000){
            return util.jsonError(500,'系统忙不过来了，请稍后再试哦');
        }

        const userIdPromise=  redis.srandmember(redisKey.redis.whitelist(activeName));
        const stockPromise=   redis.lindex(redisKey.redis.stock(activeName),0);
        userId=await userIdPromise;
        const stock = await stockPromise;
        if(userId && await stock){

            const result = await  dealSeckillService(activeName,userId);

            if(!result){ //如果同步添加失败的话，就重新获取内容
                userId = await redis.lindex(redisKey.redis.accessuser(activeName),0);
            }

        }

    }
    let cacheUserInfo=await redis.hgetall(redisKey.redis.accessuserinfo(activeName,userId));

    if(!cacheUserInfo){ //获取缓存的数据内容
        const userInfo = await userModel.getUserInfoById(userId);
        if(userInfo.success){
            cacheUserInfo=userInfo.data;
            // cacheUserInfo = {phone: 10112340010}

            redis.hmset(redisKey.redis.accessuserinfo(activeName,userId),cacheUserInfo);
        }
    }


    const productName= await redis.hget(redisKey.redis.product(activeName),'product');

    return util.jsonSuccess({
        status:2,
        phone:util.hidePhone(cacheUserInfo.phone),
        product:productName,
        stock:1,
        isme: myUserid == userId
    })




};

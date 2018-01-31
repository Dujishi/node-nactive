/**
 * @description 处理秒杀的业务逻辑
 * @author  yinshi
 * @date 16/10/19.
 */

const  redis=require('../utils/seckill_redis');
const  redisKey=require('../config');
// const redis_lock  = require('../../lib/redis_lock');
/**
 * 秒杀活动处理
 * @param activeName
 * @param userId
 * @return {Promise}
 */
module.exports=async function (activeName, userId) {

    // let   lock = await redis_lock.lock(redisKey.redis.stock(activeName), 500) ;

    const stock= await redis.lpop(redisKey.redis.stock(activeName));
    let result;
    if(stock){
        result= await redis.lpush(redisKey.redis.accessuser(activeName),userId)
    }
    // lock.unlock(function (err) {
    //     if (err) {
    //         console.error(err);
    //     }
    // });

    return result;

}
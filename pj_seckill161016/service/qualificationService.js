/**
 * @description 资格查询
 * @author  yinshi
 * @date 16/10/18.
 */



const  redis=require('../utils/seckill_redis');

const  redisKey=require('../config');

const  util=require('../utils');

const  config = require('../../config');
module.exports=async function (activeName,userId,now) {

    const  qualified=await redis.sismember(redisKey.redis.qualified(activeName),userId)

    return util.jsonSuccess({
        qualified:!!qualified,
        timestamp:now,
        status:0
    });







};
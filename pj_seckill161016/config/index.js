/**
 * @description
 * @author  yinshi
 * @date 16/10/17.
 */


module.exports={
    redis:{//redis键值
        //活动名称
        active(activeName){
            return 'seckill:active:'+activeName
        },
        //产品信息
        product(activeName){
            return 'seckill:product:'+activeName
        },
        rule(activeName){
            return 'seckill:rule:'+activeName
        },
        //白名单信息
        whitelist(activeName){
            return 'seckill:whitelist:'+activeName
        },
        //满足资格用户
        qualified(activeName){
            return 'seckill:qualified:'+activeName
        },
        //秒杀用户列表
        accessuser(activeName){
            return 'seckill:accessuser:'+activeName
        },
        //库存量
        stock(activeName){
            return 'seckill:stock:'+activeName
        },
        //秒杀用户信息详情表
        accessuserinfo(activeName,userId){
            return 'seckill:accessuserinfo:'+userId
        },
        joinuser(activeName){
            return 'seckill:joinuser:'+activeName
        }
    }

}
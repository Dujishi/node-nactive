/**
 * @description
 * @author  yinshi
 * @date 16/12/8.
 */


const prefix = 'sellNewCar';
module.exports={
    /**
     * 推荐车辆集合
     * @return {string}
     */
    recommend(){
        return `${prefix}:recommend`
    },
    /**
     * 商品预约信息集合
     * @param goodCode
     * @return {string}
     */
    order(goodCode){
        return `${prefix}:order:${goodCode}`
    },
    /**
     * 用户填写的资料集合
     * @param userId
     * @return {string}
     */
    userMess(userId){
        return `${prefix}:userMess:${userId}`
    },
    /**
     * 用户预约的信息集合，set goodCode
     * @param userId
     * @return {string}
     */
    orderUser(userId){
        return `${prefix}:orderUser:${userId}`
    },
    /**
     * 用户想要的车辆集合，以手机号为维度，不是以userid，
     * Hash filed:value = phone:Json{userId,carModel,phone,city,createTime,userName}
     * @return {string}
     */
    wanted(){
        return `${prefix}:wanted`
    },
    cacheRecommend(){
        return `cache:${prefix}:recommendList`
    },
    cacheProductsList(){
        return `cache:${prefix}:products`
    },
    cacheProducts(){
        return `cache:${prefix}:productobj`
    },
    endTime(){
        return `${prefix}:endTime`
    }
}
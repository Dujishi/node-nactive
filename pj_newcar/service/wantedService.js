/**
 * @description 想要的车型选择
 * @author  yinshi
 * @date 16/12/8.
 */

const  response = require('@util/response-json');
const  redis = require('@server/redis');
const  keys = require('../config/key')

/**
 * 想要的车型预约信息
 * @param options {Object} 车型信息
 * @param options.userId {Number} 用户ID
 * @param options.userName {String} 用户Name
 * @param options.phone {Number|String}  用户手机号
 * @param options.city {String}  用户所在城市
 * @param options.modelName {String} 用户预约车型名称
 * @param options.modelId {Number}  用户预约车型ID
 * @return {*}
 */
module.exports = async function (options) {
    // if(!options.userId){
    //     return response.json_err('请先登录',-1)
    // }
    if(!options.userName || !options.userName.trim()){
        return response.json_err('姓名不能为空',40001);
    }
    if(/^1[34578]\d{9}$/.test(options.phone) === false){
        return response.json_err('手机号格式不正确',40002)
    }
    if(!options.city){
        return response.json_err('请输入城市',40003)
    }

    if(options.modelName === '' || /^\d{1,10}$/.test(options.modelId) === false){
        return response.json_err('请选择车型',40005)
    }
    options.createTime = new Date().toString();
    console.log('提交个人资料',JSON.stringify(options))
    await redis.hmset(keys.wanted(),options.phone,JSON.stringify(options));
    return response.json_success('提交成功');
};

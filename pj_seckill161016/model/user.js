/**
 * @description 用户中心SOA数据中心
 * @author  yinshi
 * @date 16/9/22.
 * @version 0.0.1
 * @todo 测试接口的正确与否，未写参数说明的未进行测试
 */

const soaApi = require('@server/soa-api');
// const  config  =require('../config');
const appType = 3;

/**
 * 对参数添加appType字段。
 * @param options
 * @return {*}
 */
function addAppType(options) {
    options.appType=appType;
    return options
}
//数据的基本路径。该model均基于此
const uriNameSpace= (path)=> 'platform/userCenterService/'+path;

/**
 * 预登录接口
 * @module user/proLogin
 * @param {Object} proLoginParams - 预登陆需要的信息
 * @param {String} proLoginParams.phone - 预登陆的手机号
 * @param {Number} proLoginParams.notifyType - 通知类型
 * @return {Promise} 返回的具体结果
 */
exports.preLogin = (proLoginParams)=> soaApi(
    uriNameSpace('preLogin'),addAppType(proLoginParams));


/**
 * 登录接口
 * @param  {Object} loginParams  - 登录参数
 * @param {String} loginParams.phone - 登录所用手机号
 * @param {String} loginParams.code - 登录code。
 * @return {Promise} 返回的具体结果
 */
exports.login= (loginParams)=> soaApi(
    uriNameSpace('login'),addAppType(loginParams))
;

/**
 * 根据手机号获取用户的信息
 * @param {String} phone - 获取用户信息的手机号
 * @return {Promise} 返回的具体结果
 */
exports.getUserInfoByPhone= (phone)=> soaApi(
    uriNameSpace('getUserInfoByPhone'),phone,appType);


/**
 * 根据userid获取用户基本信息
 * @param userId
 */
exports.getUserInfoById= (userId)=> soaApi(
    uriNameSpace('getUserInfoById'),userId,appType);

/**
 * 根据用户id列表批量获取用户的基本信息
 * @param userIds
 */
exports.getUserBase= (userIds)=> soaApi(
    uriNameSpace('getUserBase'),userIds,appType);


/**
 * 保存用户基本信息
 * @param userInfos
 * @param userInfos.userId
 * @param userInfos.name
 * @param userInfos.avatar
 */
exports.saveUserInfo= (userInfos)=> soaApi(
    uriNameSpace('SaveUserInfo'),addAppType(userInfos));


/**
 * 踢用户下线
 * @param phone
 */
exports.pickUserOffline= (phone)=> soaApi(
    uriNameSpace('pickUserOffline'),phone,appType);


/**
 * 修改用户的绑定的手机号信息
 * @param userId
 * @param newPhone
 * @param message
 */
exports.changeUserBindPhone= (userId, newPhone, message) => soaApi(
    uriNameSpace('changeUserBindPhone'),...arguments,appType);

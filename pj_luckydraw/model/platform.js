/**
 * @description
 * @author  yinshi
 * @date 16/11/26.
 */


const soaApi = require('@server/soa-api');
// const config = require('../../config');
// soaApi.init(config.soaHost);

exports.getUseridByOpenid = function (openid) {
    return soaApi('platform/userWechatOpenIdSOAService/getUserId', openid);
};


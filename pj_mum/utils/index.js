const wechatUser = require('@server/wechat/lib/user');

const getKey = getRedisKey('mum');

/**
 * @example
 * const getKey = getRedisKey('vip20160720');
 * const key = getKey('openid', 123455);
 */
function getRedisKey(k) {
    return (...args) => {
        args.unshift(k);
        return args.join(':');
    };
}

/**
 * 获取微信用户信息
 * @param  {string} openid
 */
async function getWechatUserInfo(openid) {
    const userInfo = await wechatUser.getUserInfo(openid);
    if (userInfo.headimgurl && userInfo.headimgurl.indexOf('http://') > -1) {
        userInfo.headimgurl = userInfo.headimgurl.replace('http://', 'https://');
    }
    return userInfo;
}

module.exports = {
    getKey,
    getWechatUserInfo
};

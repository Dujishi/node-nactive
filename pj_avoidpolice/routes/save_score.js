const validation = require('@util/validation');
const response = require('@util/response-json');
const redis = require('@server/redis');
const soaApi = require('@server/soa-api');
const utils = require('../utils');

exports.post = async function (ctx) {
    const body = ctx.request.body;
    const score = body.score;
    const sign = body.sign;
    const rankId = utils.getRankId();
    const isapp = validation.isApp(ctx.headers);
    const salt = 'xiaoka';
    let phone = ctx.session.phone;

    if (isapp) {
        phone = body.phone;
    }

    if (!phone) {
        ctx.body = response.json_err('当前用户未登录', -1);
        return;
    }

    if (!validation.isPhone(phone)) {
        ctx.body = response.json_err('手机号码格式错误');
        return;
    }

    if (!utils.isNumber(score)) {
        ctx.body = response.json_err('游戏分数格式错误');
        return;
    }

    if (!sign) {
        ctx.body = response.json_err('请求异常');
        return;
    }

    // 校验分数是否被篡改过
    if (utils.getSign(score, salt) !== sign) {
        ctx.body = response.json_err('请求异常');
        return;
    }

    const redisKey = utils.getKey('phone', phone);
    const userInfoObj = await redis.hgetall(redisKey) || {};
    let avatar = '';

    // 存储头像等基本信息
    // if (!userInfoObj.phone) {
    if (!userInfoObj.avatar) {
        const isapp = validation.isApp(ctx.headers);
        const iswechat = validation.isWechat(ctx.headers);

        if (isapp) {
            const getUserInfoSoaRet = await soaApi('platform/userCenterService/getUserInfoByPhone', phone, 1);
            if (getUserInfoSoaRet.success) {
                if (getUserInfoSoaRet.data && getUserInfoSoaRet.data.avatar) {
                    avatar = getUserInfoSoaRet.data.avatar;
                }
            }
        }

        if (iswechat && ctx.session.wechatUserInfo) {
            avatar = JSON.parse(ctx.session.wechatUserInfo).headimgurl;
        }

        userInfoObj.phone = phone;
        userInfoObj.avatar = avatar;
    }

    const scoreKey = `score_${rankId}`;

    // 存储分数
    if (typeof userInfoObj[scoreKey] === 'undefined' || Number(score) > Number(userInfoObj[scoreKey])) {
        userInfoObj[scoreKey] = score;
        await redis.hmset(redisKey, userInfoObj);
        const rank = utils.getRank(rankId);
        // 这里加上.Date.now是因为希望按时间排序，默认是按字典排序的
        await rank.add(`${score}.${Date.now()}`, phone);
    }

    ctx.body = {
        success: true,
        data: {}
    };
};

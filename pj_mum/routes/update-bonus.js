const soaApi = require('@server/soa-api');
const validation = require('@util/validation');
const redis = require('@server/redis');
const utils = require('../utils');
const bonusUpdateService = require('../services/bonus-update-service');
const { goodsList, scoreList } = require('../config');


exports.post = async function (ctx) {
    const body = ctx.request.body;
    const bonusId = body.bonusId;
    const code = body.code;
    const score = Number(body.score);
    const userId = ctx.session.userId;
    const openId = ctx.session.openid;
    const isWechat = validation.isWechat(ctx.headers);

    if (!code || !goodsList[code] || !bonusId || scoreList.indexOf(score) === -1) {
        ctx.body = {
            success: false,
            message: '参数有误',
        };
        return;
    }

    const amount = goodsList[code][`friends${score}`] || 0;


    // const soaResp = {
    //     success: true,
    //     data: {
    //         bonusId: 1,
    //         amount,
    //     }
    // };

    const redisKey = utils.getKey(`bonusId:${bonusId}`);
    // const redisKey = utils.getKey(`userId:${userId}:${code}`);
    const friendsInfo = await redis.hgetall(redisKey);
    let friends = friendsInfo.friends;
    let avatar = '';
    if (friends) {
        friends = JSON.parse(friends);
    } else {
        friends = [];
    }

    if (friends.length < 5) {
        if (isWechat && openId) {
            let wechatUserInfo = null;
            if (ctx.session.wechatUserInfo) {
                wechatUserInfo = JSON.parse(ctx.session.wechatUserInfo);
            } else {
                wechatUserInfo = await utils.getWechatUserInfo(openId);
            }
            console.log('========= wechatUserInfo =========');
            console.log(wechatUserInfo);
            avatar = wechatUserInfo.headimgurl;
        }
        friends.push({
            avatar: avatar,
            amount: amount,
            userId,
        });
        friendsInfo.friends = JSON.stringify(friends);
    }

    await redis.hmset(redisKey, friendsInfo);

    const soaResp = await bonusUpdateService(bonusId, amount);

    ctx.body = soaResp;
};

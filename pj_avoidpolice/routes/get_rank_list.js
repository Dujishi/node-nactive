const redis = require('@server/redis');
const utils = require('../utils');
const validation = require('@util/validation');
const config = require('../../config');

exports.post = async function (ctx) {
    const body = ctx.request.body;
    const phone = ctx.session.phone || body.phone;
    const page = body.page;

    const rankId = utils.getRankId();
    const rankList = utils.getRank(rankId);

    const total = await rankList.getTotal();
    const totalPage = await rankList.getTotalPage();
    let data = await rankList.getData(page);

    data = utils.formatScore(data, rankId);

    let rank = '';
    let score = '';
    let avatar = '';
    let userId = '';

    if (validation.isPhone(phone)) {
        const redisKey = utils.getKey('phone', phone);
        const userInfoObj = await redis.hgetall(redisKey);
        const scoreKey = `score_${rankId}`;

        if (userInfoObj) {
            rank = await rankList.getIndex(phone);
            score = userInfoObj[scoreKey] || '';
            avatar = userInfoObj.avatar;
        }

        if (config.env !== 'prod') {
            userId = ctx.session.userId;
        }
    }

    ctx.body = {
        success: true,
        data: {
            total,
            totalPage,
            rank,
            score,
            phone,
            userId,
            avatar,
            data,
        }
    };
};

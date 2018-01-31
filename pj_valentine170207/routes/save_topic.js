const response = require('@util/response-json');
const redis = require('@server/redis');
const utils = require('../utils');

exports.post = async function(ctx, next) {
    const body = ctx.request.body;
    const player = body.player;
    const results = body.results;
    const askerOpenid = body.asker || '';
    const openid = body.openid;

    if (!results) {
        ctx.body = response.json_err('未获取到答题结果');
        return;
    }

    // 出题者模式
    if (player === 'asker') {
        await redis.hmset(utils.redisKey(`openid:${openid}`), {
            topics: results,
        });
        ctx.body = response.json_success();
        return;
    }

    // 答题者模式
    if (player === 'answerer') {
        const askerInfo = await redis.hgetall(utils.redisKey(`openid:${askerOpenid}`));
        const matchList = utils.getMatchList(askerOpenid);
        const matchScore = utils.getMatchScore(askerInfo.topics, results);
        const data = {};

        data[askerOpenid] = matchScore;
        if (matchScore == 100) {
            const isFirst = await redis.isExist(utils.redisKey(`openid:${askerOpenid}:firstmatch`));
            if (!isFirst) {
                await redis.set(utils.redisKey(`openid:${askerOpenid}:firstmatch`), openid);
            }
        }

        await matchList.add(matchScore, openid);

        await redis.hmset(utils.redisKey(`openid:${openid}`), data);

        ctx.body = {
            success: true,
            data: {
                matchScore,
            }
        };
    }
};

const redis = require('@server/redis');
const utils = require('../utils');
const _ = require('lodash');

module.exports = async function (ctx, openid, type, asker, answerer, isPlay) {
    let retData = {};
    if (isPlay) {
        const matchList = utils.getMatchList(openid);
        let firstMatchData = {};
        const asker100Openid = await redis.get(utils.redisKey(`openid:${openid}:firstmatch`));
        if (asker100Openid) {
            firstMatchData = await redis.hgetall(utils.redisKey(`openid:${asker100Openid}`));
        }
        const data = await matchList.getData(1);


        data.forEach((v, i) => {
            data[i].score = v[openid];
        });
        retData.matchList = data;
        retData.firstMatchData = firstMatchData;
    }

    if (type === '1' && openid != asker) {
        const askerInfo = await redis.hgetall(utils.redisKey(`openid:${asker}`));
        retData = _.assign({
            askerInfo,
        }, retData);
    } else if (type === '2') {
        const askerInfo = await redis.hgetall(utils.redisKey(`openid:${asker}`));
        const answererInfo = await redis.hgetall(utils.redisKey(`openid:${answerer}`));

        console.log('======= askerInfo and answererInfo========')
        console.log(askerInfo)
        console.log(answererInfo)

        retData = _.assign({
            askerInfo,
            answererInfo,
        }, retData);
    }

    return retData;
};

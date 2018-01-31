const redis = require('@server/redis');
const utils = require('../utils');

const users = [
    {
        phone: '10112348001',
        avatar: '',
        score: 160,
    },
    {
        phone: '10112348002',
        avatar: '',
        score: 150,
    },
    {
        phone: '10112348003',
        avatar: '',
        score: 140,
    },
    {
        phone: '10112348004',
        avatar: '',
        score: 130,
    },
    {
        phone: '10112348005',
        avatar: '',
        score: 120,
    },
];

const rankId = utils.getPrevRankId();

users.forEach(async function(v) {
    const phone = v.phone;
    const score = v.score;
    const redisKey = utils.getKey('phone', phone);
    const userInfoObj = {
        phone: v.phone,
        avatar: v.avatar,
    };
    userInfoObj[`score_${rankId}`] = v.score;
    await redis.hmset(redisKey, userInfoObj);
    const rank = utils.getRank(rankId);
    await rank.add(score, phone);
});

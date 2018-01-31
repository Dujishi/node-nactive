const redis = require('@server/redis');
const utils = require('../utils');

const openid = 'oP0_Zt33GnXdjjPHlGcCyo5lFq0E';
const matchList = utils.getMatchList(openid);

const answerers = [
    {
        headimgurl: 'https://wx.qlogo.cn/mmhead/vPIORgnsM3aBDibELQBjMJ54d342Gh9FibiaS4GHELe5uQ/0',
        nickname: '测试',
        openid: '10000',
        score: 100
    },
    {
        headimgurl: 'https://wx.qlogo.cn/mmhead/vPIORgnsM3aBDibELQBjMJ54d342Gh9FibiaS4GHELe5uQ/0',
        nickname: '测试1',
        openid: '10001',
        score: 100
    },
    {
        headimgurl: 'https://wx.qlogo.cn/mmhead/vPIORgnsM3aBDibELQBjMJ54d342Gh9FibiaS4GHELe5uQ/0',
        nickname: '测试2',
        openid: '10002',
        score: 80
    },
    {
        headimgurl: 'https://wx.qlogo.cn/mmhead/vPIORgnsM3aBDibELQBjMJ54d342Gh9FibiaS4GHELe5uQ/0',
        nickname: '测试3',
        openid: '10003',
        score: 60
    },
    {
        headimgurl: 'https://wx.qlogo.cn/mmhead/vPIORgnsM3aBDibELQBjMJ54d342Gh9FibiaS4GHELe5uQ/0',
        nickname: '测试4',
        openid: '10004',
        score: 60
    },
    {
        headimgurl: 'https://wx.qlogo.cn/mmhead/vPIORgnsM3aBDibELQBjMJ54d342Gh9FibiaS4GHELe5uQ/0',
        nickname: '测试5',
        openid: '10005',
        score: 40
    },
    {
        headimgurl: 'https://wx.qlogo.cn/mmhead/vPIORgnsM3aBDibELQBjMJ54d342Gh9FibiaS4GHELe5uQ/0',
        nickname: '测试6',
        openid: '10006',
        score: 20
    },
    {
        headimgurl: 'https://wx.qlogo.cn/mmhead/vPIORgnsM3aBDibELQBjMJ54d342Gh9FibiaS4GHELe5uQ/0',
        nickname: '测试7',
        openid: '10007',
        score: 0
    },
];

answerers.forEach((v) => {
    redis.hmset(utils.redisKey(`openid:${openid}`), {
        headimgurl: v.headimgurl,
        nickname: v.nickname,
        openid: v.openid,
    });

    matchList.add(v.score, v.openid);
});

module.exports = {
    signKey: 'superupkeep',
    isViewRedisKey: (userid, openid) => `superupkeep:${userid}:${openid}`,
    totalViewRedisKey: userid => `superupkeep:${userid}:viewcounts`,
    startTime: '2016-12-24 00:00:00',
    endTime: '2017-01-03 23:59:59',
};

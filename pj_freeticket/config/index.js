module.exports = {
    signKey: 'freeticket',
    isViewRedisKey: (userid, openid) => `freeticket:${userid}:${openid}`,
    totalViewRedisKey: userid => `freeticket:${userid}:viewcounts`,
    startTime: '2016-12-24 00:00:00',
    endTime: '2017-01-03 23:59:59',
};
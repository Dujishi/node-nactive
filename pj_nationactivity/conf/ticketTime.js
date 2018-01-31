let time = {
    prod: {
        start: '2016-11-25 00:00:00',
        end: '2016-11-25 23:59:59'
    },
    int: {
        start: '2016-11-24 00:00:00',
        end: '2016-11-24 23:59:59'
    }
}

module.exports = function(env) {
    // 微信公众号只有prod和last配置
    return time[env] || time.int;
}
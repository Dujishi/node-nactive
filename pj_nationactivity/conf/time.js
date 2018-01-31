let time = {
    prod: '2016-11-19 00:00:00',
    int: '2016-11-14 00:00:00',
    intc: '2016-11-14 00:00:00'
}

module.exports = function(env) {
    // 微信公众号只有prod和last配置
    return time[env] || time.int;
}
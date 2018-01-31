const config = {
    prod: {
        host: '10.10.42.169',
        port: 6379,
    },
    pre: {
        host: '10.10.42.169',
        port: 6379,
    },
    int: {
        host: '192.168.1.202',
        port: 6379,
    },
    dev: {
        host: '127.0.0.1',
        port: 6379,
    },
    pt: { // 压测环境
        host: '192.168.1.54',
        port: 6379,
    },
    seckill: {
        host: '10.10.42.169',
        port: 6379
    },
};

module.exports = (env) => {
    return config[env] || config.int;
};

const config = {
    prod: '10.10.227.55:9092,10.10.45.171:9092,10.10.45.171:9093',
    pre: '10.10.227.55:9092,10.10.45.171:9092,10.10.45.171:9093',
    int: '192.168.1.92:9092'
};
module.exports = function (env) {
    return config[env] || config.int;
};

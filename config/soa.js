// dev环境的soa地址需要开发者根据测试环境配置
const config = {
    prod: 'http://soa.agent.ddyc.c791ba1a6255yg.custom.ucloud.cn:8086/soa/',
    pre: 'http://10.10.8.113:8188/soa/',
    int: 'http://int.xiaokakeji.com:8091/soa/',
    intb: 'http://192.168.1.93:8188/soa/',
    inta: 'http://192.168.1.92:8188/soa/',
    intc: 'http://192.168.1.90:8188/soa/',
};

module.exports = function (env) {
    // 微信公众号只有prod和last配置
    return config[env] || config.int;
};


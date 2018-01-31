// dev环境的soa地址需要开发者根据测试环境配置
const config = {
    prod: 'http://openapi.ddyc.com/',
    pre: 'http://10.10.8.19:8382/',
    inta: 'http://inta.xiaokakeji.com:8090/open/',
    intb: 'http://intb.xiaokakeji.com:8090/open/',
    intc: 'http://intc.xiaokakeji.com:8090/open/',
    intd: 'http://intd.xiaokakeji.com:8090/open/',
    int: 'http://int.xiaokakeji.com:8091/open/',
    // inta:'http://192.168.1.91:8382/open/',
    // intb:'http://192.168.1.93:8382/open/',
    // intc:'http://192.168.1.90:8382/open/',
    // intd:'http://192.168.1.211:8382/open/',
    // int:'http://192.168.1.91:8382/open/',
    alex: 'http://192.168.51.162:8080/open/',
};

module.exports = function (env) {
    // 微信公众号只有prod和last配置
    const open = {
        key: 'open-h5',
        secret: '8ACFGDSVRN1UC6A6QR4TJBJOIBKMSXBF',
    };
    open.host = config[env] || config.int;
    return open;
};

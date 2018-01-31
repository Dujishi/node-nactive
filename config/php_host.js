// dev环境的soa地址需要开发者根据测试环境配置
const config = {
    prod: 'http://inner.activity-api.ddyc.com',
    pre: 'http://10.10.40.195:8085',
    int: 'http://192.168.1.203:8587/',
    // int  : 'http://new-activity-api.ddyc.com',
    dev: 'http://192.168.10.55:20089'
};

module.exports = env => config[env] || config.dev;

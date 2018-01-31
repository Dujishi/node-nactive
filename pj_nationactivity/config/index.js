const path = require('path');

let env = process.argv[2] || 'intc'; // dev / prod / last
const root = path.join(__dirname, '../../');
env = env === 'prod' ? env : 'intc';

module.exports = {
    port: 3002,
    env,
    pathPrefix: '/nactive', // 项目在 int-m.ddyc.com中的路径前缀
    project: 'pj_',
    root,
    wechat: {},
    redis: require('../../config/redis')(env),
    soaHost: require('../../config/soa')(env),
    payHost: require('../../config/pay')(env),
    phpHost: require('../../config/php_host')(env)
}
;
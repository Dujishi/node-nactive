const path = require('path');
const config = require('@server/config');

// @server/config 会自动读取 NODE_ENV 的环境变量
const port = process.env.NODE_PORT || 3002;
const root = path.join(__dirname, '../');
config.set({
    port,
    pathPrefix: '/nactive', // 项目在 int-m.ddyc.com中的路径前缀
    project: 'pj_',
    root,
});

module.exports = config.getAll();

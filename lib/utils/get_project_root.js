const config = require('../../config');
/**
 * 根据 __dirname 获取项目根路径, 建议缓存该值
 */
module.exports = function (dir) {
    dir = dir.replace(config.root , '');
    return '/'+dir.split('/')[0];
}
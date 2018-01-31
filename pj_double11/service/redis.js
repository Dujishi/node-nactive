const redis = require('@server/redis');

const prefx = 'node_double11:';
const normalTimeKey = 'ntime';
const signRecordKey = 'sign:';

/**
 * 获取时间
 */
exports.getNormalTime = () => redis.get(`${prefx}${normalTimeKey}`);


/**
 * 记录报名
 */
exports.signRecord = (userId, phone) => redis.set(`${prefx}${signRecordKey}${userId}`, phone);


/**
 * 查询记录
 */
exports.queryRecord = userId => redis.get(`${prefx}${signRecordKey}${userId}`);


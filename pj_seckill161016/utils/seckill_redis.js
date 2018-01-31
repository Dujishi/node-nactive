/**
 * document https://github.com/NodeRedis/node_redis
 * redis常用操作封装
 */
const redis = require('redis');
const  env = require('../../config').env;
const redisConfig = require('../../config/redis');

const  config = redisConfig(env === 'prod'?'seckill':env);
// 从config中获取redis配置文件
// 可以根据不同的环境连接不同的redis数据库
let client = redis.createClient(config.port, config.host);

// console.log(config)

// let namespace = 'node_wechat';

// function getFullKey(key) {
//     return `${namespace}:${key}`;
// }

client.on('error', function(err) {
    redis.print(err);
});

function createPromise(command) {
    return function() {
        const arr = arguments;

        return new Promise(function(resolve, reject) {
            client[command].call(client, ...arr, function(err, reply) {
                if (err) {
                    reject(err)
                } else {
                    resolve(reply);
                }
            });
        })
    }

}
exports.redis = redis;
exports.client = client;



exports.del = createPromise("DEL");
exports.get = createPromise("GET");
exports.set = createPromise("SET");
exports.hget = createPromise('HGET');

exports.hmset = createPromise("HMSET");
/**
 * @param key  {string}
 * @param field {string}
 * @return {Promise}
 */
exports.hmget = createPromise('HMGET');

/**
 * @param key  {string}
 * @param member {string}
 * @return {Promise}
 */
exports.sismember = createPromise('SISMEMBER');
exports.smembers = createPromise('SMEMBERS');
/**
 * @param key  {string} 键值
 * @param start {number}
 * @param stop {number}
 * @return {Promise}
 */
exports.lrange = createPromise('LRANGE');

/**
 * 随机获的set集合的元素
 * @param key  {string} 键值
 * @param [count] {number}
 * @return {Promise}
 */
exports.srandmember = createPromise('SRANDMEMBER');

/**
 * 得到的set集合的元素数量
 * @param key  {string} 键值
 * @return {Promise}
 */
exports.scard = createPromise("SCARD");

/**
 * 设置set集合的元素数量
 * @param key  {string} 键值
 * @return {Promise}
 */
exports.sadd = createPromise("SADD");
/**
 * 设置set集合的元素数量
 * @param key  {string} 键值
 * @return {Promise}
 */
exports.rpush = createPromise("RPUSH");

exports.hgetall = createPromise("HGETALL");

exports.lindex = createPromise('LINDEX');
exports.isExist = createPromise("exists");

exports.zadd = createPromise("zadd");
// 向有序集合添加一个或多个成员，或者更新已存在成员的分数

// 获取有序集合的成员数

exports.zcard = createPromise("ZCARD");
// 通过索引区间返回有序集合成指定区间内的成员 asc

exports.zrange = createPromise("ZRANGE");
// 通过索引区间返回有序集合成指定区间内的成员 desc
exports.zrevrange = createPromise("ZREVRANGE");

// 返回有序集合中指定成员的索引 asc
exports.zrank = createPromise("ZRANk");

// // 返回有序集合中指定成员的排名 desc
exports.zrevrank = createPromise("zrevrank");

// 返回列表的长度。 如果列表 key 不存在，则 key 被解释为一个空列表，返回 0 。 如果 key 不是列表类型，返回一个错误。
exports.llen = createPromise('LLEN');
exports.lpop = createPromise('LPOP');
exports.lpush = createPromise('LPUSH');


exports.incr = createPromise('INCR');

// 命令将 key 中储存的数字值减一
exports.decr = createPromise('DECR');
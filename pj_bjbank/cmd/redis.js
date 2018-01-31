/**
 * document https://github.com/NodeRedis/node_redis
 * redis常用操作封装
 */
const redis = require('redis');
const config = require('@server/config');

const redisConfig = config.get('redis');

console.log(redisConfig);
// 从config中获取redis配置文件
// 可以根据不同的环境连接不同的redis数据库
const client = redis.createClient(redisConfig.port, redisConfig.host);


client.on('error', (err) => {
    redis.print(err);
});

module.exports = client;

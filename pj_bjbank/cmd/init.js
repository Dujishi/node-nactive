
const redis = require('./redis');
const whiteList = require('./whiteList');


function main() {
    const sadd = () => {
        const value = whiteList.pop();
        if (value) {
            console.log(`sadd: ${value}`);
            redis.sadd('node_bjbank:whitelist', value, sadd);
        } else {
            console.log('数据导入完成');
            process.exit();
        }
    };
    redis.del('node_bjbank:whitelist', sadd);
}

main();


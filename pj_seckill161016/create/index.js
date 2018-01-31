const addRedis = require('./addRedis');
const activeId = process.env.seckill;
const key = 'seckill' + activeId;
const config = require('./list/' + activeId);

// 时间字符串转成时间戳
config.active.start_time = new Date(config.active.start_time).getTime();

try {
    addRedis.addActive(key, config.active).then(function(data) {
        console.log(data)
    });

    addRedis.addProduct(key, config.product).then(function(data) {
        console.log(data)
    });

    addRedis.addWhitelist(key, config.whiteList).then(function(data) {
        console.log(data)
    });

    addRedis.addRule(key, config.rule).then(function(data) {
        console.log(data)
    });

    // addRedis.smembers().then((data) => {
    //     console.log(data.join(','))
    //     //fs.writeFileSync('./value.txt', data.join(','))
    // });


    // addRedis.addQualified(key, config.qualitifyList).then(function (data) {
    //     console.log(data)
    // });

    addRedis.addStock(key, config.product.stock).then(function(data) {
        console.log(data)
    });
} catch (e) {
    console.log(e)
}

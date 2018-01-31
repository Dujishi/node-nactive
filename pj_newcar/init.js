/**
 * @description 初始化文件
 * @author  yinshi
 * @date 16/12/13.
 */


require("babel-register")({
    presets : ['stage-3'],
    ignore  : function(filename){
        if ( filename.indexOf('node_modules') >= 0 && filename.indexOf('@server') <0 ) {
            return true;
        }
        return false;
    }
});
const  soaApi = require('@server/soa-api');
const  config = require('../config');
const  keys = require('./config/key');
const redis = require('@server/redis');
redis.init(config.redis);
soaApi.init(config.soaHost);


//初始化商品数据 测试环境
// redis.sadd(keys.recommend(),'S520010','S520011','S520012').then(function (data) {
//     console.log(data)
// });

//
// redis.set(keys.endTime(),'2017.1.6.20.0.0');
// redis.del(keys.recommend());
// //初始化商品数据 正式环境
// redis.sadd(keys.recommend(),'S402861','S402866','S402891').then(function (data) {
//     console.log(data)
// });


//清除缓存

// redis.del(keys.cacheProducts())
// redis.del(keys.cacheProductsList()).then(function (data) {
//     console.log(data);
// })

// 预约总得产品
//
redis.keys(keys.order('*')).then(function (data) {
    const keys = 'city,goodsCode,goodsName,phone,userId,userName,createTime';
    return Promise.all(data.map(function (k) {
        return redis.sinter(k).then(function (data) {
            return dealOrder(data)
        })
    })).then(function (res) {
        const result = res.map(i=>i.join('\n'));
        result.unshift(keys);
        console.log('ordered');
        console.log(result.join('\n'))
    })
});

redis.hgetall(keys.wanted()).then(function (data) {
    const keys = 'brandId,brandName,city,modelId,modelName,phone,seriesId,seriesName,userId,userName,createTime';
    const result = Object.keys(data).map(item=>{
        const d = JSON.parse(data[item]);
        const res = []
        keys.split(',').forEach(i=>{
            res.push(d[i]||'')
        });
        return res.join(',')
    });
    result.unshift(keys);
    console.log('wanted');
    console.log(result.join('\n'))
})

function dealOrder(data) {
    const keys = 'city,goodsCode,goodsName,phone,userId,userName,createTime';
    const result = data.map(item=>{
        const d = JSON.parse(item);
       return keys.split(',').map(k=>{
            return  d[k]
        }).join(',')
    });
    return result
}
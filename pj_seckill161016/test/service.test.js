/**
 * @description
 * @author  yinshi
 * @date 16/10/18.
 */


require("babel-core/register")({
    presets : ['stage-3']
});

const key='seckill161016';
// var codeService= require('../service/codeService');
// var bindService= require('../service/bindService');
//
//
// const res=codeService('13738171416',1).then(function (data) {
//     console.log(data);
//
//
//
//
//   return  bindService('13738171416','openidceshi1',data.data.code).then(function (data) {
//         console.log(data)
//     });
// });



var indexService = require('../service/indexService');
// //app端
// indexService('seckill161016',undefined,12).then(function (data) {
//     console.log(data)
// });
// //open未绑定
// indexService('seckill161016','d121',12).then(function (data) {
//     console.log(data)
// });

//绑定了的
// indexService('seckill161016','openidceshi1',12).then(function (data) {
//     console.log(data)
// });



var seckillService= require('../service/seckillService');

const  redisKey=require('../config');

const  redis=require('../utils/seckill_redis');


redis.smembers(redisKey.redis.qualified(key)).then(function (userIds) {
    userIds.forEach(function (i,d) {
        // console.log(i)
        seckillService('seckill161016','',i).then(function (data) {
            console.log(data);
        },function (err) {
            console.log(err);
        });
    });
});














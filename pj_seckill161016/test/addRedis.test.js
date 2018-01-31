/**
 * @description
 * @author  yinshi
 * @date 16/10/18.
 */
let fs = require('fs');

require("babel-core/register")({
    presets: ['stage-3']
});

const addRedis = require('./addRedis');

const key = 'seckill161016';

let startTime = new Date('2016-11-31T10:00:00');

console.log(startTime)
const active = {
    title: 'iPhone 7秒杀活动',
    banner: '//store.ddyc.com/res/xkcdn/seckill/161016/banner.jpg',
    start_time: startTime.getTime() + startTime.getTimezoneOffset() * 60000
};


const product = {
    title: 'iPhone 7 128G 亮黑色',
    product: 'iPhone7',
    origin_price: '6188',
    seckill_price: 0,
    stock: 1,
    logo: "//store.ddyc.com/res/xkcdn/seckill/161016/product.png"
};

const rule = `
<ol>
            <li><span>1.</span> 2016年10月21日00:00:00至2016年10月31日09:59:59内在典典养车APP成功支付违章代办订单，且未主动发起退款的用户，即可参与秒杀；</li>
            <li><span>2.</span> 秒杀开始时间：2016年10月31日10:00:00；</li>
            <li><span>3.</span> 秒杀页面入口在典典养车 APP 首页和违章查缴页面内部都有展示；</li>
            <li><span>4.</span> 客服将于秒杀结果公布后2小时内联系秒杀成功用户领取奖品；</li>
            <li><span>5.</span> 秒杀奖品将于结果公布后24小时内快递寄出；</li>
            <li><span>6.</span> 违章处理在1-3个工作日内完成;</li>
            <li><span>7.</span> 活动奖品由典典养车APP提供，与设备生产商公司无关；在法律范围内本活动最终解释权归典典养车APP所有。</li>
        </ol>
`;

const whiteList = [4811360];

const qualitifyList = [3691526];


const add = function() {
    try {
        // addRedis.addActive(key, active).then(function(data) {
        //     console.log(data)
        // });

        // addRedis.addProduct(key, product).then(function(data) {
        //     console.log(data)
        // });

        // addRedis.addWhitelist(key, whiteList).then(function(data) {
        //     console.log(data)
        // });
        // addRedis.addRule(key, rule).then(function(data) {
        //     console.log(data)
        // });

        // addRedis.smembers().then((data) => {
        //     console.log(data.join(','))
        //     //fs.writeFileSync('./value.txt', data.join(','))
        // });


        //  addRedis.addQualified(key,qualitifyList).then(function (data) {
        //      console.log(data)
        //  });

        console.log(2222)
        addRedis.addStock(key, product.stock).then(function(data) {
            console.log(data)
        });
    } catch (e) {
        console.log(e)
    }
};

add()

//

//
// addRedis.addActive(key,active).then(function (data) {
//     console.log(data)
// });
// addRedis.addRule(key,rule).then(function (data) {
//     console.log(data)
// });

//添加库存
// addRedis.addStock(key, 1).then(function(data) {
//     console.log(data)
// });

//
// const  redisKey=require('../config');
// const redis= require('../utils/seckill_redis');
//
//
// redis.sismember(redisKey.redis.qualified(key),3694002).then(function (data) {
//     console.log(data)
// })
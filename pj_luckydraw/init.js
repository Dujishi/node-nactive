/**
 * @description
 * @author  yinshi
 * @date 16/11/24.
 */
require('babel-register')({
    presets: ['stage-3'],
    ignore(filename) {
        if (filename.indexOf('node_modules') >= 0 && filename.indexOf('@server') < 0) {
            return true;
        }
        return false;
    },
});
const redis = require('@server/redis');
const config = require('../config');
const redisKey = require('./config/redisKey');
redis.init(config.redis);

const active = 'cmb161201';
const init = require('./service/init');

redis.zrange('luckyDraw:cmb161201:payMemberList', 0, -1, 'WITHSCORES').then((data) => {
    let arr = [];
    const start = 1;
    const end = (new Date()).getDate();
    const dateArr = [];
    for (let i = start; i < end; i++) {
        dateArr.push(new Date(`2016/12/${i} 23:59:59`).getTime());
    }

    const dataArr = [];
    for (let i = 0; i < data.length; i = i + 2) {
        dataArr.push(data[i + 1]);
    }

    const dateData = {};
    for (let i = 0; i < dateArr.length; i++) {
        for (let j = 0; j < dataArr.length; j++) {
            if (dataArr[j] <= dateArr[i] && i === 0) {
                if (dateData[i]) {
                    dateData[i] = dateData[i] + 1;
                } else {
                    dateData[i] = 1;
                }
            } else if (dataArr[j] < dateArr[i] && dataArr[j] > dateArr[i - 1]) {
                if (dateData[i]) {
                    dateData[i] = dateData[i] + 1;
                } else {
                    dateData[i] = 1;
                }
            }
        }
    }

    let allData = 0;

    for (let key in dateData) {
        allData += dateData[key];
        console.log(`${(key - 0) + 1}号：${dateData[key]}`);
    }
    console.log(`截止${end - 1}号 23:59:59 总数据：${allData}`);
});

// redis.zscore("luckyDraw:cmb161201:payMemberList", 3914592).then(function(data){
//     if (data !== null) {
//         console.log(data)
//     }
   
// });


// const flag6 = false, flag7 = false, flag8 = false;
// const sarrAll = [];



// const s8 = function () {
//     redis.hgetall('luckyDraw:cmb161201:payMemberInfo:*').then((data) => {
//         console.log(data)
//     });
// };
// s8()

// const s7 = function () {
//     redis.lrange('luckyDraw:cmb161201:participantsList:7', 0, -1).then((data) => {
//         const sarr1 = [];
//         for (let i = 0; i < data.length; i++) {
//             const obj = JSON.parse(data[i]);
//             if (obj.userId != 7581301 && obj.userId != 7929675) {
//                 sarr1.push(obj);
//             }
//         }
//         sarrAll.concat(sarr1);
//         flag6 = true;

//         setTimeout(function () {
//             s8();
//         }, 50);
//     });
// };

// redis.lrange('luckyDraw:cmb161201:participantsList:6', 0, -1).then((data) => {
//     const sarr1 = [];
//     let obj1 = false, obj2 = false;
//     for (let i = 0; i < data.length; i++) {
//         const obj = JSON.parse(data[i]);
//         if (obj.userId != 7581301 && obj.userId != 7929675) {
//             sarr1.push(obj);
//         }
//     }
//     sarrAll.concat(sarr1);
//     flag6 = true;

//     // setTimeout(function () {
//     //     s7();
//     // }, 50);
// });




// const handler = function(){
//     if(flag6 && flag7 && flag8){
//         clearInterval(handers);

//         console.log(sarrAll.length);
//         // redis.del('luckyDraw:cmb161201:participantsList:6').then((data)=>{
//         //     for (let i = 0; i < sarrAll.length; i++) {
//         //         redis.lpush('luckyDraw:cmb161201:participantsList:6',sarrAll[i]);
//         //     }
//         // })
//     }
// };
// const handers = setInterval(handler,50);


// redis.hgetall('luckyDraw:cmb160201:participantsList:1').then((data) => {
//     console.log(data);
// });

// redis.zrange('luckyDraw:cmb161201:payMemberList', 0, -1, 'WITHSCORES').then((data) => {
//     const arr = [];
//     for (let i = 0; i < data.length; i = i + 2) {
//         arr.push(data[i]);
//     }
//     console.log(arr.join(','));
// });


// 活动初始化信息
// init.init(active,10,1).then(function (data) {
//     console.log(data)
// },function (err) {
//     console.log(err)
// })

// 重新开始一轮
// init.restart(active,10,1).then(function (data) {
//     console.log(data)
// },function (err) {
//     console.log(err)
// })

// redis.get(redisKey.currentNumber(active)).then((data)=>{
//     console.log(data);
// });

// 活动修改信息
// init.change(active,11).then(function (data) {
//     console.log(data)
// });

// 添加黑名单
// init.addBlack(active,3699620).then(function (data) {
//     console.log(data)
// }).catch(function (err) {
//     console.log(err)
// })

// 支付回调模拟
// init.mockPaied(active,12321).then(function (data) {
//     console.log(data)
// }).catch((err)=>console.log(err))

// 验证抽奖结果
// init.checkChoujiangResult(active,5).then(function (data) {
//     console.log(data)
// }).catch(err=>console.log(err))

// redis.lrange(redisKey.participantsList(active, 11), 0, -1).then(function (data) {
//     return data.map(i=>JSON.parse(i))
// }).then(function (data) {
//     return data.map(i=>Number(i['pvCard'])).sort();
// }).then(function (data) {
//     console.log(data)
// });

// const data = {
//     "userId": "3691429",
//     "phone": "10112348888",
//     "headimgurl": "http:\/\/test-store.ddyc.com\/user\/avator\/2016\/1124\/b82146b4a3744d1c6db1f8a21f1a2230.jpg",
//     "pvCard": "453488525930254567810975473075",
//     "orderId": 7910168,
//     "paidTime": 1480417181042,
//     "round": "1",
//     "code": "10499"
// }
// for(var i = 0 ;i<100;i++){
//     redis.lpush(redisKey.participantsList(active,1),JSON.stringify(data))
// }


/**
 * @description
 * @author  yinshi
 * @date 16/12/10.
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

const errIds = ['7581301','7929675'];

 function getList (round) {
   return redis.lrange(redisKey.participantsList(active, round), 0, -1);

}

const revertCodes= []
getList(6).then((data)=>{
   // const errUsers= data.map(listStr=>JSON.parse(listStr)).filter(list=>{
   //      return errIds.indexOf(list.userId) != -1;
   //  });
   //  //获取需要还原的code
   //  errUsers.forEach(function (data) {
   //      revertCodes.push(data.code);
   //  });
   //  return revertCodes
})

    .then(codes=>{
        // console.log(codes)
    //添加池子数据,已恢复
    // redis.lpush(redisKey.lotteryPool(active,6),...codes);
    // console.log(JSON.stringify(revertCodes))
})

    .then(data=>{

    //第7轮需要进行恢复的数据
  // return  getList(7).then((data)=>{
  //       return data.map(listStr=>JSON.parse(listStr)).filter(list=>{
  //           return errIds.indexOf(list.userId) == -1;
  //       });
  //   })
//    处理第7轮的数据信息
})
    .then(trueUsers=>{
    // console.log(trueUsers);
    //真实用户的数据情况
    // trueUsers.forEach(user=>{
    //     redis.lpop(redisKey.lotteryPool(active,6)).then(code=>{
    //         redis.hmset(redisKey.payMemberInfo(active,user.userId),{
    //             round:6,
    //             code:code
    //         }).then(data=>function (data) {
    //             redis.hgetall(redisKey.payMemberInfo(active,user.userId)).then(function (info) {
    //                 redis.lpush(redisKey.participantsList(active,6),JSON.stringify(info));
    //             });
    //             redis.hmset(redisKey.codeBindUserid(active,6),{
    //                 [code]:user.userId
    //             })
    //         });
    //
    //     });
    // })
//    处理第8轮的数据
})
    .then(()=>{
    // return getList(8).then((data)=>{
    //    return data.map(listStr=>JSON.parse(listStr)).filter(list=>{
    //         return errIds.indexOf(list.userId) == -1;
    //     });
    //
    // });

    //    处理第8轮的数据
}).then(trueUsers=>{
    // console.log(JSON.stringify(trueUsers));
    //真实用户的数据情况
    // trueUsers.forEach(user=>{
    //     redis.lpop(redisKey.lotteryPool(active,6)).then(code=>{
    //         redis.hmset(redisKey.payMemberInfo(active,user.userId),{
    //             round:6,
    //             code:code
    //         }).then(data=>function (data) {
    //             redis.hgetall(redisKey.payMemberInfo(active,user.userId)).then(function (info) {
    //                 redis.lpush(redisKey.participantsList(active,6),JSON.stringify(info));
    //             });
    //             redis.hmset(redisKey.codeBindUserid(active,6),{
    //                 [code]:user.userId
    //             })
    //         });
    //
    //     });
    // })

// //纠正轮数信息
})
//     .then(function () {
//     redis.set(redisKey.currentNumber(active), 6)
//
// //    恢复中奖人信息
// })
    .then(data=>{
    //恢复抽奖池信息
    // const codes = [];
    // for (let i = 1; i < 500; i++) {
    //     codes.push(10000 + i);
    // }
    // redis.del(redisKey.lotteryPool(active, 8)).then(function () {
    //     redis.rpush(redisKey.lotteryPool(active, 7), ...codes);
    //     redis.rpush(redisKey.lotteryPool(active, 8), ...codes);
    // });

})
    //删除错误数据
    .then(function (data) {
    return  getList(6).then((data)=>{
        return data.map(listStr=>JSON.parse(listStr))
    })
}).then(data=>{
    // console.log(data.length)
    // const revertData = data.filter(list=>errIds.indexOf(list.userId) == -1);
    // console.log(JSON.stringify(data));
    // console.log('分界线==========')
    // console.log(JSON.stringify(revertData));
    // //恢复参与人信息
    // redis.del(redisKey.participantsList(active,6)).then(function () {
    //    const datas = revertData.map(list=>JSON.stringify(list))
    //     redis.lpush(redisKey.participantsList(active,6),...datas);
    // })
//    恢复两个异常数据
//     redis.lpop(redisKey.lotteryPool(active,6)).then(function (code) {
//         console.log(code);
//         redis.hmset(redisKey.payMemberInfo(active,7929675),{
//             round:6,
//             code:code
//         });
//         redis.hgetall(redisKey.payMemberInfo(active,7929675)).then(function (info) {
//                             redis.lpush(redisKey.participantsList(active,6),JSON.stringify(info));
//                         });
//         redis.hmset(redisKey.codeBindUserid(active,6),{
//                             [code]:7929675
//                         })
//     })
//     redis.lpop(redisKey.lotteryPool(active,6)).then(function (code) {
//         console.log(code);
//         redis.hmset(redisKey.payMemberInfo(active,7581301),{
//             round:6,
//             code:code
//         });
//         redis.hgetall(redisKey.payMemberInfo(active,7581301)).then(function (info) {
//             redis.lpush(redisKey.participantsList(active,6),JSON.stringify(info));
//         });
//         redis.hmset(redisKey.codeBindUserid(active,6),{
//             [code]:7581301
//         })
//     })

    // 恢复错误数据
    // redis.zrange(redisKey.payMemberList(active),0,-1).then(keys=>{
    //     keys.forEach(function (key) {
    //         redis.hget(redisKey.payMemberInfo(active,key),'round').then(round=>{
    //             console.log(round);
    //             if(round==6){
    //                 // console.log(key)
    //                 redis.hgetall(redisKey.payMemberInfo(active,key)).then(function (data) {
    //                     console.log(JSON.stringify(data));
    //                     redis.lpush(redisKey.participantsList(active,6),JSON.stringify(data)).then(res=>{
    //                         console.log(res)
    //                     })
    //                 })
    //             }
    //         })
    //     })
    // }).catch(err=>{
    //     console.log(err)
    // })

    // 备份数据
})
//     .then(function (data) {
//     return getList(7)
// }).then(function (data) {
//     console.log(JSON.stringify(data))
//
// }).then(function (data) {
//     return getList(8)
// }).then(function (data) {
//     console.log(JSON.stringify(data))
//
// })
//     .then(function (data) {
//         redis.del(redisKey.participantsList(active,7));
//         redis.del(redisKey.participantsList(active,8));
//     })
// .then(function (data) {
//     return redis.hgetall(redisKey.codeBindUserid(active,7))
// }).then(function (data) {
//     console.log(JSON.stringify(data))
//
// }).then(function (data) {
//     return redis.hgetall(redisKey.codeBindUserid(active,8))
// }).then(function (data) {
//     console.log(JSON.stringify(data))
//
// })
//     .then(function (data) {
//         redis.del(redisKey.codeBindUserid(active,7));
//         redis.del(redisKey.codeBindUserid(active,8));
//     })

//删除中奖信息，备份
// redis.hgetall(redisKey.lotteryWinnerInfo(active)).then(function (data) {
//     console.log(data)
// })
//删除中奖信息
// redis.hdel(redisKey.lotteryWinnerInfo(active),6,7).then(function (data) {
//
// })


// redis.del(redisKey.codeBindUserid(active,6)).then(function () {
//     return getList(6)
// })
getList(6).then(function (data) {
    return data.map(listStr=>JSON.parse(listStr))
}).then(function (arr) {
    const  data ={};
    arr.forEach(list=>{
        data[list.code]=list.userId;
    })
   return redis.hmset(redisKey.codeBindUserid(active,6),data);
}).then(function (data) {
    console.log(data);
})
//检测数据有没有第7,8轮的

// let num = 0;
// redis.keys(redisKey.activeKey(active,'payMemberInfo:*')).then(keys=>{
//     keys.forEach(key=>{
//         redis.hget(key,'round').then(round=>{
//
//             if(round && Number(round) >6){
//                 num++
//                 console.log(num)
//                 redis.hgetall(key).then(function (data) {
//                     console.log(data);
//                 })
//             }
//         })
//     })
// })



//第8轮正确的code
// getList(8).then((data)=>{
//     const trueUsers= data.map(listStr=>JSON.parse(listStr)).filter(list=>{
//         return errIds.indexOf(list.userId) == -1;
//     });
//     //获取需要还原的code
//     console.log(trueUsers.length)
// });


// 第一步，恢复第6轮池子数据 错误code 161个
// 第二步，修正用户信息列表（重新抽奖）第7轮31，第8轮25个
// 第三步，修正用户参与的轮数
// 第四步，修正用户与抽奖码绑定信息
// 第五步，恢复当前进度
// 第七步，恢复第7，8轮池子数据
// 第六步，删除错误数据内容
// 第八步，删除中奖信息
// 第九步，验证恢复信息







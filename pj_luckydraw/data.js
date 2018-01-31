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

const users = {};
const dd = []
// redis.keys(redisKey.participantsList(active,'*')).then(function (data) {
//     console.log(data)
//     return Promise.all(data.map(item=>{
//         // console.log(item)
//         return redis.lrange(item,0,-1);
//     }))
// })
//     .then(datas=>{
//     datas.forEach(data=>{
//         data.forEach(item=>{
//             const d= JSON.parse(item)
//             if(!users[d.userId]){
//                 users[d.userId]=d;
//             }else{
//                 dd.push(d);
//             }
//         });
//
//     });
// }).then(function () {
//     dd.forEach(d=>{
//         console.log(users[d.userId])
//     })
//     console.log(dd);
// });

const userIds = [5513099	,
	3455170	,
2793241	,
1529343	,
    4510227	,
	6606709	,
	7640338	,
	323137	,
	36650	,
	1242873	,
	1445599	,
	2807023	,
3488052	,
	3903782	,
	3589791	,
	4526144]
// redis.zrange(redisKey.payMemberList(active),0,-1).then(data=>{
//     const dt = data.map(d=>Number(d)).sort()
//     console.log(JSON.stringify(dt))
//     userIds.sort().forEach(id=>{
//         console.log(dt.indexOf(id),id)
//     })
// })

// redis.hgetall(redisKey.payMemberInfo(active,4526144)).then(data=>{
//     console.log(data)
// })

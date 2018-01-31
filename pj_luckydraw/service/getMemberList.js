/**
 * @description 获取参与活动信息列表
 * @author  yinshi
 * @date 16/11/23.
 */

const redis = require('@server/redis');
const validation = require('@util/validation');
const response = require('@util/response-json');
const redisKey = require('../config/redisKey');
const util = require('../util');

module.exports = async function (userId, activeName,time,pageSize=30) {
    if (!userId) {
        return response.json_err('请先登录', '-1');
    }
    const round = await redis.hget(redisKey.payMemberInfo(activeName, userId), 'round');
    if (!round) {
        return response.json_err('请先参加活动', 3002);
    }
    // 返回当前列表最后50条数据
    let memberList = await redis.lrange(redisKey.participantsList(activeName, round), 0, -1);

    const len = memberList.length
    let startNum = 0
    let endNum =  startNum + Number(pageSize);
    let timeStamp = 0
    memberList = memberList.sort(function(memberStr1,memberStr2){
        const member1 = JSON.parse(memberStr1);
        const member2 = JSON.parse(memberStr2);
        return member2.paidTime - member1.paidTime
    }).map((memberStr,index) => {
        const member = JSON.parse(memberStr);
        const paidTime = new Date();

        if( (index==0 && !time) || ( time ==  member.paidTime && time)){
            startNum = index
            endNum = startNum + Number(pageSize)

            const lastMember = endNum < len ? JSON.parse( memberList[ endNum ] ): {
                paidTime:0
            };

            timeStamp = lastMember.paidTime ;

        }

        member.paidTime && paidTime.setTime(member.paidTime);
        return {
            phone: util.hidePhone(member.phone || ''),
            headimgurl: member.headimgurl,
            date: [paidTime.getFullYear(), util.addZero(paidTime.getMonth() + 1),
                util.addZero(paidTime.getDate())].join('.'),
            time: [[util.addZero(paidTime.getHours()),
                util.addZero(paidTime.getMinutes()),
                util.addZero(paidTime.getSeconds())].join(':'),
                util.addZero1000(paidTime.getMilliseconds())].join('.'),
        };
    });

    return response.json_success({
        totalNumber:len,
        data:memberList.slice(startNum,endNum),
        isLast: endNum >= len,
        timeStamp: timeStamp
    });
};


const soaApi = require('@server/soa-api');
const platform = require('@server/model-soaapi').platform;
const validation = require('@util/validation');
const response = require('@util/response-json');
const wechatApi = require('@server/wechat');
const redis = require('@server/redis');
const config = require('../../config');

exports.post = async function(ctx) {
    const req = ctx.request.body;
    const packet = req.packet;
    const openId = req.openId || null;
    let userId = ctx.session.userId || req.userId || ctx.headers.userid;
    const phone = req.phone || ctx.session.phone || '';
    const isWechat = validation.isWechat(ctx.headers);
    let packetCode;
    let postData;
    if(config.env == 'prod'||config.env== 'pre'){
        packetCode = (packet=='newcomer')?2885 :2887;
    }else{
        packetCode = (packet=='newcomer')?786 :785;
    }

    if(!userId){
        ctx.body = response.json_err('当前用户未登录',-1);
        return;
    }
    if(!/1[034578]\d{9}/.test(phone)){
        ctx.body = {
            success: false,
            message: '手机号码格式错误！'
        };
        return;
    }

    const userInfo = await platform.userCenterService.getUserInfoByPhone(phone, 3);
    console.log('userInfo:',userInfo);
    if (userInfo && userInfo.data && userInfo.data.channelId && userInfo.data.channelId === 45) {
        ctx.body = {
            success: false,
            message: '您已是典典特权用户，无法领取新人红包'
        };
        return false;
    }

    if( (packet=='newcomer') && openId && isWechat ){
        let key = `newcomer:new:${openId}`;
        let redisData = await redis.isExist(key);
        if(redisData){
            postData ={
                success:false,
                errCode:'REPEAT_CODE',
                message:'您已经领过该活动的优惠啦',
                data:null,
                soaData:false
            }
        }else{
            postData = await soaApi('marketing-core/exchangeActivityService/exchangeById', parseInt(userId), phone.toString(),packetCode);
            if(postData.success){
                redis.set(key,1);
            }
        }
        ctx.body = postData;
    }else{
        postData = await soaApi('marketing-core/exchangeActivityService/exchangeById', parseInt(userId), phone.toString(),packetCode);
        ctx.body = postData;
    }
};
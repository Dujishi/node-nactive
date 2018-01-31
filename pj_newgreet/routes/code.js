const soaApi = require('@server/soa-api');
const platform = require('@server/model-soaapi').platform;
const validation = require('@util/validation');
const response = require('@util/response-json');
const config = require('../../config');

exports.post = async (ctx)=>{
    const req = ctx.request.body;
    const phone = req.phone;
    const channelId = req.channelId;

    if(config.env == 'prod'||config.env== 'pre'){
        if(!/1[34578]\d{9}/.test(phone)){
            ctx.body = {
                success: false,
                message: '手机号码格式错误！'
            };
            return;
        }
    }else{
        if(!/1[034578]\d{9}/.test(phone)){
            ctx.body = {
                success: false,
                message: '手机号码格式错误！'
            };
            return;
        }
    }

    const userInfo = await soaApi('platform/userCenterService/isNewCarUser', phone);
    if (userInfo && !userInfo.data){
        ctx.body = {
            success: false,
            data:'',
            packetCode:'1',
            message: '您已是典典用户，无法领取新人红包'
        };
        return false;
    }

    const phoneCode = await platform.userCenterService.preLogin({phone, appType:23, code:1, channelId});
    if(phoneCode && phoneCode.success){
        ctx.session.phone = phone;
        ctx.session.channelId = channelId;
    }
    ctx.body = phoneCode;
};
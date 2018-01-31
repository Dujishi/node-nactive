const soaApi = require('@server/soa-api');
const platform = require('@server/model-soaapi').platform;
const validation = require('@util/validation');
const response = require('@util/response-json');
const config = require('../../config');

exports.post = async (ctx)=>{
    const req = ctx.request.body;
    const phone = ctx.session.phone||req.phone;
    const code = req.code;
    const channelId = ctx.session.channelId||req.channelId;

    if(!/1[034578]\d{9}/.test(phone)){
        ctx.body = {
            success: false,
            message: '手机号码格式错误！'
        };
        return;
    }

    const soaData = await platform.userCenterService.login({ phone, appType:23, code, channelId });
    if(soaData && soaData.success){
        ctx.session.userId = soaData.userId;
    }
    ctx.body = soaData;
};
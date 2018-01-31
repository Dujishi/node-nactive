const soaApi = require('@server/soa-api');
const platform = require('@server/model-soaapi').platform;
const validation = require('@util/validation');
const response = require('@util/response-json');
const config = require('../../config');

exports.post = async (ctx)=>{
    const req = ctx.request.body;
    const phone = ctx.session.phone;
    let userId = ctx.session.userId ||'';
    let packetCode;

    if(config.env == 'prod'||config.env== 'pre'){
        packetCode = 2917;
    }else{
        packetCode = 794;
    }

    if(!/1[034578]\d{9}/.test(phone)){
        ctx.body = {
            success: false,
            message: '手机号码格式错误！'
        };
        return;
    }

    let exchangeData = await soaApi('marketing-core/exchangeActivityService/exchangeById', '', phone.toString(),packetCode);
    ctx.body = exchangeData;
};
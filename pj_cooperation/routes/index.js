const response = require('@util/response-json')
const soaApi = require('@server/soa-api')
const validation = require('@util/validation');
const maps = {
    'hasCoupon': {
        cls: 'btn-red',
        txt: '查看我的券'
    },
    'noCoupon': {
        cls: 'btn-yellow',
        txt: '立即领取'
    },
    'isNotWhite': {
        cls: 'btn-text',
        txt: '暂无领取资格'
    },
    'unlogin': {
        cls: 'btn-yellow',
        txt: '立即登录领取'
    }
}

async  function getStatus(phone) {
    let key;
    if(!phone){
        return getVal('unlogin')
    }
    const result = await soaApi('online-soa/tianjinTaxiInspectionSoaService/checkStatus', {tel: phone})
    console.log('用户状态=>'+ JSON.stringify(result))
    if(!result.success){
        return result
    }
    switch (result.data){
        case 0: return getVal('isNotWhite');
        case 1: return getVal('noCoupon');
        case 2: return getVal('hasCoupon');
        default:return response.json_err('服务器繁忙，请稍后再试', 50001)
    }
}
function getVal(key) {
    return {
        key,
        cls: maps[key].cls,
        txt: maps[key].txt
    }
}
function hidePhone(phone) {
 return phone ? phone.substr(0, 3) + '****' + phone.substr(7, 4) : ''
}
exports.get = async function (ctx) {
    const phone = ctx.session.phone;
    const btn = await getStatus(phone)
    const appkey = ctx.query.appkey;
    ctx.session.appkey = appkey || ctx.session.appkey;
    if(btn.success === false){
        await ctx.render('/views/error', {
            message: btn.message
        })
        return
    }
    await ctx.render('/pj_cooperation/views/index', {
        btn,
        phone: hidePhone(phone),
        iswechat: validation.isWechat(ctx.headers)
    })
};

exports.post = async function (ctx) {
    const phone = ctx.session.phone;
    const btn = await getStatus(phone)
    if(btn.success === false){
        ctx.body = btn;
        return
    }
    btn.phone = hidePhone(phone);
    ctx.body = response.json_success(btn);
}
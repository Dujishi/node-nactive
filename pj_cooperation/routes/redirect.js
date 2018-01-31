/**
 * @description 支付成功回调地址
 * @author  yinshi
 * @date 17/6/12.
 */
const env = require('../../config').env
exports.get = exports.post = async function (ctx) {
    let str = '';
    if(env == 'int'){
        str = '&xkzone=yshd'
    }
    ctx.redirect('/nactive/cooperation/spdb?appkey=BAZYHS6ZPGTIQP6X'+str)
}

/**
 * 获取完整的客户端请求地址
 */
module.exports = function (ctx) {
    // let protocol = ctx.request.protocol;
    // 由于nginx的原因， node进程无法获取协议类型
    if (process.env.NODE_ENV === 'pre') {
        return `https://m.ddyc.com${ctx.url}`;
    }
    return ctx.origin + ctx.url;
}
;

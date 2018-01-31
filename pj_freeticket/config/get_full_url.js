/**
 * 获取完整的客户端请求地址
 */
module.exports = function (ctx) {
    //let protocol = ctx.request.protocol;
    // 由于nginx的原因， node进程无法获取协议类型
    return ctx.origin + ctx.url;
}
/**
 * 通过请求头，判断客户端类型
 */
exports.isapp = function (headers) {
    let ua = headers['user-agent'];
    if(ua && ua.indexOf('ddyc') >-1 ){
        return true;
    }
    return false;
}

exports.iswechat = function (headers) {
    let ua = headers['user-agent'];
    if(ua && ua.indexOf('MicroMessenger') >-1 ){
        return true;
    }
    return false;
}

/**
 * 根据 __dirname 获取项目根路径, 建议缓存该值
 */
exports.getProjectRoot = function (dir) {
    dir = dir.replace(config.root , '');
    return '/'+dir.split('/')[0];
}
/**
 * 获取完整的客户端请求地址
 */
exports.getFullUrl = function (ctx) {
    //let protocol = ctx.request.protocol;
    // 由于nginx的原因， node进程无法获取协议类型
    return 'https://' + ctx.host + ctx.url;
}
/**
 * 判断手机号，兼容测试帐号10112345678
 */
exports.isPhone = function(phone) {
    if(!/^1\d{10}$/.test(phone)){
        return false;
    }
    return true;
}

/**
 * 返回错误内容
 * @param code
 * @param msg
 * @param data
 * @return {{success: boolean, code: number, msg: string}}
 */
exports.jsonError=function(code=404,msg='当前没有内容',data=null){
    return {
        success:false,
        code:code,
        message:msg,
        data
    }
}

/**
 * 返回正确内容
 * @param data
 * @return {{success: boolean, data: *}}
 */
exports.jsonSuccess=function(data){
    return {
        success:true,
        data
    }
}


exports.hidePhone=function (phone) {
    return phone.replace(/(\d{3})(\d{4})(\d{4})/,'$1****$3')
}
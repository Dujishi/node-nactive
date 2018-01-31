const httpClient = require('@server/http-client');

exports.get = async function(ctx){

/**
 * 发送POST请求， 默认添加application/x-www-form-urlencoded
 * @param o {Object}
 * @param o.url {String} 请求地址
 * @param o.method {String}  GET/POST
 * @param o.data {Object} 请求参数
 * @param o.timeout {Number} 超时时间
 * @param dataType {String} 返回的数据类型，默认json
 */
    ctx.body = await httpClient({
        url : 'http://www.baidu.com',
        dataType : 'json'
    });
}
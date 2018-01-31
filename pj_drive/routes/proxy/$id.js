const httpClient = require('@server/http-client');
const conf     = require('../../conf');

/**
 * php 接口代理
 */
exports.post = async function(ctx, next) {
    let activeId = ctx.params.id;
    if (!activeId) {
        ctx.body = {
            success: false,
            msg: '参数错误'
        };
        return ;
    }
    activeId = activeId.toUpperCase();
    let body = ctx.request.body;
    body.code = activeId;
    let key  = ctx.query.k;

    let proxyRet ;
    try{
        proxyRet = await httpClient({
            url : conf[key],
            data : body,
            method : 'POST',
            dataType : 'json'
        });
    }catch(e){
        console.log(e);
        proxyRet = {
            success: false,
            msg : ''
        };
    } 
    ctx.body = proxyRet;
};


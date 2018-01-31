const wechatApi  = require('@server/wechat');
const validation = require('@util/validation');
const getFullUrl = require('../../../lib/utils/get_full_url');
const httpClient = require('@server/http-client');
const conf       = require('../../conf');

// 订单详情页
exports.get = async function (ctx, next) {
    let activeId = ctx.params.id || '';
    activeId = activeId.toUpperCase();
    let iswechat = validation.isWechat(ctx.headers);
    let isapp    = validation.isApp(ctx.headers);
    
    if(!isapp && !iswechat){
        ctx.redirect('http://dl.ddyc.com');
        return ;
    }

    let openid = '';
    let wechat = {};
    if (iswechat) {
        let url = getFullUrl(ctx); // 当前页面完整地址
        let redirectUrl = ctx.origin + ctx.path;
        let token = await wechatApi.getOauthToken(ctx, redirectUrl);
        if (!token) { // redirect
            return;
        }
        openid = token.openid;
        wechat = await wechatApi.getJsConfig(url); 
    }

    let retPage = await httpClient({
        url : conf.pageinfo,
        data : {
            code : activeId
        },
        method : 'POST',
        dataType : 'json'
    });
    if (!retPage.success && retPage.msg === '参数非法') {
        await ctx.render('/views/error', {
            errCode : 404,
            message : '活动已结束'
        });
        return ;
    }
    if (!retPage.success) {
        ctx.body = await render('/views/error',{
            errCode : 1
        });
        return ;
    }
    let pageData = retPage.data;

    let uriIndex = ctx.origin + '/nactive/drive/index/'+ activeId;
    let uriSignup= ctx.origin + '/nactive/drive/signup/'+ activeId;
    let uriDetail= ctx.origin + '/nactive/drive/detail/'+ activeId;
    let uriProxy = ctx.origin + '/nactive/drive/proxy/'+ activeId;
    let uriInsure= ctx.origin + '/nactive/drive/insure/'+ activeId;

    let data = {
        isapp :  isapp,
        iswechat : iswechat,
        wechat : wechat,
        openid : openid,

        desc  : pageData.desc,

        shareUrl  : uriIndex,
        shareIcon : pageData.share.icon,
        shareTitle: pageData.share.title,
        shareContent : pageData.share.msg,

        uriIndex      : uriIndex,
        uriSignup     : uriSignup,
        uriDetail     : uriDetail,
        uriProxy      : uriProxy,
        uriInsure     : uriInsure
    };
    await ctx.render('/pj_drive/views/detail', data);
};

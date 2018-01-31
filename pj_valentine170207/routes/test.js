const soaApi = require('@server/soa-api');
const wechatApi = require('@server/wechat');
const validation = require('@util/validation');
const redis = require('@server/redis');
const response = require('@util/response-json');
const _ = require('lodash');
const getFullUrl = require('../../lib/utils/get_full_url');
const utils = require('../utils');
const config = require('../../config');

const project = 'valentine170207';

let code;

exports.get = async function(ctx, next) {
    const url = getFullUrl(ctx);
    const jssdkConfig = await wechatApi.getJsConfig(url);
    const redirectUrl = 'https://' + ctx.host + ctx.path;
    const token = await wechatApi.getOauthToken(ctx, redirectUrl, '', 'snsapi_userinfo');

    code = ctx.query.code;
    
    await ctx.render(`/pj_${project}/views/test`);
};

exports.post = async function(ctx, next) {
    console.log('----');
    console.log(code);

    const body = ctx.request.body;
    const oauth = wechatApi.getOauth();
    const userInfo = await oauth.getUserByCode(code);

    console.log('----=======');
    console.log(userInfo);
    ctx.body = userInfo;
};

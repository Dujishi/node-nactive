const response = require('@util/response-json');
const config = require('@server/config');
const validation = require('@util/validation');
const wechatApi = require('@server/wechat');
const service = require('../service');
const isstart = require('../service/isstart');

async function getStatus(userId) {
    if (!userId) {
        return getBtn(-1);
    }
    return getBtn(0);
}
function getBtn(status) {
    switch (status) {
    case -1:
        return {
            key: 'unLogin',
            cls: 'btn-yellow',
            txt: '立即查看优惠券',
            status
        };
    default:
        return {
            key: 'canGo',
            cls: 'btn-yellow',
            txt: '查看优惠券',
            status
        };
    }
}
exports.get = async function (ctx) {
    const userId = ctx.session.userId;
    const isWechat = validation.isWechat(ctx.headers);
    const data = {
        iswechat: isWechat
    };
    const appkey = ctx.query.appkey;
    ctx.session.appkey = appkey || ctx.session.appkey;

    if (isWechat) {
        const env = process.env.NODE_ENV;
        let origin = ctx.origin;
        if (env === 'pre') {
            origin = 'https://m.ddyc.com';
        }
        const url = origin + ctx.url;
        const wechat = await wechatApi.getJsConfig(url);
        Object.assign(data, {
            wechat,
        });
    }
    data.btn = await getStatus(userId);
    data.tongDun = config.tongDun;
    data.sessionId = ctx.session.sessionId;

    await ctx.render('/pj_cooperation/views/srcb', data);
};

exports.post = async function (ctx) {
    const phone = ctx.session.phone;
    const btn = await getStatus(ctx.session.userId, phone);
    ctx.body = response.json_success({ btn });
};

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
    if (!isstart()) {
        return getBtn(3);
    }
    const result = await service.checkStock();
    if (!result.success) {
        return getBtn(0);
    }
    const stock = result.data[0];
    console.log('stock=>', JSON.stringify(stock));
    if (!stock || !stock.count) {
        const orderResult = await service.checkExistOrder(userId);
        if (!orderResult.success) {
            return getBtn(0);
        }
        if (orderResult.data) {
            return getBtn(0);
        }
        return getBtn(-2);
    }
    return getBtn(0);
}
function getBtn(status) {
    switch (status) {
    case -1:
        return {
            key: 'unLogin',
            cls: 'btn-yellow',
            txt: '立即登录抢购',
            status
        };
    case 1:
        return {
            key: 'cantGo',
            cls: 'btn-text',
            txt: '您本月已抢购了2次，请下个月再来哦',
            status
        };
    case -2:
        return {
            key: 'cantGo',
            cls: 'btn-text',
            txt: '今日已抢完，请明日再来哦',
            status
        };
    case 3:
        return {
            key: 'cantGo',
            cls: 'btn-text',
            txt: '今日十点开抢',
            status
        };
    default:
        return {
            key: 'canGo',
            cls: 'btn-yellow',
            txt: '立即抢购',
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
        console.log(url);
        const wechat = await wechatApi.getJsConfig(url);
        Object.assign(data, {
            wechat,
        });
    } else {
        await ctx.render('/views/error', {
            message: '只能在微信中访问'
        });
        return;
    }
    data.btn = await getStatus(userId);
    data.tongDun = config.tongDun;
    data.sessionId = ctx.session.sessionId;


    await ctx.render('/pj_cooperation/views/spdb', data);
};

exports.post = async function (ctx) {
    const phone = ctx.session.phone;
    const btn = await getStatus(ctx.session.userId, phone);
    ctx.body = response.json_success({ btn });
};

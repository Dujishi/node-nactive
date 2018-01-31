const updateToken = require('@server/wechat/lib/update-token');

exports.get = async function (ctx) {
    await updateToken();
    ctx.body = 'Update access_token and jsapi_ticket success';
}
const resJson = require('@util/response-json');
const validation = require('@util/validation');
const isPhone = require('@util/string-util/is-phone');
const util = require('../service/util');

exports.post = async (ctx) => {
    const { phone } = ctx.request.body;
    if (!isPhone(phone)) {
        ctx.body = resJson.json_err('请输入正确的手机号');
        return;
    }

    if (!validation.isWechat(ctx.headers)) {
        ctx.body = resJson.json_err('只能在微信APP领取哦~');
        return;
    }

    let nickname = '';
    let headimgurl = '';
    if (ctx.session.wechatUserInfo) {
        const userInfo = JSON.parse(ctx.session.wechatUserInfo);
        nickname = userInfo.nickname;
        headimgurl = userInfo.headimgurl;
        if (headimgurl && headimgurl.indexOf('http://') > -1) {
            headimgurl = headimgurl.replace('http://', 'https://');
        }
    }

    const { orderId, actId, unionid } = ctx.session;

    let data = {};
    const res = await util.getPacketInfo(null, orderId, actId, unionid, phone, headimgurl, nickname);
    console.log('packetInfo===>', JSON.stringify(res));
    if (!res || (res && !res.success)) {
        ctx.body = resJson.json_err(res.message || '领取失败，请稍微重试');
        return;
    }
    data = Object.assign(data, res.data);

    ctx.body = resJson.json_success(data);
};

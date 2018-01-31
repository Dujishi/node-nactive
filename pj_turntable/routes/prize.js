const validation = require('@util/validation');
const serviceUtils = require('../services/utils');
const redis = require('../services/redis');
const resJson = require('@util/response-json');
const config = require('../config');
const modelSoaApi = require('@server/model-soaapi');

/**
 * 用户领抽奖接口
 * @url /nactive/turntable/prize
 * @param userId
 * @return res {Object}
 * @return res.success {Boolean}
 * @return res.code {int} 状态码
 * @return res.message {String} 错误信息
 * {
 *      success: true,
 *      data: '',
 *      code: 1,  // 状态码，200: 没有错误，-1: 没有抽奖资格, -2:还没有加入VIP, -3:已抽奖的用户
 * }
 */
exports.get = async (ctx) => {
    let { phone } = ctx.session;
    const { userId } = ctx.session;
    if (!userId) {
        ctx.body = resJson.json_err('请登录', -1);
        return;
    }

    const timeState = await serviceUtils.compareTime(new Date().getTime());
    if (timeState !== 0) {
        ctx.body = resJson.json_err('活动已结束，下次再来吧~');
        return;
    }

    // const data = {"type":"hb","prize":"prize_4","name":"20元机油保养红包","sub1":"<span>20</span><span>元</span>","sub2":"机油保养红包","sub3":"红包已放入 101****0027 帐号中"};
    // ctx.body = resJson.json_success(data);
    // return;

    // 设置分享人数
    await redis.setShareNumber();

    const isApp = validation.isApp(ctx.headers);
    const status = await serviceUtils.checkStatus(userId);
    if (status !== 1) {
        const text = config.statusMap[status];
        ctx.body = resJson.json_err(text, status);
        return;
    }

    if (!phone) {
        const res = await modelSoaApi.platform.userCenterService.getUserInfoById(userId, 1);
        if (res && res.success) {
            phone = res.data.phone;
        } else {
            ctx.body = resJson.json_err('服务器繁忙，请稍候重试');
        }
    }

    const data = await serviceUtils.getPrize(userId, isApp, phone);
    if (data.type === 'hb') {
        data.sub1 = `<span>${data.name.substring(0, 2)}</span><span>${data.name.substring(2, 3)}</span>`;
        data.sub2 = data.name.substring(3);
        data.sub3 = `红包已放入 ${phone.substring(0, 3)}****${phone.substring(7)} 帐号中`;
    } else if (data.type === 'sw') {
        data.sub1 = '<span>支付1元得</span>';
        data.sub2 = data.name;
    }

    // 今日分享已被占用, 提示文案不一样
    const dayInfo = await redis.getUserPreDayTimes(userId);
    let isShared = true;
    if (!dayInfo || (dayInfo && !dayInfo.share)) {
        isShared = false;
    }
    data.isShared = isShared;

    // 分享数字
    const shareNumber = await redis.getShareNumber();
    data.shareNumber = shareNumber;

    ctx.body = resJson.json_success(data);
};


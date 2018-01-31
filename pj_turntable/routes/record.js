const resJson = require('@util/response-json');
const serviceUtil = require('../services/utils');

// 获取中奖列表数据的页面

exports.get = async function(ctx) {
    const { userId } = ctx.session;
    if (!userId) {
        ctx.body = resJson.json_err('请登录', -1);
        return;
    }
    const list = await serviceUtil.getPrizeRecordList(userId);
    if (list && list.length) {
        list.forEach((it) => {
            if (it.type === 'sw' && !it.paid) { // 如果没有支付，拼接支付连接
                it.url = `${ctx.origin}/payment/prepay?goodsCode=${it.prize}&shopId=1&lat=0.0&lon=0.0&source=1`;
            }
        });
    }

    ctx.body = resJson.json_success(list);
    return;
};


const resJson = require('@util/response-json');
const serviceUtil = require('../services/utils');
const redis = require('../services/redis');

// 点击去支付判断

exports.post = async function(ctx) {
    const { userId } = ctx.session;
    if (!userId) {
        ctx.body = resJson.json_err('请登录', -1);
        return;
    }

    const { prize } = ctx.request.body;
    const res = await redis.checkPaid(userId, prize);
    if (res === 'false') { // 证明已抽到商品，未支付
        const res = await serviceUtil.checkOrderPaid(userId, prize);
        console.log('去支付检查==>', res);
        if (res && res.success) {
            if (res.data && res.data[prize] === false) {
                const goodsCodesObj = await redis.getGoodsCodesList();
                if (goodsCodesObj) {
                    ctx.body = resJson.json_success({
                        url: `${ctx.origin}/payment/prepay?goodsCode=${prize}&shopId=1&lat=0.0&lon=0.0&source=1&tradeOrderGoodsPartParam=${goodsCodesObj[prize]}|1`
                    });
                    return;
                }
            }
        }
    }

    ctx.body = resJson.json_err('没有需要支付的商品哦~');
    return;
};


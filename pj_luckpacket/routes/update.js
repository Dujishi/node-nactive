const util = require('../service/util');

exports.get = async (ctx) => {
    const { unionid } = ctx.session;

    // 获取用户关联信息
    const res = await util.getUserInfo(unionid);
    console.log('更新手机号===>', JSON.stringify(res));
    if (!res || (res && !res.success)) {
        await ctx.render('/views/error', {
            message: '加载用户关联信息报错'
        });
        return;
    }
    await ctx.render('/pj_luckpacket/views/update', {
        phone: res.data.userPhone
    });
};

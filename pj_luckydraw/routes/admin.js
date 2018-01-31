/**
 * @description
 * @author  yinshi
 * @date 16/11/26.
 */

const validation = require('@util/validation');
const response = require('@util/response-json');
const adminService = require('../service/getAdminData');

const initService = require('../service/init');

const PWD = '78c93e6ff8efc348f43067cb31ada3d1';  // 一元夺宝
const CHANGEPWD = 'f4800ece748c81da826f6da7b55d95c3'; // 为什么要修改呢
exports.get = async function (ctx, next) {
    const pwd = ctx.session.luckydrawPwd;
    let data = {};
    if (pwd == PWD) {
        data = await adminService('cmb161201');
    }
    await ctx.render('/pj_luckydraw/views/admin', {
        code: pwd === PWD,
        data,
    });
};

exports.post = async function (ctx, next) {
    const body = ctx.request.body;
    const pwd = body.pwd || ctx.session.luckydrawPwd;
    if (pwd !== PWD) {
        await ctx.render('/pj_luckydraw/views/admin');
        return;
    }
    ctx.session.luckydrawPwd = pwd;
    const type = body.type;
    const active = 'cmb161201';

    const data = await adminService('cmb161201');
    if (type == 'change') {
        const npwd = body.pwd;
        const round = body.round;
        if (npwd === CHANGEPWD && !isNaN(Number(round))) {
            const r = await initService.change(active, round);
            console.log(r);
        }
    }
    await ctx.render('/pj_luckydraw/views/admin', {
        code: true,
        data,
    });
};

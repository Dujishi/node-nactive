
import loginModal from './module/login';
import Loading from '@ui/loading/wloading';
import { create } from '@util/common-page';
import { getLocation } from '@ui/getlocation';
// import { confirm } from '@ui/modal';
const Fixtip = require('@ui/fixtip');
/**
 * 获取用户的状态
 * @param $btn
 * @param cb
 * @return {*|Promise.<TResult>}
 */
const getUserStatus = function ($btn, cb) {
    Loading.show();
    return $.post('/nactive/cooperation/spdb').then((res) => {
        Loading.hide();
        if (res.success) {
            const data = res.data;
            const btn = data.btn;
            $btn.attr('class', `btn ${btn.cls}`).html(btn.txt).data('key', btn.key);
            cb && cb(data);
        } else {
            new Fixtip({
                msg: res.message
            });
        }
    }, err => Loading.hide());
};
/**
 *
 */
const loginAction = (() => {
    let modal = null;
    return function ($btn) {
        if (!modal) {
            modal = new loginModal({
                success() {
                    $btn.html('登录成功');
                    $('.checkCoupon').show();
                    getUserStatus($btn, (data) => {
                        if (data.key === 'canGo') {
                            gotoBuy($btn);
                        }
                    });
                    modal = null;
                }
            });
        }
        modal.show();
        return modal;
    };
})();
// function loginOutAction() {
//     $("#loginOut").on('click', function () {
//         confirm({
//             msg: '确定退出登录么？',
//             ok(){
//                 $.post('/feopen/login/loginout').then(function () {
//                     location.reload();
//                 }, err=>{
//                     console.log(err)
//                 })
//             }
//         })
//
//     });
// }
function gotoBuy($btn) {
    $.post('order').then((res) => {
        if (res.success) {
            location.href = 'pay';
        } else {
            new Fixtip({
                msg: res.message
            });
        }
        console.log(res);
    });
    // location.href = 'pay';
}

function btnAction($btn) {
    $btn.on('click', () => {
        const key = $btn.data('key');
        switch (key) {
        case 'unLogin': // 未登录的时候
            loginAction($btn);
            return;
        case 'canGo': // 已经领取了的时候
            gotoBuy($btn);
            return;

        }
    });
}

/**
 * 上报经纬度
 * @param {Object} location
 */
function logLocation(location) {
    $.post('/feopen/base/location', {
        lat: location.latitude,
        lng: location.longitude
    });
}

/**
 * 上报错误
 * @param {Object} err
 * @param {String} msg
 */
function logError(err, msg) {
    err = err || {};
    $.post('/feopen/base/log', {
        err: JSON.stringify(err),
        msg
    });
}

$(() => {
    const common = create();
    const wx = window.wx || null;
    common.getLocation().then((location) => {
        logLocation(location);
    }, (err) => {
        // 上报微信获取经纬度失败
        logError(err, '微信获取地理位置失败，采用H5获取经纬度');
        console.log(err);

        new Fixtip({
            msg: '地理位置获取失败，请确定是否已开启GPS'
        });

        getLocation('h5').then((location) => {
            logLocation(location);
        }, (err) => {
            logError(err, 'h5获取地理位置失败');
            console.log(err);
        });
    });
    if (wx) {
        // 隐藏所有的分享入口
        wx.ready(() => {
            wx.hideAllNonBaseMenuItem();
            wx.hideOptionMenu();
        });
    }
    // loginOutAction();
    const $loginBtn = $('#button');
    btnAction($loginBtn);
});

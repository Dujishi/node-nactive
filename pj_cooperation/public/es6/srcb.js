
import loginModal from './module/login';
import Loading from '@ui/loading/wloading';
import { create } from '@util/common-page';
import { getLocation } from '@ui/getlocation';
// import { confirm } from '@ui/modal';
const Fixtip = require('@ui/fixtip');

let $codeBtn;

/**
 * 获取手机号
 */
const getPhone = () => {
    const $phoneInput = $('.phone-ipt');
    const phone = $phoneInput.val();
    if (/^1[034578]\d{9}$/.test(phone)) {
        return phone;
    }
    new Fixtip({
        msg: '请输入正确的手机号'
    });
    return false;
};

/**
 * 倒计时
 */
const countdown = () => {
    let time = 30;
    $codeBtn.html(`${time}s后重新获取`);
    const d = setInterval(() => {
        time--;
        $codeBtn.html(`${time}s后重新获取`);
        if (!time) {
            clearInterval(d);
            $codeBtn.removeClass('disabled');
            $codeBtn.html('获取验证码').removeClass(this.options.code.disableCls);
        }
    }, 1000);
};

/**
 * 发送短信验证码
 */
const sendCode = (phone, $btn) => {
    $btn.addClass('disabled');
    $.post('/feopen/login/code', {
        phone
    }).then((res) => {
        if (res.success) {
            if (res.data) {
                new Fixtip({
                    msg: res.data
                });
            }
            countdown();
        } else {
            $btn.removeClass('disabled');
            new Fixtip({
                msg: res.message
            });
        }
    }, () => {
        $btn.removeClass('disabled');
        new Fixtip({
            msg: '获取失败'
        });
    });
};

/**
 * 获取验证码
 */
const getCode = () => {
    const $codeInput = $('.code-ipt');
    const code = $codeInput.val();
    if (/^\d{4}$/.test(code)) {
        return code;
    }
    new Fixtip({
        msg: '请输入正确的验证码'
    });
    return false;
};

/**
 * 登录
 */
const loginAction = ($btn) => {
    const phone = getPhone();
    if (phone) {
        const code = getCode();
        if (code) {
            $btn.addClass('disabled');
            $.post('/feopen/login/index', {
                phone,
                code
            }).then((res) => {
                $btn.removeClass('disabled');
                if (res.success) {
                    gotoBuy();
                } else {
                    new Fixtip({
                        msg: res.message
                    });
                }
            }, () => {
                $btn.removeClass('disabled');
                new Fixtip({
                    msg: '登录失败'
                });
            });
        }
    }
};

/**
 * 获取短信验证码
 */
const codeAction = ($btn) => {
    const phone = getPhone();
    if (phone) {
        sendCode(phone, $btn);
    }
};

/**
 * 查看优惠券
 */
function gotoBuy() {
    location.href = '/feopen/user_center/index#coupon/srcb';
}

function btnAction($btn) {
    $btn.on('click', () => {
        if ($btn.hasClass('disabled')) {
            return;
        }
        const key = $btn.data('key');
        switch (key) {
        case 'unLogin': // 未登录的时候
            loginAction($btn);
            return;
        case 'canGo': // 已经领取了的时候
            gotoBuy();
            return;
        case 'getCode': // 获取短信验证码
            codeAction($btn);
            return;
        default:
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
        logError(err, '农商银行-微信获取地理位置失败，采用H5获取经纬度');

        getLocation('h5').then((location) => {
            logLocation(location);
        }, (err) => {
            logError(err, '农商银行-h5获取地理位置失败');
            console.log(err);
        });
    });
    // if (wx) {
    //     // 隐藏所有的分享入口
    //     wx.ready(() => {
    //         wx.hideAllNonBaseMenuItem();
    //         wx.hideOptionMenu();
    //     });
    // }
    // loginOutAction();
    const $loginBtn = $('#button');
    btnAction($loginBtn);

    $codeBtn = $('.btn-code');
    btnAction($codeBtn);
});

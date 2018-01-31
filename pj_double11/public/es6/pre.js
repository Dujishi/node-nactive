require('@ui/lazyload');
const login = require('@util/native-bridge/lib/login');
const ready = require('@util/native-bridge/lib/ready');
const Fixtip = require('@ui/fixtip');
const Common = require('@util/common-page');

const common = Common.create();
common.share();

/**
 * 登录
 * @param {Function} fn
 */
const loginAction = () => {
    if (window.CONF.isapp) {
        ready(() => {
            login().then((info) => {
                window.location.href = `${window.location.href}?userId=${info.userId}`;
            });
        });
    } else {
        window.location.href = `/feopen/login/index?url=${encodeURIComponent(window.location.href)}`;
    }
};

/**
 * 报名
 */
function signUp($btn) {
    $btn.addClass('disabled');
    $.post('signup').then((res) => {
        if (res.success) {
            $btn.html('已报名');
            new Fixtip({
                msg: '报名成功，等待短信通知',
                timer: 5000
            });
        } else if (res.code === -1) { // 未登录
            loginAction();
        } else {
            $btn.removeClass('disabled');
            new Fixtip({
                msg: res.message
            });
        }
    });
}

/**
 * 绑定事件
 */
function bindEvent() {
    const $btn = $('#button');

    $btn.on('tap', () => {
        if ($btn.hasClass('disabled')) {
            return;
        }
        signUp($btn);
    });
}

$(() => {
    $('img').lazyload({ effect: 'fadeIn' });

    bindEvent();
})
;

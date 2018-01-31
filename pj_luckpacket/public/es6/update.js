const Loading = require('@ui/loading/wloading');
const Fixtip = require('@ui/fixtip');
const isPhone = require('@util/string-util/is-phone');

const loading = new Loading(); // loading

/**
 * 加载红包信息
 */
function updatePhone(phone, $btn) {
    loading.show();
    $btn.addClass('disabled');
    $.post('/nactive/luckpacket/change', { phone }, (ret) => {
        loading.hide();
        if (ret && ret.success) {
            new Fixtip({
                msg: '更新成功'
            });
            window.setTimeout(() => {
                window.history.back();
            }, 3000);
        } else {
            $btn.removeClass('disabled');
            new Fixtip({
                msg: ret.message
            });
        }
    });
}

/**
 * 初始化
 */
function init() {
    bindEvent();
}

/**
 * 绑定事件
 */
function bindEvent() {
    const $btn = $('body').find('#confirm_btn');
    const $phone = $('body').find('#phone');

    // 登录绑定
    $btn.on('tap', () => {
        if ($btn.hasClass('disabled')) {
            return;
        }
        if (!isPhone($phone.val())) {
            new Fixtip({
                msg: '请输入正确的手机号'
            });
            return;
        }
        updatePhone($phone.val(), $btn);
    });

    $phone.on('input', () => {
        if ($phone.val().length > 0) {
            $btn.removeClass('disabled');
        } else {
            $btn.addClass('disabled');
        }
    });
}

$(() => {
    loading.hide();
    init();
})
;

const template = require('@util/xtpl/by-id');
const Common = require('@util/common-page');
const Loading = require('@ui/loading/wloading');
const Fixtip = require('@ui/fixtip');
const isPhone = require('@util/string-util/is-phone');

const loading = new Loading(); // loading

// const str = template('temp-tpl', { value: 1 });

/**
 * 渲染数据
 * @param {Object} data
 */
function renderData(data) {
    const mine = data.mine;
    const list = data.list;
    const isOptimum = data.isOptimum;


    $('#login_block').css({ display: 'none' });

    // is over
    const mineStr = template('mine_tpl', { mine });
    $('#mine_block').html(mineStr).css({ display: 'block' });

    const listStr = template('list_tpl', { list, isOptimum });
    $('#list_block').html(listStr).css({ display: 'block' });
}

/**
 * 加载红包信息
 */
function getPacketInfo(phone, $btn) {
    loading.show();
    $btn.addClass('disabled');
    $.post('/nactive/luckpacket/receive', { phone }, (ret) => {
        loading.hide();
        if (ret && ret.success) {
            renderData(ret.data);
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
    if (!window.CONF.islogin) {
        bindEvent();
    }
}

/**
 * 绑定事件
 */
function bindEvent() {
    const $btn = $('body').find('#login_btn');
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
        getPacketInfo($phone.val(), $btn);
    });
}

$(() => {
    loading.hide();
    init();

    const common = Common.create();
    common.share();

    // 提示
    if (window.CONF.status === 4) {
        window.setTimeout(() => {
            new Fixtip({
                msg: '已经领取过了哟~'
            });
        }, 1000);
    }
})
;

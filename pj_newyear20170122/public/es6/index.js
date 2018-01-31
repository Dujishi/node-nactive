const common = require('./module/common');

function bindEvent() {
    $('.detail-btn').on('tap', function() {
        $('.dialog').css('display', 'block');
    });

    $('.dialog-close').on('tap', function() {
        $('.dialog').css('display', 'none');
    });

    $('.join-btn').on('click', function() {
        if (window.CONF.isapp) {
            location.href = 'ddyc://home/vipBuy';
        } else {
            location.href = 'https://m.ddyc.com/feopen/vip/index';
        }
    });
}

$(() => {
    bindEvent();
    common.init(window.CONF).share();
});

const Common = require('@util/common-page');
const Fixtip = require('@ui/fixtip');
const Valid = require('./module/valid');
const IntervalCode = require('./module/interval_code');

function toast(msg) {
    new Fixtip({ msg });
}
function isOk(ret) {
    if (ret.success) {
        return true;
    }
    toast(ret.message);
}

function bindEvent() {
    const validAll = new Valid($('input[name]'));
    const validPhone = new Valid($('#phone'));

    const intervalCode = new IntervalCode($('#send-code'));
    intervalCode.setTemplate('{time}秒后重试');
    intervalCode.onTap(() => {
        validPhone.getFieldValue((err, data) => {
            if (err) {
                return toast(err);
            }
            $.ajax({
                url: './code',
                type: 'GET',
                dataType: 'json',
                data
            }).then((ret) => {
                if (isOk(ret)) {
                    intervalCode.startTask();
                    if (ret.data && ret.data.code) {
                        $('#code').val(ret.data.code);
                    }
                }
            });
        });
    });

    $('.js-get-coupons').on('tap', () => {
        validAll.getFieldValue((err, data) => {
            if (err) {
                return toast(err);
            }
            $.ajax({
                url: './coupons',
                type: 'GET',
                dataType: 'json',
                data
            }).then((ret) => {
                if (isOk(ret)) {
                    const data = ret.data;
                    const count = data.count;
                    if (count > 0) {
                        $('#residue').html(data.count);
                        $('.card-text3').html(`${data.beginTime}~${data.endTime}`);
                        $('.step-1').addClass('hide');
                        $('.step-2').removeClass('hide');
                    } else {
                        $('.step-1').addClass('hide');
                        $('.step-3').removeClass('hide');
                    }
                }
            });
        });
    });

    $('.js-use').on('tap', () => {
        window.location.href = window.CONF.washUrl;
    });
}

function initState() {
    const { isLogin, count } = window.CONF;
    let selector = '.step-1';
    if (isLogin) {
        if (count > 0) {
            selector = '.step-2';
        } else {
            selector = '.step-3';
        }
    }
    $(selector).removeClass('hide');
}

$(() => {
    bindEvent();
    initState();

    Common.create();
    // 隐藏右上角菜单
    window.wx && wx.ready(() => {
        wx.hideOptionMenu();
    });
});

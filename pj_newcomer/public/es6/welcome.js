const Fixtip = require('@ui/fixtip');
const Common = require('@util/common-page');
const CONF = window.CONF;

$(() => {

    const common = Common.create();
    common.share((type) => {
    });
    const analytics = Common.analytics;
    analytics.send();

    const message = (() => {
        let messageBox = $('#messageBox');

        function init() {
            close();
        }

        function close() {
            $('.tips-box-close').on('touchend', (e) => {
                messageBox.hide();
                window.location.href = 'http://dl.ddyc.com/';
                e.preventDefault();
            })
        }

        function showAlready() {
            messageBox.show();
            messageBox.find('.btn').on('touchend', () => {
                window.location.href = 'http://dl.ddyc.com/';
                e.preventDefault();
            });
        }

        function showSuccess(phone) {
            messageBox.find('.tips-box-title').text('您已领取成功！');
            messageBox.find('.tips-box-text .text').html(`玻璃水领取券已放至账户${phone}</br>登陆app，进入【我的】-【红包/券】查看，凭券到任一典典连锁门店兑换`).css({
                'line-height': '.5rem',
                'padding': '.6rem 0'
            });
            messageBox.find('.btn').text('立即使用').on('click', () => {
                window.location.href = 'http://dl.ddyc.com/';
            });
            messageBox.show();
        }

        return {
            init,
            showAlready,
            showSuccess
        }
    })();

    message.init();

    $('#openBtn').on('touchend', (e) => {
        $('.phone-box').fadeIn();
        $('.new-box').hide();
        e.preventDefault();
    });

    $('#getCode').on('touchend', (e) => {
        $('#phoneNum').blur();
        $('#codeInput').blur();
        $(this).focus();
        if ($('#phoneNum').val() == '') {
            new Fixtip({msg: '请输入手机号码'});
        } else if (!/1[034578]\d{9}/.test($('#phoneNum').val())) {
            new Fixtip({msg: '手机号码格式错误'});
        } else {
            $.post('welcome',{phone:$('#phoneNum').val()},(ret)=>{
                if(ret.success){
                    getPhoneCode();
                }else{
                    new Fixtip({msg: ret.message || '发送验证码失败，请重试！'});
                }
            });
        }
        e.preventDefault();
    });

    $('#getBtn').on('touchend', (e) => {
        if ($('#codeInput').val() == '') {
            new Fixtip({msg: '请先获取验证码'});
        } else if ($('#phoneNum').val() == '') {
            new Fixtip({msg: '请输入手机号码'});
        } else {
            $.post('/feopen/login/index', {
                phone: $('#phoneNum').val(),
                code: $('#codeInput').val(),
                referer_url: '',
            }, (data) => {
                if (!data) return;
                if (data.success) {
                    $.post('packet', {packet: 'newcomer', openId: CONF.openId}, (res) => {
                        if (res.success) {
                            message.showSuccess($('#phoneNum').val());
                        } else {
                            if (res.errCode == 'REPEAT_CODE') {
                                message.showAlready();
                            } else {
                                new Fixtip({
                                    msg: res.msg || res.message || '数据请求失败',
                                });
                            }
                        }
                    });
                    // $.post('welcome',{openId:CONF.openId},(res)=>{
                    //     if(!res.success){
                    //         message.showAlready();
                    //     }
                    // });

                } else {
                    new Fixtip({msg: data.message || '领取失败，请重试！'});
                }
            });
        }
        e.preventDefault();
    });

    function getPhoneCode() {
        $('#getCode').hide();
        $('#codeTimer').show();
        let num = 59;
        let timer = setInterval(function () {
            if ($('#codeTimer').find('span').text() > 0) {
                $('#codeTimer').find('span').text(num--);
            } else {
                clearInterval(timer);
                $('#getCode').show();
                $('#codeTimer').hide();
                $('#codeTimer').find('span').text(60);
            }
        }, 1000);

        $.post('/feopen/login/code', {phone: $('#phoneNum').val()}, (ret) => {
            if (ret && ret.success) {
                new Fixtip({msg: '验证码发送成功'});
            } else {
                new Fixtip({msg: ret.message || '发送验证码失败，请重试！'});
            }
        });
    }

});
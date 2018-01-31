const common = require('./module/common');
const utils = require('./module/utils');
const ready = require('@util/native-bridge/lib/ready');
const login = require('@util/native-bridge/lib/login');
const isLogin = require('@util/native-bridge/lib/isLogin');
const goToPage = require('@util/native-bridge/lib/goToPage');
const goToView = require('@util/native-bridge/lib/goToView');
const Fixtip = require('@ui/fixtip');
const Loading = require('@ui/loading/wloading');
const dialog = require('@ui/h5Dialog');
const fixedSticky  = require('@ui/fixed-sticky');

const mockUrls = {
    index: '/pj_seckill161016/public/mock/index.json',
    do_seckill: '/pj_seckill161016/public/mock/do_seckill.json',
    bind: '/pj_seckill161016/public/mock/bind.json',
    code: '/pj_seckill161016/public/mock/code.json',
};

const prodUrls = {
    index: '/nactive/seckill161016/index',
    do_seckill: '/nactive/seckill161016/do_seckill',
    bind: '/nactive/seckill161016/bind',
    code: '/nactive/seckill161016/code',
};

const urls = location.href.indexOf('debug') > -1 ? mockUrls : prodUrls;

let timeInited = false;

const wechat = {
    init: function() {
        getStatus({openId: CONF.openId});
    },
    login: function() {
        $('.login-dialog').removeClass('hide');
    },
    gotoViolation: function() {
        location.href = CONF.gotoUrlWechat || 'http://dl.ddyc.com/';
        // location.href = 'https://m.ddyc.com/wechat/index.php/Wash/menu.shtml?f=c';
        // location.href = 'https://m.ddyc.com/wechat/index.php/Wash/menu.shtml?f=c';
    },
    startSecKill: function() {
        startSecKill({openId: CONF.openId});
    },
    getVcode: function() {
        const phone = $('#phone').val();
        const $vcodeBtn = $('#vcode-btn');
        const text = $vcodeBtn.text();
        let timer = 0;
        let seconds = 30;

        const intervalHandler = function() {
            if (seconds <= 0) {
                $vcodeBtn.removeClass('disabled').text(text);
                clearInterval(timer);
            } else {
                $vcodeBtn.addClass('disabled').text('重新发送(' + seconds + ')')
                seconds--;
            }
        }

        if (utils.validatePhone(phone)) {
            $vcodeBtn.text('发送中...');
            Loading.show();
            $.get(urls.code, {
                phone: phone
            }, function(res) {
                Loading.hide();
                if (res.success) {
                    if (location.href.indexOf('new-active') > -1) {
                        showMsg('验证码：' + res.data.code);
                    }
                    intervalHandler();
                    timer = setInterval(function() {
                        intervalHandler();
                    }, 1000);
                } else {
                    showMsg(res.message || '请求失败');
                }
            });
        } else {
            showMsg('手机号格式不正确');
        }
    },
    dialogLogin: function() {
        const phone = $('#phone').val();
        const vcode = $('#vcode').val();
        if (!utils.validatePhone(phone)) {
            return showMsg('手机号格式不正确');
        }
        if (!vcode) {
            return showMsg('请填写验证码');
        }
        Loading.show();
        $.post(urls.bind, {
            phone: phone,
            code: vcode,
            openId: CONF.openId
        }, function(res) {
            Loading.hide();
            if (res.success) {
                $('.login-dialog').addClass('hide');
                getStatus({openId: CONF.openId});
            } else {
                showMsg(res.message || '请求失败');
            }
        });
    }
};

const app = {
    init: function() {
        ready(info => {
            if (isLogin) {
                this.info = info;
                getStatus({userId: info.userId});
            }
        });
    },
    login: function() {
        login().then( info => {
            if (info) {
                this.init();
            }
        });
    },
    gotoViolation: function() {
        const url = CONF.gotoUrlApp;
        if (url.indexOf('ddyc') === 0) {
            location.href = url;
        } else {
            goToView({
              id: url
            });
        }
    },
    startSecKill: function() {
        startSecKill({userId: this.info.userId});
    }
};

const browser = {
    init: function() {
        getStatus({});
    },
    login: function() {
        // location.href = encodeURIComponent('ddyc.car://mall?url=' + location.href);
        location.href = 'http://dl.ddyc.com/';
    }
};

const client = (function() {
    if (CONF.isapp) {
        return app;
    } else if (CONF.openId) {
        return wechat;
    } else {
        return browser;
    }
})();

// status 0: 未开始 1：进行中 2：已结束 login：未登录状态
// qualified 是否有秒杀资格
function changeStatus(data) {
    $('.conditions__item').addClass('hide');
    $('#status-2').addClass('hide');
    $('.operation a').addClass('hide');

    // 未开始和进行中需要展示是否具有秒杀资格
    if (data.status == 0 || data.status == 1) {
        if (data.qualified) {
            $('#status-1').removeClass('hide');
        } else {
            $('#status-0').removeClass('hide');
        }
    } else {
        $('#status-' + data.status).removeClass('hide');
    }

    // 已结束状态展示秒杀成功名单
    if (data.status == 2) {
        $('#winner-phone').text(data.phone);
        $('#prize').text(data.product);
        $('.time').html('秒杀已结束').removeClass('hide');
        $('.conditions').addClass('hide');
    } else {
        $('.conditions').removeClass('hide');
        if (!timeInited) {
            initTime(data.timestamp ,CONF.startTime);
            timeInited = true;
        }
    }

    $('#btn-' + data.status).removeClass('hide');
    $('.operation').removeClass('hide');
}

function getStatus(data) {
    Loading.show();
    $.extend(data, {active: CONF.type});
    $.post(urls.index, data, function(res) {
        Loading.hide();
        let data = res.data;
        if (res.success) {
            changeStatus(data);
        } else {
            if (res.code == -1) {
                data.status = 'login';
                changeStatus(data);
            } else if (res.code == 500) {
                dialog.alert({
                    content: res.message || res.msg || '请求失败',
                    callback: function() {
                        location.reload();
                    }
                });
            } else {
                new Fixtip({msg: res.message || '请求失败'});
            }
        }
    },'json');
}

function initTime(now, startTime) {
    const $time = $('.time');

    $time.removeClass('hide');

    if (now >= startTime) {
        $time.html(`距离秒杀开始还有：<em>00</em>时<em>00</em>分<em>00</em>秒`);
        return;
    }

    utils.timeDown(function(res) {
        if (res.nD == '00') {
            $time.html(`距离秒杀开始还有：<em>${res.nH}</em>时<em>${res.nM}</em>分<em>${res.nS}</em>秒`);
        } else {
            $time.html(`距离秒杀开始还有：<em>${res.nD}</em>天<em>${res.nH}</em>时<em>${res.nM}</em>分<em>${res.nS}</em>秒`);
        }

        if (res.type == 0) {
            // $('#btn-login').addClass('hide');
            if (!$('#btn-0').hasClass('hide')) {
                $('#btn-0').addClass('hide');
                $('#btn-1').removeClass('hide');
            }
        }
        
    }, now, startTime);
}

function startSecKill(data) {
    Loading.show();
    $.post(urls.do_seckill, $.extend({
        type: CONF.type
    }, data), function(res) {
        Loading.hide();
        const data = res.data;
        if (res.success) {
            $('#success-dialog').removeClass('hide');
        } else {
            dialog.alert({
                content: res.message || res.msg || '请求失败',
                callback: function() {
                    location.reload();
                }
            });
            // new Fixtip({ msg: res.message || res.msg || '请求失败' });
        }
        $('#btn-1').addClass('hide');
        $('#btn-2').removeClass('hide');
    });
}

function showMsg(msg) {
    new Fixtip({msg: msg, bottom: '63%'});
}

function bindEvent() {
    const $window = $(window);
    const $time = $('.time');
    const $banner = $('.banner');

    $('#btn-login').on('tap', function() {
        client.login();
    });

    $('#violation-btn').on('tap', function() {
        client.gotoViolation();
    });

    $('.seckill-btn').on('tap', function() {
        client.startSecKill();
    });

    $('#success-dialog .ui-btn').on('tap', function() {
        $('#success-dialog').addClass('hide');
        location.reload();
    });

    $('#vcode-btn').on('tap', function() {
        if (!$(this).hasClass('disabled')) {
            client.getVcode();
        }
    });

    $('#login-dialog-btn').on('tap', function() {
        client.dialogLogin();
    });

    $('.dialog__close').on('tap', function() {
        $(this).parents('.dialog').addClass('hide');
    });

    fixedSticky.init('.time');

    // $window.on('scroll', function() {
    //     if ($window.scrollTop() >= 200) {
    //         $time.addClass('fixed');
    //     } else {
    //         $time.removeClass('fixed');
    //     }
    // })
}


$(function() {
    common.init(CONF).share();
    client.init();
    bindEvent();
});
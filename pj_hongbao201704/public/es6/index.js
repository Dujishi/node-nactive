const Fixtip = require('@ui/fixtip');
//const common = require('./module/common');
const Common = require('@util/common-page');
const Loading = require('@ui/loading/wloading');
Loading.show();
$(() => {

    const commons = Common.create();
    const analytics = Common.analytics;
    commons.share((type) => {},{
        shareContent  : '洗车、美容、保养、违章代缴、加油充值、车险、年检，养车专属管家，尽在典典！',
        shareTitle    : '典典养车送你160元新人红包',
        shareSubTitle : '洗车、美容、保养、违章代缴、加油充值、车险、年检，养车专属管家，尽在典典！',
        shareImgUrl   : 'http://store.ddyc.com/res/xkcdn/icons/share/icon_hongbao20161031.png'
    });
    const config = window.CONF;
    //common.init(config).share();
    const reg = /^1\d{10}$/;
    const $initHeader = $('.init');
    const $successHeader = $('.get-success');
    const $hasGet = $('.has-get');
    const $oldUser = $('.old-user');

    const $btn = $('.btn');
    const $getBtn = $('.get-btn');
    const $openBtn = $('.openapp-btn');
    const $goappBtn = $('.goapp-btn');
    const $shareBtn = $('.share-btn');
    const isNewUserGet = localStorage.getItem('isNewUserGet');


  // 跳到下载页面
    function gotodl() {
        window.location = 'http://dl.ddyc.com';
    }

    $('.first').on('tap', '.get-btn', () => {
        const iptVal = $('.input').val().trim();
        if (iptVal == '') {
            new Fixtip({
                msg: '手机号码不能为空'
            });
        } else if (!reg.test(iptVal)) {
            new Fixtip({
                msg: '请填写正确的手机号码格式'
            });
        } else {
            if (window.CONF.iswechat) {
                $.post('/nactive/hongbao201704/bind', {
                    phone: iptVal,
                    openId: window.CONF.openid,
                }, (res) => {
                    if (res.success) {
                        return true;
                    }
                });
            }
            $.post('/nactive/hongbao201704/index', {
                phone: iptVal
            }, (res) => {
                if (res.success) {
                    if (res.data) {
                        if (isNewUserGet == iptVal) {
              // 新用户刚刚领过
                            $btn.addClass('hide');
                            $goappBtn.removeClass('hide');
                            $initHeader.addClass('hide');
                            $hasGet.removeClass('hide');
                        } else {
                            analytics.event('hongbao_user', iptVal);
                            $('.phone-text').html(iptVal);
                            $btn.addClass('hide');
                            $openBtn.removeClass('hide');
                            localStorage.setItem('isNewUserGet', iptVal);
                            $initHeader.addClass('hide');
                            $successHeader.removeClass('hide');
                        }
                    } else {
                        $getBtn.addClass('hide');
                        $shareBtn.removeClass('hide');
                        $initHeader.addClass('hide');
                        $oldUser.removeClass('hide');
                    }
                } else {
                    new Fixtip({
                        msg: res.message || '操作失败！'
                    });
                }
            });
        }
    })
    .on('tap', '.openapp-btn', gotodl)
    .on('tap', '.goapp-btn', gotodl)
    .on('tap', '.share-btn', () => {
        if (!window.CONF.isapp) {
            window.location.href = 'http://dl.ddyc.com';
        } else {
            $('.share').removeClass('hide');
        }
    });

    $('.share').on('tap', '.close', () => {
        $('.share').addClass('hide');
    });

  // 首屏的大图加载完成 loading 消失
    const imgdefereds = [];
    $('.img-banner').each(function () {
        const dfd = $.Deferred();
        $(this).bind('load', () => {
            dfd.resolve();
        }).bind('error', () => {
      // 图片加载错误，加入错误处理

        });
        if (this.complete) {
            setTimeout(() => {
                dfd.resolve();
            }, 1000);
        }
        imgdefereds.push(dfd);
    });
    $.when.apply(null, imgdefereds).done(() => {
        Loading.hide();
    });
});

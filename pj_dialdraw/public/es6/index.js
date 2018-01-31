/*
 * @Author: Yard
 * @Date: 2016-12-30 16:17:21
 * @Last Modified by: rocksandy
 * @Last Modified time: 2017-02-22 17:27:23
 */
const ready = require('@util/native-bridge/lib/ready');
const login = require('@util/native-bridge/lib/login');
const isLogin = require('@util/native-bridge/lib/isLogin');
const modal = require('@ui/modal');
const Loading = require('@ui/loading/wloading');
const Fixtip = require('@ui/fixtip');
const win = require('./module/win');
const Common = require('@util/common-page');
const goToPage = require('@util/native-bridge/lib/goToPage');
const Tween = require('@ui/tween');

const loading = new Loading();

const isApp = window.CONF.isapp;
let userId = null;
let status = null;
let giftType = null;

// 中奖信息滚动
const roll = () => {
    const $lun = $('.swiper ul');
    let i = 1;
    const updateList = () => {
        $lun.css('transition', 'none').css('-webkit-transition', 'none');
        $lun.css('transform', 'translateY(0px)').css('-webkit-transform', 'translateY(0px)');
    };
    setInterval(() => {
        $lun.css('transition', 'all 1s ease-in-out').css('-webkit-transition', 'all 1s ease-in-out');
        $lun.css('transform', `translateY(${-0.4 * i}rem)`).css('-webkit-transform', `translateY(${-0.4 * i}rem)`);
        i++;
        if (i === 20) {
            updateList();
            i = 1;
        }
    }, 3000);
};

const getStatus = (data) => {
    const $node = $('.status-text');
    const $circle = $('.bg');
    const $cover = $('.cover');
    const $point = $('.point');
    const cssChange = (title, rotate, point, sub = '') => {
        $node.html(`<div class="code1">${title}</div>${sub}`);
        $circle.css('transition', 'none').css('-webkit-transition', 'none').css('transform', `rotate(${rotate}deg)`).css('-webkit-transform', `rotate(${rotate}deg)`);
        $point.addClass(point);
        $cover.removeClass('hide');
    };
    switch (data.type) {
    case 'ticket':
        cssChange('恭喜您已抽中《一万公里的约定》<br />电影票2张', '30', 'point2');
        break;
    case 'wash_0':
        cssChange('恭喜您已抽中0元精致洗车券', '150', 'point1', '<div class="join1">通知好友</div>');
        break;
    case 'wash_10':
        cssChange('恭喜您已抽中10元精洗红包', '90', 'point1', '<div class="join1">通知好友</div>');
        break;
    case 'gas_10':
        cssChange('恭喜您已抽中10元加油红包', '210', 'point1', '<div class="join1">通知好友</div>');
        break;
    case 'go':
        cssChange('恭喜您已抽中行车记录仪', '-30', 'point1', '<div class="join1">通知好友</div>');
        break;
    case 'wash_1':
        cssChange('恭喜您已抽中0元欧式精洗券', '90', 'point1', '<div class="join1">通知好友</div>');
        break;
    case 'wash_2':
        cssChange('恭喜您已抽中0元内室清洗券', '-90', 'point1', '<div class="join1">通知好友</div>');
        break;
    case 'wzdb_0':
        cssChange('恭喜您已抽中0元违章代办券', '30', 'point1', '<div class="join1">通知好友</div>');
        break;
    default:
        cssChange('恭喜您已抽中30万保障金', '270', 'point1', '<div class="join1">通知好友</div>');
    }
};

// 初始化请求数据
const init = () => {
    const $node = $('.status-text');
    loading.show();
    $.get('/nactive/dialdraw/status', { userId, }, (res) => {
        if (res.success) {
            status = res.code;
            giftType = res.data.type;
            if (status === 0) {
                $node.html('<div class="code0">恭喜您获得抽奖资格</div>');
            } else if (status === -1) {
                $node.html('<div class="code2">您不符合抽奖资格哦</div><div class="description">4.1~4.9 期间加入典典VIP即可抽奖</div>');
            } else if (status === -3) {
                getStatus(res.data);
                giftType = res.data.type;
            }
            loading.hide();
        } else {
            new Fixtip({
                msg: '接口请求失败,请刷新重试',
            });
        }
    });
};
// win.setClose(false)
//         .setTitle(true)
//         .setText('<i>获得《一万公里的约定》电影票2张<br />兑换方式已经发送至您的手机请注意查收</i>')
//         .setBtnText('知道了')
//         .show(() => {});

// 弹窗模板
const getModal = (type) => {
    switch (type) {
    case 'ticket':
        win.setClose(false)
        .setTitle(true)
        .setText('<i>获得《一万公里的约定》电影票2张<br />兑换方式已经发送至您的手机请注意查收</i>')
        .setBtnText('知道了')
        .show(() => {});
        break;
    case 'wash_0':
        win.setClose(true)
        .setTitle(true)
        .setText('获得0元精致洗车券')
        .setBtnText('立即查看')
        .show(() => {
            window.location.href = 'ddyc://wallet/couponAndRedPacket';
        });
        break;
    case 'wash_1':
        win.setClose(true)
        .setTitle(true)
        .setText('获得0元欧式精洗券')
        .setBtnText('立即查看')
        .show(() => {
            window.location.href = 'ddyc://wallet/couponAndRedPacket';
        });
        break;
    case 'wash_2':
        win.setClose(true)
        .setTitle(true)
        .setText('获得0元内室清洗券')
        .setBtnText('立即查看')
        .show(() => {
            window.location.href = 'ddyc://wallet/couponAndRedPacket';
        });
        break;
    case 'wzdb_0':
        win.setClose(true)
        .setTitle(true)
        .setText('获得0元违章代办券')
        .setBtnText('立即查看')
        .show(() => {
            window.location.href = 'ddyc://wallet/couponAndRedPacket';
        });
        break;
    case 'wash_10':
        win.setClose(true)
        .setTitle(true)
        .setText('获得10元欧式精洗红包')
        .setBtnText('立即查看')
        .show(() => {
            window.location.href = 'ddyc://wallet/couponAndRedPacket';
        });
        break;
    case 'gas_10':
        win.setClose(true)
        .setTitle(true)
        .setText('获得10元加油卡充值红包 ')
        .setBtnText('立即查看')
        .show(() => {
            window.location.href = 'ddyc://wallet/couponAndRedPacket';
        });
        break;
    case 'go':
        win.setClose(true)
        .setTitle(true)
        .setText('获得行车记录仪')
        .setBtnText('立即查看')
        .show(() => {
            window.location.href = 'ddyc://wallet/couponAndRedPacket';
        });
        break;
    case 'no':
        win.setClose(true)
        .setTitle(false)
        .setText('您不符合抽奖条件哦~', '4.1~4.9加入典典VIP获得抽奖资格')
        .setBtnText('通知好友参与')
        .show(() => {
            $('.share').removeClass('hide');
        });
        break;
    case 'novip':
        win.setClose(true)
        .setTitle(false)
        .setText('您还没加入典典VIP<br />不能参与抽奖哦~')
        .setBtnText('加入典典VIP')
        .show(() => {
            window.location.href = 'ddyc://home/vipBuy';
        });
        break;
    default:
        win.setClose(true)
        .setTitle(true)
        .setText('获得30万元疾病保障 ')
        .setBtnText('立即领取')
        .show(() => {
            goToPage({
                type: 1,
                url: 'https://wx.chinamuxie.com/act/channel/a/share/1a58e3e49d544000b658934e36487ddf',
            });
        });
        break;
    }
};

const bindEvent = () => {
    const $node = $('.point');
    const $circle = $('.bg');
    const $join = $('.join');
    const $cover = $('.cover');
    const $body = $('body');
    const $share = $('.share');
    const $title = $('.title');
    const $arrow = $('.arrow');
    const testUserId = (fun) => {
        if (userId !== null && userId !== 0 && userId !== '0') {
            fun();
        } else if (!isApp) {
            new modal.Modal({
                title: '', // 可以为空
                msg: '此操作需要在典典养车APP内完成，有APP，去打开；没APP，去下载~',
                inputType: '', // 输入框类型。为空时，不显示输入框
                btns: [{
                    text: '取消',
                }, {
                    text: '去下载',
                    onTap: () => { window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.chediandian.customer&g_f=995720'; },
                }],
            });
        } else {
            login().then((data) => {
                userId = data.userId;
                init();
            });
        }
    };

    const anim = (type) => {
        switch (type) {
        case 'ticket':
            $circle.addClass('ani5');
            break;
        case 'wash_0':
            $circle.addClass('ani1');
            break;
        case 'wash_10':
            $circle.addClass('ani6');
            break;
        case 'gas_10':
            $circle.addClass('ani2');
            break;
        case 'go':
            $circle.addClass('ani4');
            break;
        default:
            $circle.addClass('ani3');
        }
    };

    // 跳转至年卡
    $join.on('touchend', () => {
        testUserId(() => {
            window.location.href = 'ddyc://home/vipBuy';
        });
    });
    // 抽奖接口
    $node.on('touchend', () => {
        testUserId(() => {
            if (status === 0) {
                loading.show();
                $.get('/nactive/dialdraw/prize', { userId, }, (res) => {
                    loading.hide();
                    if (res.success) {
                        giftType = res.data.type;
                        anim(giftType);
                        status = -3;
                        setTimeout(() => {
                            getModal(giftType);
                            getStatus(res.data);
                            $cover.removeClass('hide');
                        }, 2000);
                    } else {
                        new Fixtip({
                            msg: res.message,
                        });
                    }
                });
            } else if (status === -1) {
                getModal('no');
            } else if (status === -2) {
                getModal('novip');
            }
        });
    });

    $body.on('touchend', '.point1', () => {
        switch (giftType) {
        case 'no':
            win.setClose(true)
        .setTitle(false)
        .setText('您不符合抽奖条件哦~', '2.23~2.28加入典典VIP获得抽奖资格')
        .setBtnText('通知好友参与')
        .show(() => {
        });
            break;
        case 'novip':
            win.setClose(true)
        .setTitle(false)
        .setText('您还没加入典典VIP<br />不能参与抽奖哦~>')
        .setBtnText('加入典典VIP')
        .show(() => {
            window.location.href = 'ddyc://home/vipBuy';
        });
            break;
        default:
            window.location.href = 'ddyc://wallet/couponAndRedPacket';
            // goToPage({
            //     type: 1,
            //     url: 'ddyc://wallet/couponAndRedPacket',
            // });
        }
    });
    $body.on('touchend', '.point2', () => {
        $share.removeClass('hide');
    });

    $body.on('touchend', '.join1', () => {
        $share.removeClass('hide');
    });
    $body.on('touchstart', '.modal', () => false);
    $body.on('touchstart', '.share', () => false);

    $share.on('touchend', () => {
        $share.addClass('hide');
    });

    const scrollTopSelf = (el) => {
        new Tween({
            easing: 'easeOut',
            frame: 40,
            delay: 0,
            time: 200
        }).from({ y: el.scrollTop() })
            .to({ y: el.height() - el.scrollTop() })
            .on('update', (obj) => {
                el.scrollTop(obj.y);
            })
            .start();
    };

    $title.on('tap', () => {
        scrollTopSelf($body);
    });
    $arrow.on('tap', () => {
        scrollTopSelf($body);
    });
};


$(() => {
    roll();
    loading.hide();
    ready((info) => {
        if (isLogin()) {
            userId = info.userId;
            init();
        }
    });
    bindEvent();
    const common = Common.create();
    common.share(() => {
        $('.share').addClass('hide');
    });
});


/*
 * @Author: Yard
 * @Date: 2016-12-30 16:17:21
 * @Last Modified by: rocksandy
 * @Last Modified time: 2017-02-22 17:27:23
 */
const login = require('@util/native-bridge/lib/login');
const callShare = require('@util/native-bridge/lib/callShare');
const ready = require('@util/native-bridge/lib/ready');
const Loading = require('@ui/loading/wloading');
const Fixtip = require('@ui/fixtip');
const Common = require('@util/common-page');
const win = require('./module/win');
const Tween = require('@ui/tween');

const loading = new Loading();
const analytics = Common.analytics;

const isApp = window.CONF.isapp;
let giftType = null;
let giftInfo = null;
let lastAni = '';
// 分享
const shareObj = {
    url: window.CONF.shareUrl,
    title: window.CONF.shareTitle,
    subTitle: window.CONF.shareSubTitle,
    image: window.CONF.shareImgUrl,
    content: window.CONF.shareContent, // '已有{{shareNumber}}个人参与抽奖，就等你了'
};

// 中奖信息滚动
const roll = () => {
    const $lun = $('.swiper ul');
    const len = $lun.find('li').length;
    let i = 1;
    const updateList = () => {
        $lun.css('transition', 'none').css('-webkit-transition', 'none');
        $lun.css('transform', 'translateY(0px)').css('-webkit-transform', 'translateY(0px)');
    };
    setInterval(() => {
        $lun.css('transition', 'all 1s ease-in-out').css('-webkit-transition', 'all 1s ease-in-out');
        $lun.css('transform', `translateY(${-0.4 * i}rem)`).css('-webkit-transform', `translateY(${-0.4 * i}rem)`);
        i++;
        if (i === len) {
            updateList();
            i = 1;
        }
    }, 3000);
};

/**
 * 登录
 * @param {Function} fn
 */
const loginAction = () => {
    if (isApp) {
        login().then((info) => {
            window.location.href = `${window.location.href}?userId=${info.userId}`;
        });
    } else {
        window.location.href = `/feopen/login/index?url=${encodeURIComponent(window.location.href)}`;
    }
};

/**
 * 记录分享
 */
const recordShare = (fn) => {
    $.post('/nactive/turntable/times', {}, () => {
        getTimes();
        if (fn) {
            fn();
        }
    });
};

/**
 * 获取抽奖记录
 */
const listHandler = (list) => {
    // 拼装列表
    const html = [];
    let flag = false;
    if (list && list.length > 0) {
        list.sort((a, b) => {
            const a1 = (new Date(a.date)).getTime();
            const b1 = new Date(b.date).getTime();
            return a1 - b1;
        });
        list.forEach((it) => {
            if (it.prize === 'prize_5') {
                return;
            }
            let btn = '';
            if (it.type === 'sw') {
                flag = true;
                if (it.order) {
                    if (it.paid) {
                        btn = `<a href="javascript:;" data-orderid="${it.orderId}" data-prize="${it.prize}" class="goorder">立即查看</a>`;
                    } else {
                        btn = `<a href="javascript:;" data-orderid="${it.orderId}" data-prize="${it.prize}" class="goorder">支付1元</a>`;
                    }
                } else {
                    btn = `<a href="javascript:;" data-prize="${it.prize}" class="gopay">支付1元</a>`;
                }
            } else if (it.type === 'hb') {
                btn = '<a href="javascript:;" class="gouse">立即使用</a>';
            }
            html.push(`<li><p>${it.name}</p><p>${it.date}</p>${btn}</li>`);
        });
    } else {
        html.push('<li class="empty">暂无中奖记录哦~</li>');
    }
    let tips = '';
    if (flag) {
        tips = '<p>抽中礼包奖品后，请尽快完成支付哦~</p>';
    }

    win.setClose(true)
        .setTitle('中奖记录')
        .setText(`<div class="records"><ul>${html.join('')}</ul><div class="tips"><p>温馨提示：</p><p>每天登录APP访问活动页面、分享、APP下单均可获得抽奖机会</p>${tips}</div></div>`)
        .setBtnText(false)
        .show();
};
const getRecordList = () => {
    loading.show();
    $.get('/nactive/turntable/record', {}, (res) => {
        loading.hide();
        if (res.success) {
            listHandler(res.data || []);
        } else if (res.code === -1) {
            // 未登录
            loginAction();
        } else {
            new Fixtip({
                msg: '接口请求失败,请刷新重试',
            });
        }
    });
};

/**
 * 获取抽奖次数
 */
const getTimes = () => {
    const $node = $('#times');
    const $stimes = $('.s-times');
    const $nLogin = $('.n-login');
    loading.show();
    $.get('/nactive/turntable/status', {}, (res) => {
        loading.hide();
        if (res.success) {
            $stimes.css({ display: 'block' });
            $nLogin.css({ display: 'none' });
            $node.html(res.data);

            loading.hide();
        } else if (res.code === -1) {
            // 未登录
            // loginAction();
        } else {
            new Fixtip({
                msg: '接口请求失败,请刷新重试',
            });
        }
    });
};

/**
 * 去支付判断
 */
const goPay = (prize) => {
    loading.show();
    $.post('/nactive/turntable/pay', { prize }, (ret) => {
        loading.hide();
        if (ret && ret.success) {
            analytics.event('click', { triggerType: '去支付' });
            window.location.href = ret.data.url;
        } else {
            new Fixtip({
                msg: ret.message
            });
        }
    });
};

/**
 * app
 */
const appAction = {
    getHbBtnTxt(isShared) {
        return isShared ? '分享给好友炫耀一下~' : '分享给好友，再抽一次';
    },
    getNoBtnTxt(isShared) {
        return isShared ? '分享给好友安慰一下~' : '分享给好友，再抽一次';
    },
    getSMBtnTxt(isShared) {
        return isShared ? ['求安慰', '注册领取'] : ['分享再抽一次', '注册领取'];
    },
    getSwBtnTxt() {
        return '立即支付';
    },
    goPay(prize) {
        goPay(prize);
    },
    goOrder(orderId) {
        if (orderId) {
            window.location.href = `com.xk.ddyc://order/orderDetail?id=${orderId}`;
            return;
        }
        window.location.href = 'com.xk.ddyc://order/orderList';
    },
    packetUse() {
        window.location.href = 'com.xk.ddyc://wallet/couponAndRedPacket';
    },
    swBtnAc() {
        goPay(giftInfo.prize);
        // ready(() => {
        //     callShare(shareObj).then((ret) => {
        //         if (ret.status === 1) {
        //             win.setClose(true)
        //             .setTitle('人家等您好久啦')
        //             .setText(null, giftInfo.sub1, giftInfo.sub2)
        //             .setBtnText('立即支付')
        //             .show(() => {
        //                 goPay(giftInfo.prize);
        //             });
        //             recordShare();
        //             analytics.event('click', { triggerType: 'APP领取实物后，并且分享成功', appType: 'app' });
        //         }
        //     });
        // });
        // return false;
    },
    hbBtnAc() {
        ready(() => {
            callShare(shareObj).then((ret) => {
                if (ret.status === 1) {
                    recordShare();
                    analytics.event('click', { triggerType: 'APP领取红包后，并且分享成功', appType: 'app' });
                }
            });
        });
        return false;
    },
    noBtnAc() {
        ready(() => {
            callShare(shareObj).then((ret) => {
                if (ret.status === 1) {
                    recordShare();
                    analytics.event('click', { triggerType: 'APP领取红包后，并且分享成功', appType: 'app' });
                }
            });
        });
        return false;
    },
    smBtnAc() {
        return [function () {
            ready(() => {
                callShare(shareObj).then((ret) => {
                    if (ret.status === 1) {
                        recordShare();
                        analytics.event('click', { triggerType: 'APP领取红包后，并且分享成功', appType: 'app' });
                    }
                });
            });
            return false;
        }, function () {
            window.location.href = 'https://s.growingio.com/wK48Bb';
        }];
    }
};

/**
 * wechat
 */
const wechatAction = {
    getSMBtnTxt() {
        return ['获更多机会', '注册领取'];
    },
    getNoBtnTxt() {
        return '下载典典养车，获取更多机会';
    },
    getHbBtnTxt() {
        return '下载典典养车，获取更多机会';
    },
    goPay() {
        window.location.href = 'http://dl.ddyc.com';
    },
    goOrder() {
        window.location.href = 'http://dl.ddyc.com';
    },
    packetUse() {
        window.location.href = 'http://dl.ddyc.com';
    },
    hbBtnAc() {
        window.location.href = 'http://dl.ddyc.com';
    },
    noBtnAc() {
        window.location.href = 'http://dl.ddyc.com';
    },
    smBtnAc() {
        return [function () {
            window.location.href = 'http://dl.ddyc.com';
        }, function () {
            window.location.href = 'https://s.growingio.com/wK48Bb';
        }];
    }
};

/**
 * 获取按钮行为
 */
const action = isApp ? appAction : wechatAction;
const getBtnAction = (type, isShared) => {
    if (type === 'hb') {
        return {
            txt: action.getHbBtnTxt(isShared),
            fn: action.hbBtnAc
        };
    } else if (type === 'sw') {
        return {
            txt: action.getSwBtnTxt(),
            fn: action.swBtnAc
        };
    } else if (type === 'sm') {
        return {
            txt: action.getSMBtnTxt(isShared),
            fn: action.smBtnAc()
        };
    }
    return {
        txt: action.getNoBtnTxt(isShared),
        fn: action.noBtnAc
    };
};

// 弹窗模板
const getModal = (type, sub1, sub2, sub3, isShared) => {
    const btnAct = getBtnAction(type, isShared);
    switch (type) {
    case 'hb':
        win.setClose(true)
            .setTitle('恭喜您中奖啦')
            .setText(null, sub1, sub2, sub3)
            .setBtnText(btnAct.txt)
            .show(btnAct.fn);
        break;
    case 'sw':
        win.setClose(true)
            .setTitle('恭喜你中奖啦')
            .setText(null, sub1, sub2, sub3)
            .setBtnText(btnAct.txt)
            .show(btnAct.fn);
        break;
    case 'sm':
        win.setClose(true)
            .setTitle('恭喜你中奖啦')
            .setText(null, '<span>588</span><span>元</span>', '蜜蜂聚财理财红包', sub3)
            .setBtnText(btnAct.txt)
            .show(btnAct.fn);
        break;
    default:
        win.setClose(true)
            .setTitle('很遗憾，奖品溜走了')
            .setText('<div class="packet-no"><img src="/pj_turntable/public/images/kq.png"/></div>')
            .setBtnText(btnAct.txt)
            .show(btnAct.fn);
        break;
    }
};

const bindEvent = () => {
    const $node = $('.point');
    const $circle = $('.bg');
    const $body = $('body');
    const $share = $('.share');
    const $title = $('.title');
    const $arrow = $('.arrow');
    const $nLogin = $('.n-login');

    const anim = (type) => {
        if (lastAni) {
            $circle.removeClass(lastAni);
        }
        let ani = '';
        switch (type) {
        case 'prize_1':
            ani = 'ani6';
            break;
        case 'prize_2':
            ani = 'ani2';
            break;
        case 'prize_3':
            ani = 'ani4';
            break;
        case 'prize_4':
            ani = 'ani3';
            break;
        case 'sw':
            ani = 'ani5';
            break;
        case 'sm':
            ani = 'ani1';
            break;
        default:
            ani = 'ani7';
        }
        if (lastAni) {
            setTimeout(() => {
                $circle.addClass(ani);
            }, 2000);
        } else {
            $circle.addClass(ani);
        }
        lastAni = ani;
    };

    // 跳转至登录
    $nLogin.on('touchend', () => {
        loginAction();
    });

    // 列表支付
    $('body').on('touchend', '.gopay', function () {
        const prize = $(this).data('prize');
        action.goPay(prize);
    });

    $('body').on('touchend', '.goorder', function () {
        const orderid = $(this).data('orderid');
        action.goOrder(orderid);
    });

    // 红包去使用
    $('body').on('touchend', '.gouse', () => {
        action.packetUse();
    });

    // 抽奖接口
    let prizing = false;
    $node.on('touchend', () => {
        if (prizing) {
            return;
        }
        loading.show();
        prizing = true;
        $.get('/nactive/turntable/prize', {}, (res) => {
            loading.hide();
            if (res.success) {
                giftInfo = res.data;
                giftType = res.data.type;
                // $cover.addClass('hide');
                let prize = res.data.prize;
                if (giftType === 'sw') {
                    prize = 'sw';
                }
                anim(prize);
                setTimeout(() => {
                    getModal(giftType, res.data.sub1, res.data.sub2, res.data.sub3, res.data.isShared);
                    // $cover.removeClass('hide');
                    prizing = false;
                    getTimes();
                }, 2000);
                analytics.event('click', { triggerType: '抽奖成功', prize, giftType });
                if (res.data.shareNumber) {
                    const shareContent = `已有${res.data.shareNumber}个人参与抽奖，就等你了`;
                    shareObj.content = shareContent;
                    shareObj.subTitle = shareContent;
                    window.CONF.content = shareContent;
                    window.CONF.shareSubTitle = shareContent;
                }
            } else if (res.code === -1) {
                // 未登录
                loginAction();
            } else {
                prizing = false;
                new Fixtip({
                    msg: res.message,
                });
            }
        });
        analytics.event('click', { triggerType: '点击抽奖按钮' });
    });

    // 中奖记录
    $body.on('touchend', '.join', () => {
        getRecordList();
    });
    // $body.on('touchstart', '.modal', () => false);
    // $body.on('touchstart', '.share', () => false);

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


// 初始化请求数据
const init = () => {
    $(document).on('ajaxBeforeSend', (e, xhr) => {
        xhr.setRequestHeader('xkzone', 'lottery');
    });
    getTimes();
    bindEvent();
};

$(() => {
    roll();
    init();
    loading.hide();
    const common = Common.create();
    common.share((type, ret) => {
        recordShare();
        if (ret && ret.status === 1) {
            analytics.event('click', { triggerType: '页面分享成功', appType: type });
        }
    });
});

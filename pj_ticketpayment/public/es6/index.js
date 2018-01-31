/*
 * @Author: Yard
 * @Date: 2016-12-21 17:11:38
 * @Last Modified by: Yard
 * @Last Modified time: 2017-01-17 13:52:46
 */
const createFullpageAnimate = require('@ui/fullpage-animate');
const Common = require('@util/common-page');
const norepeat = require('@ui/norepeat-event');
const goToView = require('@util/native-bridge/lib/goToView');
const modal = require('@ui/modal');
const ready = require('@util/native-bridge/lib/ready');
const isLogin = require('@util/native-bridge/lib/isLogin');
const login = require('@util/native-bridge/lib/login');
const Fixtip = require('@ui/fixtip');

const isApp = window.CONF.isapp;
const isWechat = true || window.CONF.iswechat;
let phone = null;
let userId = null;
let status = false;

// 获取手机号和userId
const getPhone = () => {
    // 判断app和微信端 获取phone值
    if (isApp) {
        ready((info) => {
            if (isLogin()) {
                phone = info.phone;
                userId = info.userId;
            }
        });
    } else if (isWechat) {
        if (window.CONF.phone !== '') {
            phone = window.CONF.phone;
            userId = window.CONF.userId;
        }
    }
};

const bindEvent = () => {
    const $nextPage = $('.next-page');
    const $getPresent = $('.page3-button1');
    const $viewPresent = $('.page4-button1');
    let countFlag = 0;

    const fullpageAnimate = createFullpageAnimate({
        afterMove: (index, count) => {
            if (index >= count - 2) {
                $nextPage.hide();
            } else {
                $nextPage.show();
            }
            countFlag = index;
        }
    });

    // 服务端接口 获取红包
    const postPresent = () => {
        $.post('/nactive/ticketpayment/get', { userId, phone, status }, (res) => {
            if (res.success) {
                // taskMgr.task = function () {
                //     fullpageAnimate.next();
                // }
                // taskMgr.runTask();
                fullpageAnimate.next();
            } else if (res.code === 'REPEAT_CODE') {
                new modal.Modal({
                    title: '', // 可以为空
                    msg: '不要贪心哦，您已经领取过此红包',
                    inputType: '', // 输入框类型。为空时，不显示输入框
                    btns: [{
                        text: '去查看',
                        onTap: () => {
                            if (isApp) {
                                goToView({ id: 'ticketList' });
                            } else {
                                window.location.href = 'http://dl.ddyc.com';
                            }
                        },
                    }],
                });
            } else {
                alert(res.message);
            }
        });
    };

    // 懒加载函数
    const lazyload = ($node, name) => {
        $node.addClass(name);
    };

    // 下一页
    norepeat.auto('.next-page').on('tap', () => {
        fullpageAnimate.next();
    });

    // 获取红包按钮
    $getPresent.on('tap', () => {
        if (phone !== null) {
            // 调接口
            postPresent();
        } else if (isApp) {
            login().then((data) => {
                phone = data.phone;
                postPresent();
            });
        } else if (isWechat) {
            modal.promptPhone({
                title: '',
                msg: '请输入手机号码',
                ok: (value) => {
                    phone = value;
                    status = true;
                    postPresent();
                },
                error: () => {
                    new Fixtip({
                        msg: '请输入正确的手机号码',
                        timer: 3000,
                        bottom: '50px',
                        zIndex: 1000
                    });
                    // new modal.Modal({
                    //     title: '', // 可以为空
                    //     msg: '请输入正确的手机号码',
                    //     inputType: '', // 输入框类型。为空时，不显示输入框
                    //     btns: [{
                    //         text: '确定',
                    //     }],
                    // });
                }
            });
        } else {
            new modal.Modal({
                title: '', // 可以为空
                msg: '此操作需要在典典养车app内完成，快去下载吧~',
                inputType: '', // 输入框类型。为空时，不显示输入框
                btns: [{
                    text: '取消',
                }, {
                    text: '去下载',
                    onTap: () => { window.location.href = 'http://dl.ddyc.com'; },
                }],
            });
        }
    });

    // 查看红包按钮
    $viewPresent.on('tap', (e) => {
        // 查看红包
        e.preventDefault();
        if (isApp) {
            goToView({ id: 'ticketList' });
        } else {
            new modal.Modal({
                title: '', // 可以为空
                msg: '此操作需要在典典养车app内完成，快去下载吧~',
                inputType: '', // 输入框类型。为空时，不显示输入框
                btns: [{
                    text: '取消',
                }, {
                    text: '去下载',
                    onTap: () => { window.location.href = 'http://dl.ddyc.com'; },
                }],
            });
        }
    });

    $('body').on('swipeUp', () => {
        if (countFlag < 2) {
            fullpageAnimate.next();
        }
    }).on('swipeDown', () => {
        if (countFlag < 3) {
            fullpageAnimate.prev();
        }
    });

    $(window).off('resize');

    // 懒加载图片
    setTimeout(() => {
        lazyload($('.page3'), 'page3-img');
        lazyload($('.page4'), 'page4-img');
        lazyload($getPresent, 'page3-button-flex');
        lazyload($viewPresent, 'page4-button-flex');
    }, 500);
};


// const taskMgr = {
//     height : 0,
//     task : null,
//     init : function() {
//         this.$body = $('body');
//         this.height = this.$body.height();

//         $(window).on('resize', taskMgr.runTask);
//     },
//     runTask : function () {
//         if (taskMgr.height === $body.height()) {
//             if (taskMgr.task) {
//                 taskMgr.task();
//                 taskMgr.task = null;
//             }
//         }
//     }
// }

$(() => {
    getPhone();
    bindEvent();
    const common = Common.create();
    common.share();
});

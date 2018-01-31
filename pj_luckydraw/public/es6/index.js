import jumpUri from './module/jump';

const getCommon = require('./module/common');
const utils = require('./module/utils');
const Win = require('./module/win');
const ready = require('@util/native-bridge/lib/ready');
const login = require('@util/native-bridge/lib/login');
const isLogin = require('@util/native-bridge/lib/isLogin');
const payment = require('@util/native-bridge/lib/payment');
const xtpl = require('@util/xtpl');
const Fixtip = require('@ui/fixtip');
const norepeat = require('@ui/norepeat-event');
const FastClick = require('./module/fastclick');
const intro = require('./module/intro');

FastClick.attach(document.body);

let userInfo = {
   // userId: 3691429
};
let initData; // 初始化加载数据
let $winProcess; // 活动流程弹窗
const CONF = window.CONF;
const common = getCommon();
common.share();

/**
 * 获取并渲染参与列表
 */
function getJoinedList() {
    const temp = xtpl($('#p2-joinlist').html());
    // const $joinedList = $('#join-list');
    const $load = $('#win-load-more'); // 加载更多按钮
    let isLoading = false;
    let timeStamp = 0;

    function loadData() {
        if (isLoading) { return; }
        isLoading = true;
        $load.html('加载中...');
        $.ajax({
            url: './joinedlist',
            type: 'POST',
            data: {
                userId: userInfo.userId,
                pageSize: 20,
                timeStamp,
            },
            dataType: 'json',
        }).then((ret) => {
            isLoading = false;
            $load.html('加载更多');
            if (utils.isOk(ret)) {
                const data = ret.data;
                $load.before(temp(data));
                utils.lazyload();
                if (data.isLast) {
                    $load.remove();
                } else {
                    timeStamp = data.timeStamp;
                }
            }
        }, () => {
            isLoading = false;
            $load.html('加载更多');
            new Fixtip({ msg: '网络错误' });
        });
    }
    $load.on('tap', loadData);
    loadData();
}
/**
 * 获取并渲染已中奖列表
 */
function getWinnerList($recordList) {
    const temp = xtpl($('#p2-record').html());
    // const $recordList = $('#win-record .win-content');

    function formatData(ret) { // round 活动期号补0；
        if (ret.data) {
            for (let i = 0, len = ret.data.length; i < len; i++) {
                const round = String(ret.data[i].round);
                if (round.length === 1) {
                    ret.data[i].round = `0${round}`;
                }
            }
        }
        return ret;
    }

    $.ajax({
        url: './winnerlist',
        type: 'POST',
        data: {
            userId: userInfo.userId,
        },
        dataType: 'json',
    }).then((ret) => {
        if (utils.isOk(ret)) {
            $recordList.html(temp(formatData(ret)));
            utils.lazyload();
        }
    }, () => {
        new Fixtip({ msg: '网络错误' });
    });
}

/**
 * 轮训
 */
function loopInit() {
    let current = 0;
    const maxCount = 600;
    function task() {
        current += 1;
        if (current >= maxCount) {
            return;
        }
        $.ajax({
            url: './init',
            data: {
                userId: userInfo.userId || '',
            },
            type: 'POST',
            dataType: 'json',
        }).then((ret) => {
            if (ret.success && ret.data && ret.data.joined) {
                window.location.reload();
            } else {
                clearTimeout(loopInit.timer);
                loopInit.timer = setTimeout(() => {
                    task();
                }, 3000);
            }
        });
    }
    task();
}
/**
 * 立即参与
 */
function joinNow() {
    if (!isLogin()) {
        login().then((info) => {
            userInfo = info;
            joinNow();
        });
        return;
    }
    $.ajax({
        url: './join',
        data: {
            userId: userInfo.userId,
            lat: userInfo.lat,
            lng: userInfo.lng,
        },
        type: 'POST',
        dataType: 'json',
    }).then((ret) => {
        if (utils.isOk(ret)) {
            payment({ orderId: ret.data });
            $winProcess.hide();
            loopInit();
        } else if (ret.code === 4001) { // 已参与
            window.location.reload();
        }
    }, () => {
        new Fixtip({ msg: '网络错误' });
    });
}

/**
 * 页面状态管理
 */
const pageStep = {
    one: () => { // 首页初始化
        const $page1 = $('.page-1');
        const $footer = $page1.find('footer');
        const temp = xtpl($('#p1-footer').html());
        const $mainBtn = $page1.find('.main-btn');
        const $yearCard = $page1.find('#yearcard-img');
        const $win = $('#page1-record');
        const win = new Win($win);
        const $recordList = $win.find('.win-content');
        getWinnerList($recordList);
        $winProcess = new Win($('#win-process'));
        if (initData.data.totalNumber) {
            $footer.html(temp(initData.data));
        }
        // bind event
        $page1.find('.fixed-about').on('click', () => {
            utils.openUrl(window.CONF.urlAbout);
        });
        $page1.find('.fixed-record').on('click', () => {
            win.show();
        });
        norepeat.auto('#go-to-pay').on('click', joinNow);// 弹窗中的立即支付
        norepeat.auto($mainBtn).on('click', pageStep.mainEvent);
        norepeat.auto($yearCard).on('click', pageStep.mainEvent);
        // 动画效果
        $page1.find('[data-animate]').each(function eachAnimated() { // 启动动画
            const that = $(this);
            that.addClass('hidden');
            const type = that.data('animate');
            const delay = that.data('delay');
            setTimeout(() => {
                that.removeClass('hidden');
                that.addClass(type);
            }, delay || 50);
        });
        setTimeout(() => { // 进度条
            const total = initData.data.totalNumber;
            const joined = initData.data.joinedNumber;
            const p = ((joined / total) * 100).toFixed(2);
            const $value = $page1.find('.process-value');
            if ($value.length) {
                $value.css('width', `${p}%`);
            }
        }, 1100);
        $page1.removeClass('hide');
    },
    two: () => {
        intro.destroy();
        const $page2 = $('.page-2');
        const temp = xtpl($('#p2-page').html());
        const data = initData.data;
        if (String(data.current).length === 1) {
            data.current = `0${data.current}`;
        }
        // 进度
        data.processValue = ((data.joinedNumber / data.totalNumber) * 100).toFixed(2);
        $page2.html(temp(data));
        utils.lazyload();
        const $winRecord = $('#win-record');
        const win = new Win($winRecord);
        const $recordList = $winRecord.find('.win-content');
        getJoinedList(); // 异步获取参与列表
        getWinnerList($recordList); // 异步获取已中奖名单

        $page2.find('.fixed-about').on('click', () => {
            utils.openUrl(window.CONF.urlAbout);
        });
        $page2.find('.fixed-record').on('click', () => {
            win.show();
        });
        $page2.removeClass('hide');
    },
    three: () => {
        intro.destroy();
        const $page3 = $('.page-3');
        $page3.removeClass('hide');
    },
    // 首页“抢”按钮事件
    mainEvent: () => {
        if (window.CONF.iswechat) {
            const $mask = $('<div id="browserMask" class="browser-mask"></div>');
            $('body').append($mask);
            $mask.on('click', () => {
                $('#browserMask').remove();
            });
            return;
        }
        if (!window.CONF.isapp) {
            jumpUri.init(location.href);
            window.location.href = 'http://dl.ddyc.com';
            return;
        }
        // 1元抢TA
        if (initData.message) {
            if (initData.code === 4002) { // 黑名单
                pageStep.three();
            } else {
                utils.toast(initData.message);
            }
            return;
        }
        if (initData.data.isAlert) {
            $winProcess.show();
            return;
        }
        joinNow();
    },
};

/**
 * boot start
 */
function startApp() {
    $.ajax({
        url: './init',
        data: {
            userId: userInfo.userId || '',
        },
        type: 'POST',
        dataType: 'json',
    }).then((ret) => {
        initData = ret;
        initData.data = initData.data || {};
        if (!initData.success && initData.code === 4003) {
            window.location.href = './error';
            return;
        }
        if (initData.data.joined) {
            pageStep.two();
        } else {
            setTimeout(() => {
                intro.start(() => {
                    pageStep.one();
                });
            }, 1500);
        }
    });
}

$(window).on('load', () => {
    if (CONF.isapp) {
        ready((info) => {
            userInfo = info;
            startApp();
            window._ax.push(['set', 'openid', userInfo.userId]);
            window._ax.push(['send']);
        });
    } else if (CONF.iswechat) {
        startApp();
    } else {
        // 跳转页面，如果失败启动app
        // jumpUri.init('https://m.ddyc.com/nactive/luckydraw/index');
        jumpUri.init(location.href);
        setTimeout(() => {
            startApp();
        }, 1000);
    }
});




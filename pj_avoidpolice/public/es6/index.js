require('./module/hilo-standalone');
const ready = require('@util/native-bridge/lib/ready');
const login = require('@util/native-bridge/lib/login');
const isLogin = require('@util/native-bridge/lib/isLogin');
const Fixtip = require('@ui/fixtip');
const Loading = require('@ui/loading/wloading');
const Common = require('@util/common-page');
const game = require('./module/game');
const md5 = require('md5');

// const isDev = location.href.indexOf('localhost') > -1;

/**
 * 全局绑定弹窗方法
 */
window.GLOBAL = {
    score: '',
    phone: '',
    showResult() {
        $('.dialog-score strong').text(game.score / 10);
        $('#mask').css('display', 'block');
        $('#dialog-result').css('display', 'block');
        saveScore();
    },

    showRank() {
        rank.show();
    },

    showDesc() {
        $('#mask').css('display', 'block');
        $('#desc').css('display', 'block');
    },

    showLogin() {
        $('#mask').css('display', 'block');
        $('#login').css('display', 'block');
    },

    isLogin() {
        return client.isLogin();
    },

    salt: 'xiaoka',
};

// if (isDev) {
//     window.GLOBAL.phone = '15858232499';
// }

/**
 * app相关逻辑
 */
const app = {
    isLogin() {
        return isLogin();
    },

    login() {
        login().then((info) => {
            reload();
        });
    },

    init() {
        ready((info) => {
            if (isLogin()) {
                window.GLOBAL.phone = info.phone;
            }
        });
    },
};

/**
 * 微信相关逻辑
 */
const wechat = {
    isLogin() {
        return window.CONF.isLogin;
    },

    login() {
        window.location.href = `/feopen/login/index?url=${encodeURIComponent('/nactive/avoidpolice/index')}`;
    },

    init() {

    },
};

/**
 * 判断客户端
 */
const client = window.CONF.isapp ? app : wechat;

/**
 * 隐藏手机号中间四位
 */
function formatPhone(phone) {
    return `${phone.substring(0, 3)}****${phone.substring(7, 11)}`;
}

/**
 * 排行榜相关逻辑
 */
const rank = {
    pageSize: 10,
    page: 1,
    isInitAwardsList: false,
    isInited: false,
    defaultAvatar: 'https://img01.yangchediandian.com/ycdd/h5/avatar_default.png',

    init() {
        rank.getCityRank();
        rank.getAwardsList();
        rank.isInited = true;
    },

    clearRank() {
        $('.rank-content').html('');
        $('#my-rank').html('');
        rank.isInited = false;
        rank.isInitAwardsList = false;
        rank.page = 1;
    },

    show() {
        if (!rank.isInited) {
            rank.init();
        }
        $('#rank').css('display', 'block');
    },

    render(data, page) {
        let html = '';
        for (let i = 0; i < data.length; i++) {
            html += `
                <div class="rank-item ui-cell">
                    <span class="col1">${(page - 1) * rank.pageSize + i + 1}.</span>
                    <span class="col2"><img src="${data[i].avatar || rank.defaultAvatar}">${formatPhone(data[i].phone)}</span>
                    <span class="col3">${data[i].score}</span>
                </div>
            `;
        }
        return html;
    },

    renderMyRank(data) {
        let html = '';
        html += `
            <div class="rank-item ui-cell">
                <span class="col1"><em>我的排名</em>${data.rank + 1}.</span>
                <span class="col2"><img src="${data.avatar || rank.defaultAvatar}">${formatPhone(data.phone)}</span>
                <span class="col3">${data.score}</span>
            </div>
        `;
        return html;
    },

    getCityRank() {
        const $more = $('#city').find('.more');
        $more.addClass('disabled').text('加载中...');
        Loading.show();
        $.post('/nactive/avoidpolice/get_rank_list', {
            phone: window.GLOBAL.phone,
            page: rank.page
        }).then((res) => {
            Loading.hide();
            if (res.success) {
                if (rank.page >= res.data.totalPage) {
                    $more.addClass('disabled').text('没有更多了~');
                } else {
                    $more.removeClass('disabled').text('查看更多');
                }

                if (res.data.total === 0) {
                    $more.addClass('disabled').text('暂无数据');
                }

                const html = rank.render(res.data.data, rank.page);
                $('#city .rank-content').append(html);
                if (typeof res.data.rank == 'number') {
                    $('#my-rank').html(rank.renderMyRank(res.data));
                }
                rank.page++;
            } else {
                new Fixtip({ msg: res.message || '请求错误' });
            }
        });
    },

    getAwardsList() {
        Loading.show();
        $.post('/nactive/avoidpolice/get_awards_list', {}).then((res) => {
            Loading.hide();
            if (res.success) {
                if (res.data.awardsList.length === 0) {
                    $('.rank-nav li').eq(1).css('display', 'none');
                }
                const html = rank.render(res.data.awardsList, 1);
                $('#country .rank-content').html(html);
                rank.isInitAwardsList = true;
            } else {
                new Fixtip({ msg: res.message || '请求错误' });
            }
        });
    }
};

/**
 * 保存分数
 */
function saveScore() {
    if (window.GLOBAL.score !== '' && game.score <= window.GLOBAL.score) return;
    const bestScore = game.score;
    const sign = getSign();
    $.post('/nactive/avoidpolice/save_score', {
        score: bestScore,
        phone: window.GLOBAL.phone,
        sign,
    }).then((res) => {
        if (res.success) {
            window.GLOBAL.score = bestScore;
        }
    });
}

function reload() {
    window.location.replace(`${location.origin}${location.pathname}?time=${Date.now()}`);
}

/**
 * 对分数进行一些加密处理
 */
function getSign() {
    const score = game.score;
    const salt1 = window.GLOBAL.salt;
    const salt2 = Math.PI.toFixed(2);
    console.log(score + salt1 + salt2)
    const sign = md5(score + salt1 + salt2);
    return sign.split('').reverse().join('');
}

/**
 * 绑定事件
 */
function bindEvent() {
    // 说明
    $('#desc').on('tap', '.alert-btn', () => {
        $('#mask').css('display', 'none');
        $('#desc').css('display', 'none');
    });

    // 登录
    $('#login').on('tap', '.alert-btn', () => {
        client.login();
    });

    // 再玩一次
    $('#rank').on('tap', '.rank-replay-btn', function () {
        if ($(this).hasClass('rank-after-play')) {
            reload();
        } else {
            $('#mask').css('display', 'none');
            $('#rank').css('display', 'none');
        }
    });

    // 再玩一次
    $('#dialog-result').on('tap', '.dialog-replay', () => {
        reload();
    });

    // 查看排行
    $('#dialog-result').on('tap', '.dialog-check', () => {
        $('#dialog-result').css('display', 'none');
        $('#mask').css('display', 'none');
        $('#rank .rank-replay-btn').addClass('rank-after-play').text('再玩一次');
        if (rank.isInited) {
            rank.clearRank();
        }
        rank.show();
    });

    // 分享游戏
    $('#rank').on('tap', '.rank-share-btn', () => {
        $('#mask').css('display', 'block');
        $('#share').css('display', 'block');
    });

    $('#rank').on('tap', '.rank-nav li', function () {
        const $this = $(this);
        const index = $this.index();
        const $rank = $('.rank-list').children('.bd').eq(index);

        $this.addClass('current').siblings().removeClass('current');
        $rank.css('display', 'block').siblings('.bd').css('display', 'none');

        // if (!rank.isInitAwardsList) {
        //     rank.getAwardsList();
        // }
    });

    // 查看更多
    $('#city').on('tap', '.more', function () {
        if ($(this).hasClass('disabled')) return false;
        rank.getCityRank();
    });

    // 分享弹出层
    $('#share').on('tap', () => {
        $('#share').css('display', 'none');
        $('#mask').css('display', 'none');
    });

    $('#mask').on('tap', () => {
        if ($('#share').css('display') === 'block') {
            $('#share').css('display', 'none');
            $('#mask').css('display', 'none');
        }
    });
}

$(() => {
    game.init();
    client.init();
    bindEvent();

    const common = Common.create();
    common.share();
    const analytics = Common.analytics;
    analytics.send();
});

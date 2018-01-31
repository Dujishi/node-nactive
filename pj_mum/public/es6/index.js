require('./module/plugins');
const FastClick = require('fastclick');
const game = require('./module/game');
const Common = require('@util/common-page');
const countDown = require('@util/count-down');
const Fixtip = require('@ui/fixtip');
const Loading = require('@ui/loading/wloading');
const queryString = require('@util/string-util/query-string');
const callShare = require('@util/native-bridge/lib/callShare');
const ready = require('@util/native-bridge/lib/ready');
const login = require('@util/native-bridge/lib/login');
const isLogin = require('@util/native-bridge/lib/isLogin');
const goToPage = require('@util/native-bridge/lib/goToPage');

const Preload = require('./module/preload/preload');

const params = queryString.parse(window.location.search) || {};
let isSharePage = !!params.bonusId;
const isDev = location.hostname.indexOf('localhost') > -1;

const CONF = window.CONF;
const common = Common.create();
const $pageStart = $('.page-start');
const $pageGame = $('.page-game');
const $pageResult = $('.page-result');
const $pageDetail = $('.page-detail');
const $pageShare = $('.page-share');
const $prizeDialog = $('.prize-dialog');
let goodsList = null;
let goodsDetail = null;
let score = 0;

let timer = null;

common.share();

FastClick.attach(document.body);

function init() {
    if (isSharePage) {
        getBonusInfo(params.bonusId, function(data) {
            if (canHelp(data)) {
                if (data.hasHelp) {
                    showDetailPage(params.bonusId, params.code);
                } else {
                    getDetailInfo(params.bonusId, params.code, function(data) {
                        initSharePage(data);
                    });
                }
            } else {
                isSharePage = false;
                $pageStart.removeClass('hide');
            }
        });
    } else {
        isSharePage = false;
        $pageStart.removeClass('hide');
    }
}

function getBonusInfo(bonusId, callback) {
    Loading.show();
    $.post('/nactive/mum/get-bonus-info', {
        bonusId,
    }).then((res) => {
        Loading.hide();
        if (res.success) {
            callback && callback(res.data);
        } else {
            new Fixtip({ msg: res.message || '请求错误' });
        }
    });
}

function canHelp(data) {
    const isSelf = data.isSelf;
    const disabled = !data.discountInfo;
    const enoughFriends = data.friendsInfo && data.friendsInfo.length >= 5;
    return !isSelf && !disabled && !enoughFriends;
}

function initResultPage() {
    const resultMoneyTemplate = template('result-money-tpl', {
        score,
    });
    $pageResult.find('.hd').html(resultMoneyTemplate);
    $pageResult.removeClass('hide').animateCss('bounceInDown');
    if (score > 0) {
        getGoodsList();
    } else {
        $pageResult.find('.list').html('');
    }
}

function calcSelfCash() {
    const cashList = [
        goodsList[0][`self${score}`],
        goodsList[2][`self${score}`],
        goodsList[4][`self${score}`],
    ];
    // goodsList.forEach((v) => {
    //     const cash = v[`self${score}`];
    //     if (cashList.indexOf(cash) === -1) {
    //         cashList.push(cash);
    //     }
    // });
    createCash(cashList);
}

function calcFriendsCash() {
    return goodsDetail[`friends${score}`];
}

function handleGameOver(gameScore) {
    if (isDev) {
        gameScore = gameScore > 0 ? gameScore : Number(params.score);
    }
    score = gameScore;
    if (isSharePage) {
        const cash = calcFriendsCash();
        // if (score > 0) {
        //     $prizeDialog.find('.confirm-btn').removeClass('hide');
        //     $prizeDialog.find('.money-detail-num').text(cash);
        //     $prizeDialog.removeClass('hide').animateCss('fadeIn');
        // } else {
        //     $prizeDialog.find('.confirm-btn').addClass('hide');
        //     $prizeDialog.removeClass('hide').animateCss('fadeIn');
        // }

        const prizeDialogTemplate = template('prize-dialog-tpl', {
            score,
            cash,
        });

        $prizeDialog.html(prizeDialogTemplate).removeClass('hide').animateCss('fadeIn');
    } else {
        $pageGame.addClass('hide');
        initResultPage(score);
    }
}

window.handleGameOver = handleGameOver;

function createCash(cashList) {
    $('.money1').html(`
        <div class="money-detail"><div><strong><span>￥</span>${cashList[0]}</strong>满200可用</div></div>
        <div class="money-detail"><div><strong><span>￥</span>${cashList[1]}</strong>满300可用</div></div>
    `);

    $('.money2').html(`
        <div class="money-detail"><div><strong><span>￥</span>${cashList[2]}</strong>满800可用</div></div>
    `);
}

function handleZeroScore() {
    $('.money1').remove();
    $('.money2').remove();
    $('#page-result-tips').text('很遗憾，没有获得金币。');
}

function getGoodsList() {
    Loading.show();
    $.post('/nactive/mum/get-records', {}).then((res) => {
        Loading.hide();
        if (res.success) {
            goodsList = res.data.goodsList;
            createGoodsList(goodsList);
            calcSelfCash();
        } else {
            new Fixtip({ msg: res.message || '请求错误' });
        }
    });
}

function getRecords() {
    Loading.show();
    $.post('/nactive/mum/get-records', {}).then((res) => {
        Loading.hide();
        if (res.success) {
            createRecordsList(res.data.recordsList || []);
        } else {
            new Fixtip({ msg: res.message || '请求错误' });
        }
    });
}

function createRecordsList(list) {
    let html = '';

    if (list.length === 0) {
        html += '<li class="no-data">暂无参与记录</li>';
    } else {
        list.forEach((v) => {
            html += `
            <li class="item">
                <div class="item-bd">
                    <div>${v.goodsInfo.name}</div>
                    <div class="progress">
                        ${createProgress(v.goodsInfo)}
                    </div>
                </div>
                <div class="item-ft">
                    <div class="money">¥ <strong>${v.goodsInfo.price - v.bonusInfo.amount}</strong></div>
                    <a data-code="${v.bonusInfo.goodsCode}" data-bonusid="${v.bonusInfo.bonusId}" class="goto-detail" href="javascript:;">去查看</a>
                </div>
            </li>
            `;
        });
    }
    $('.records-list').html(html);
}

function getPercent(obj) {
    return ((obj.sell / obj.stock) * 100).toFixed(0);
}

function showDetailPage(bonusId, code) {
    $pageDetail.removeClass('hide').animateCss('fadeIn');
    getDetailInfo(bonusId, code, function(data) {
        initDetailPage(data, bonusId, code);
    });
}

function createProgress(v) {
    return `
        <div class="progress-text">已抢${v.sell}件<span>${getPercent(v)}%</span></div>
        <div class="progress-bar" style="width:${getPercent(v)}%">
            <div class="progress-text">已抢${v.sell}件<span>${getPercent(v)}%</span></div>
        </div>
    `;
}

function createGoodsList(list) {
    let html = '';
    list.forEach((v) => {
        if (!v.isGetted) {
            html += `
                <li class="item" data-code="${v.code}">
                    <img class="goto-detail" src="${v.image}" alt="">
                    <div class="item-bd">
                        <div class="goto-detail">${v.name}</div>
                        <div class="sub-text">包含机油、机滤、工时费</div>
                        <div class="progress">
                            ${createProgress(v)}
                        </div>
                        <div class="money">¥ <strong>${v.price}</strong></div>
                        <a data-code="${v.code}" class="goto-buy" href="javascript:;">马上抢</a>
                    </div>
                </li>
            `;
        }
    });
    $('.page-result .list').html(html);
}

function createBonus(code) {
    Loading.show();
    $.post('/nactive/mum/create-bonus', {
        code,
        score,
    }).then((res) => {
        Loading.hide();
        if (res.success) {
            $pageResult.addClass('hide');
            showDetailPage(res.data.bonusId, code);
        } else {
            new Fixtip({ msg: res.message || '请求错误' });
        }
    });
}

function updateBonus() {
    Loading.show();
    $.post('/nactive/mum/update-bonus', {
        code: params.code,
        bonusId: params.bonusId,
        score,
    }).then((res) => {
        Loading.hide();
        if (res.success) {
            $pageGame.addClass('hide');
            $prizeDialog.addClass('hide');
            showDetailPage(params.bonusId, params.code);
        } else {
            new Fixtip({ msg: res.message || '请求错误' });
        }
    });
}

function getDetailInfo(bonusId, code, callback) {
    Loading.show();
    $.post('/nactive/mum/get-detail-info', {
        bonusId,
        code,
    }).then((res) => {
        Loading.hide();
        if (res.success) {
            if (typeof callback === 'function') {
                callback(res.data);
            }
        } else {
            new Fixtip({ msg: res.message || '请求错误' });
        }
    });
}

function initDetailPage(data, bonusId, code) {
    const friendsInfo = [];
    let noFriends = true;
    data.friendsInfo = data.friendsInfo || [];
    for (let i = 0; i < 5; i++) {
        if (data.friendsInfo[i]) {
            friendsInfo.push(data.friendsInfo[i]);
            noFriends = false;
        } else {
            friendsInfo.push({});
        }
    }
    const detailTemplate = template('detail-tpl', {
        goodsInfo: data.goodsInfo,
        discountInfo: data.discountInfo,
        isSharePage,
    });
    const friendsTemplate = template('friends-tpl', {
        friendsInfo,
        noFriends,
        isSharePage,
    });
    const rankTemplate = template('rank-tpl', {
        rankInfo: data.rankInfo,
    });
    $pageDetail.html(detailTemplate + friendsTemplate + rankTemplate);
    $pageDetail.find('.progress').html(createProgress(data.goodsInfo));

    if (timer) {
        timer.stop();
    }
    timer = countDown({
        countTime: data.discountInfo.remainTime,
        onCount: (res) => {
            $pageDetail.find('.pay-time').text(`${res.nH}:${res.nM}:${res.nS}`);
        }
    });

    setShare(bonusId, code, data.discountInfo.amount);
}

function setShare(bonusId, code, amount) {
    const shareUrl = `${location.origin}${location.pathname}?bonusId=${bonusId}&code=${code}`;
    const shareTitle = `我刚在翻菊花的游戏中赢得了${amount}元现金，剩下的，靠你了！`;
    common.share(() => {}, {
        shareUrl,
        shareTitle,
    });
}

function initSharePage(data) {
    const shareTemplate = template('share-tpl', {
        goodsInfo: data.goodsInfo,
        discountInfo: data.discountInfo,
    });

    goodsDetail = data.goodsInfo;

    $pageShare.html(shareTemplate);
    $pageShare.find('.progress').html(createProgress(data.goodsInfo));
    countDown({
        countTime: data.discountInfo.remainTime,
        onCount: (res) => {
            $pageShare.find('.pay-time').text(`${res.nH}:${res.nM}:${res.nS}`);
        }
    });
    $pageShare.removeClass('hide');
}

function showGamePage() {
    game.init();
    $pageGame.removeClass('hide').animateCss('fadeIn');
}

function gotoGoodsDetailPage(code) {
    gotoPage(`https://m.ddyc.com/feopen/goods/index?commodityCode=${code}&shopId=&lv2Id=${code.substring(1)}&lv1Id=2&isBottom=false`);
}

function gotoPage(url) {
    if (CONF.isapp) {
        goToPage({
            type: 1, // 1是养车，2是典典
            url, // 跳转路径
        });
    } else {
        location.href = url;
    }
}

function bindEvents() {
    $pageStart.on('click', '.start-btn', function() {
        $pageStart.addClass('hide');
        showGamePage();
    });

    $pageResult.on('click', '.close, .replay-btn', function() {
        $pageResult.animateCss('fadeOut', function() {
            $pageResult.addClass('hide');
            $pageGame.removeClass('hide');
            game.replay();
        });
    });

    $pageResult.on('click', '.goto-buy', function() {
        createBonus($(this).data('code'));
    });

    $pageResult.on('click', '.goto-detail', function() {
        const code = $(this).parents('.item').data('code');
        gotoGoodsDetailPage(code);
    });

    $pageShare.on('click', '.banner', function() {
        const code = $(this).data('code');
        gotoGoodsDetailPage(code);
    });

    $pageDetail.on('click', '.banner', function() {
        const code = $(this).data('code');
        gotoGoodsDetailPage(code);
    });

    $pageGame.on('click', '.desc-btn', function() {
        $('.desc-dialog').removeClass('hide').animateCss('fadeIn');
    });

    $pageGame.on('click', '.records-btn', function() {
        $('.records-dialog').removeClass('hide').animateCss('fadeIn');
        getRecords();
    });

    $pageDetail.on('click', '.buy-btn', function() {
        const code = $(this).data('code');
        const params = $(this).data('params') || '';
        common.getLocation().then((res) => {
            location.href = `/payment/prepay?goodsCode=${code}&tradeOrderGoodsPartParam=${params}&lat=${res.latitude}&lon=${res.longitude}&source=1`;
        });
        // https://m.ddyc.com/payment/prepay?goodsCode=L1060759&tradeOrderGoodsPartParam=S1070822%7C1,S1070356%7C1&lat=30.288943&lon=120.089112&source=2&isSupportPreSale=1
    });

    $pageDetail.on('click', '.play-btn', function() {
        isSharePage = false;
        $pageDetail.addClass('hide');
        // $pageGame.removeClass('hide');
        // game.replay();
        showGamePage();
    });

    const $shareGuide = $('.share-guide');

    $shareGuide.on('click', function() {
        $shareGuide.addClass('hide');
    });

    $pageDetail.on('click', '.share-btn', function() {
        const $this = $(this);
        const code = $this.data('code');
        const bonusId = $this.data('bonusid');
        const amount = $this.data('amount');
        const shareUrl = `${location.origin}${location.pathname}?bonusId=${bonusId}&code=${code}`;
        const shareTitle = `我刚在翻菊花的游戏中赢得了${amount}元现金，剩下的，靠你了！`;
        common.share(() => {}, {
            shareUrl,
            shareTitle,
        });

        if (CONF.isapp) {
            callShare({
                url: shareUrl,
                title: shareTitle,
                subTitle: window.CONF.shareSubTitle,
                image: window.CONF.shareImgUrl,
                content: window.CONF.shareContent,
            });
        } else {
            $shareGuide.removeClass('hide');
        }
    });

    $pageShare.on('click', '.play-btn', function() {
        isSharePage = false;
        $pageShare.addClass('hide');
        showGamePage();
    });

    $pageShare.on('click', '.help-btn', function() {
        $pageShare.addClass('hide');
        showGamePage();
    });

    $prizeDialog.on('click', '.replay-btn', function() {
        $prizeDialog.animateCss('fadeOut', function() {
            $prizeDialog.addClass('hide');
            game.replay();
        });
    });

    $('.dialog-close').on('click', function() {
        $(this).parents('.dialog').addClass('hide');
    });

    $prizeDialog.on('click', '.confirm-btn', function() {
        $pageGame.addClass('hide');
        updateBonus();
        // $pageDetail.animateCss('fadeIn', function() {});
    });

    $pageGame.on('click', '.goto-detail', function() {
        const $this = $(this);
        const code = $this.data('code');
        const bonusId = $this.data('bonusid');
        $pageGame.addClass('hide');
        $('.records-dialog').addClass('hide');
        showDetailPage(bonusId, code);
    });
}

$(() => {
    ready(() => {
        if (!isLogin()) {
            login().then(() => {
                location.reload();
            });
        }
    });
    new Preload(window.imagesRes, {
        onComplete() {
            $('.ui-preload').addClass('hide');
            // $pageStart.removeClass('hide').animateCss('fadeIn');
            init();
            bindEvents();
        },
    });
});

const createFullpageAnimate = require('@ui/fullpage-animate');
const Common = require('@util/common-page');
const norepeat = require('@ui/norepeat-event');
const Fixtip = require('@ui/fixtip');
const loading = require('@ui/loading/wloading');
const queryString = require('@util/string-util/query-string');
const validation = require('@util/validation');
require('@ui/preload/src/loader');

const fullpageAnimate = createFullpageAnimate({
    noPreventDefault: true
});
const queryParams = queryString.parse(window.location.search);
const topicResult = [];

const originShareUrl = window.CONF.shareUrl;

const common = Common.create();
common.share();

// 出题人
const asker = {
    init() {
        if (queryParams.type === '2') {
            $('.showoff').removeClass('hide');
        } else {
            if (window.CONF.topics) {
                $('.ask-result').removeClass('hide');
                // this.getTopicList();      
            } else {
                $('.ask-start').removeClass('hide');
            }
        }
    },
    getTopicList() {
        loading.show();
        $.post('/nactive/valentine170207/topic_list', {
            openid: window.CONF.openid,
        }, function(res) {
            loading.hide();
            if (res.success) {
                if (res.data.length > 0 && res.data[0].score == 100) {
                    $('.ask-result-success').removeClass('hide');
                } else {
                    $('.ask-result-fail').removeClass('hide');
                }
            } else {
                new Fixtip({ msg: res.message || '请求失败' });
            }
        });
    },
    topicEndHandler() {
        loading.show();
        $.post('/nactive/valentine170207/save_topic', {
            openid: window.CONF.openid,
            player: 'asker',
            results: topicResult.join(','),
        }, function(res) {
            loading.hide();
            if (res.success) {
                setShareConfig(1, window.CONF.openid);
                $('.ask-end').removeClass('hide');
                fullpageAnimate.next();
            } else {
                new Fixtip({ msg: res.message || '请求失败' });
            }
        });
    },
};

// 答题人
const answerer = {
    init() {
        $('.answer-start').removeClass('hide');
    },
    topicEndHandler() {
        loading.show();
        $.post('/nactive/valentine170207/save_topic', {
            openid: window.CONF.openid,
            player: 'answerer',
            results: topicResult.join(','),
            asker: queryParams.asker,
        }, function(res) {
            if (res.success) {
                loading.hide();
                const matchScore = res.data.matchScore;
                if (matchScore === 100) {
                    const festivalCase = getFestivalCase(topicResult);
                    setShareConfig(2, window.CONF.openid, queryParams.asker);
                    $('.lottery-match').find('.article').text(festivalCase);
                    $('.answer-result-success').removeClass('hide');
                } else if (matchScore === 0) {
                    $('.answer-result-fail').addClass('empty').removeClass('hide');
                } else {
                    $('.answer-result-fail').removeClass('hide').find('.desc span').text(matchScore);
                }
                fullpageAnimate.next();
            } else {
                new Fixtip({ msg: res.message || '请求失败' });
            }
        });
    },
};

let player = null;

function setShareConfig(i, askerOpenid, answererOpenid) {
    const list = [
        {
            shareUrl: `${originShareUrl}`,
            shareTitle: '我和TA正在过情人节，邀请你围观',
            shareContent: '听说默契度测试达到100%就能过情人节，有情人的考验默契，没情人的快趁机表白',
            shareSubTitle: '听说默契度测试达到100%就能过情人节，有情人的考验默契，没情人的快趁机表白',
        },
        {
            shareUrl: `${originShareUrl}?type=1&asker=${askerOpenid}`,
            shareTitle: '我和TA正在过情人节，邀请你围观',
            shareContent: '听说默契度测试达到100%就能过情人节，有情人的考验默契，没情人的快趁机表白',
            shareSubTitle: '听说默契度测试达到100%就能过情人节，有情人的考验默契，没情人的快趁机表白',
        },
        {
            shareUrl: `${originShareUrl}?type=2&asker=${askerOpenid}&answerer=${answererOpenid}`,
            shareTitle: '我们决定在一起了，求祝福！',
            shareContent: '我们默契度100%，只能选择在一起。你也赶紧去找三观一致 的小伙伴过节吧~',
            shareSubTitle: '我们默契度100%，只能选择在一起。你也赶紧去找三观一致 的小伙伴过节吧~',
        },
    ];

    // alert(list[i].shareUrl);

    common.share((type) => {}, list[i]);
}

function getFestivalCase(resultArr) {
    const topicList = [
        [
            '太阳当空照',
            '天青色等烟雨',
            '举头望明月',
        ],
        [
            '二人世界家里蹲',
            '地图在手说走就走',
            '上天与神舟肩并肩',
        ],
        [
            '路边撸串儿',
            '海天盛宴',
            '泡面加个蛋',
        ],
        [
            '礼物',
            '红包',
            '我自己',
        ],
        [
            '嗑瓜子唠嗑',
            '憋说话吻我',
            '不可描述',
        ],
    ];

    return `2月14日，（${topicList[0][resultArr[0]]}），
            我们相约（${topicList[1][resultArr[1]]}），
            准备一顿浪漫的（${topicList[2][resultArr[2]]}），
            送给对方（${topicList[3][resultArr[3]]}）以证情谊，
            如果还有饭后节目，我们希望是（${topicList[4][resultArr[4]]}）。`.trim();
}

function showShareTips() {
    $('.mask').removeClass('hide');
    $('.share').removeClass('hide');
}

function bindEvent() {
    const $body = $('body');

    $('.ask-start .btn').on('tap', function() {
        $('.topic1').removeClass('hide');
        fullpageAnimate.next();
    });

    $('.showoff .btn').on('tap', function() {
        setShareConfig(0);
        if (window.CONF.topics) {
            $('.ask-result').removeClass('hide');
        } else {
            $('.topic1').removeClass('hide');
        }
        fullpageAnimate.next();
    });

    $body.on('touchend', '.topic dd', function() {
        const $parent = $(this).parents('.topic');
        $(this).addClass('selected');
        topicResult.push($(this).index() - 1);
        setTimeout(() => {
            if ($parent.hasClass('topic-last')) {
                player.topicEndHandler();
            } else {
                $parent.next().removeClass('hide');
                fullpageAnimate.next();
            }
        }, 300);
    });

    $('.ask-end .btn').on('tap', function() {
        showShareTips();
    });

    $('.share').on('tap', function() {
        $('.mask').addClass('hide');
        $('.share').addClass('hide');
    });

    $('.mask').on('tap', function() {
        if (!$('.share').hasClass('hide')) {
            $('.mask').addClass('hide');
            $('.share').addClass('hide');
        }
    });

    $('.answer-start .btn').on('tap', function() {
        $('.topic1').removeClass('hide');
        fullpageAnimate.next();
    });

    $('.answer-start .replay-btn').on('tap', function() {
        player = asker;
        // $('.topic1').removeClass('hide');

        if (window.CONF.topics) {
            $('.ask-result').removeClass('hide');
            fullpageAnimate.next();
        } else {
            $('.topic1').removeClass('hide');
            fullpageAnimate.next();
        }
    });

    $('.answer-result-success .btn').on('tap', function() {
        $('.mask').removeClass('hide');
        $('.lottery-match').removeClass('hide');
    });

    $('.answer-result-success .assist-btn').on('tap', function() {
        showShareTips();
    });

    $('.answer-result-fail .btn').on('tap', function() {
        $('.mask').removeClass('hide');
        $('.lottery-unmatch').removeClass('hide');
    });

    $('.answer-result-fail .assist-btn').on('tap', function() {
        player = asker;
        $('.topic dd').removeClass('selected');
        topicResult.length = 0;
        if (window.CONF.topics) {
            $('.ask-result').removeClass('hide');
            fullpageAnimate.next();
        } else {
            $('.topic1').removeClass('hide');
            fullpageAnimate.go(1);
        }
    });

    $('.ask-result-success .btn').on('tap', function() {
        const festivalCase = getFestivalCase(window.CONF.topics.split(','));
        $('.lottery-match').find('.article').text(festivalCase);
        $('.mask').removeClass('hide');
        $('.lottery-match').removeClass('hide');
    });

    $('.ask-result-fail .btn').on('tap', function() {
        $('.mask').removeClass('hide');
        $('.lottery-unmatch').removeClass('hide');
    });

    $body.on('tap', '.close', function() {
        $('.mask').addClass('hide');
        $(this).parents('.dialog').addClass('hide');
    });

    $('.ask-result-success .assist-btn').on('tap', function() {
        setShareConfig(2, window.CONF.openid, $(this).data('openid'));
        showShareTips();
    });

    $body.on('touchend', '.showoff-btn', function() {
        setShareConfig(2, window.CONF.openid, $(this).data('openid'));
        showShareTips();
    });

    $('.ask-result-fail .assist-btn').on('tap', function() {
        showShareTips();
    });

    $('.lottery-match, .lottery-unmatch').on('click', '.btn', function() {
        const $parent = $(this).parents('.dialog');
        const phone = $(this).prev().val();
        lottery(phone, $parent);
    });

    $('.lottery-success .btn').on('tap', function() {
        location.href = 'http://dl.ddyc.com/';
    });

    $('.lottery-fail .btn').on('tap', function() {
        $('.mask').addClass('hide');
        $(this).parents('.dialog').addClass('hide');
    });

    $('.music').on('click', function () {
        if ($(this).hasClass('on')){
            $('.music').removeClass('on');
            $('audio')[0].pause();
        } else {
            $('.music').addClass('on');
            $('audio')[0].play();
        }
    });
}

function lottery(phone, $parent) {
    if (!validation.isPhone(phone)) {
        return new Fixtip({ msg: '手机号格式不正确' });
    }
    loading.show();
    $.post('/nactive/valentine170207/get_bonus', {
        phone,
    }, function(res) {
        loading.hide();
        
        if (res.success) {
            const isNew = res.data.isNew;
            const $success =  $('.lottery-success');
            $success.find('.list').addClass('hide');

            $('.lottery-match').addClass('hide');
            $('.lottery-unmatch').addClass('hide');

            $parent.addClass('hide');    
            if (isNew) {
                // 新人红包
                $success.removeClass('hide').find('.list1').removeClass('hide');
                $success.find('.tips span').text(phone);
            } else {
                // 老人红包
                $success.removeClass('hide').find('.list2').removeClass('hide');
                $success.find('.tips span').text(phone);
            }
        } else {
            if (res.errCode == "REPEAT_CODE") {
                new Fixtip({ msg: res.message || '请求失败' });
            } else {
                $('.lottery-match').addClass('hide');
                $('.lottery-unmatch').addClass('hide');
                $('.lottery-fail').removeClass('hide');
            }
        }
    });
}

function loadRes() {
    const options = {
        loadType: 0,
        minTime: 0,
        onLoading: (count, total) => {
            const percent = parseInt((count / total) * 100, 10);
            $('.loading .percent').html(`${percent}%`);
        },
        onComplete: () => {
            bindEvent();
            $('.loading').addClass('hide');
            initPage();
        },
    };
    new mo.Loader(window.imagesRes, options);
}

function scalePage() {
    const winHeight = document.documentElement.clientHeight;
    const winWidth = document.documentElement.clientWidth;
    const pageHeight = winWidth * (1206 / 750);
    const scaleY = `scaleY(${winHeight / pageHeight})`;
    $('section > div').css('transform', scaleY);
}

function initPage() {
    if (queryParams.type === '1') {
        if (queryParams.asker == window.CONF.openid) {
            $('.ask-result').removeClass('hide');
            // fullpageAnimate.next();
        } else {
            player = answerer;
        }
    } else {
        player = asker;
    }

    player.init();

    // if (params.type === '1') {
    //     $('.answer-start').removeClass('hide');
    // } else if (params.type === '2') {
    //     $('.showoff').removeClass('hide');
    // } else {
    //     if (window.CONF.isPlay) {
    //         $('.ask-result').removeClass('hide');
    //     } else {
    //         $('.ask-start').removeClass('hide');
    //     }
    // }
}

function initShare() {
    if (queryParams.type === '2') {
        setShareConfig(0);
    } else if (queryParams.type === '1') {

    } else {
        if (window.CONF.topics) {
            const $askSuccess = $('.ask-result-success');
            if ($askSuccess.length > 0) {
                setShareConfig(2, window.CONF.openid, $askSuccess.find('.assist-btn').data('openid'));
            } else {
                setShareConfig(1, window.CONF.openid);
            }
        }
        // const matchList = window.CONF.matchList;
        // if (!$.isArray(matchList)) return;

        // // 出题模式100%
        // if (matchList.length > 0 && matchList[0].score == 100) {
        //     setShareConfig(2, window.CONF.openid, matchList[0].openid);
        // } else {
        //     setShareConfig(1, window.CONF.openid);
        // }
    }    
}

$(() => {
    scalePage();
    initShare();
    loadRes();
});

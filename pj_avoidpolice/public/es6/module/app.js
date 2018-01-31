const nativeBridge = require('@util/native-bridge');
const common = require('./module/common');
const Fixtip = require('@ui/fixtip');
const Loading = require('@ui/loading/wloading');
// const Dropload = require('dropload');
const isLast = /\/\/last/.test(window.location.href);
const isDev = /\/\/localhost/.test(window.location.href);

var game = window.game;
var local = window.local = {
  lat: 0,
  lng: 0,
  isget: 0,
  score: 0,
  cityId: '',
  phone: CONF.phone,
  isapp: CONF.isapp,
  openid: CONF.openid,
  // avatar: CONF.avatar
}

if (isDev) {
    local.lat = 30;
    local.lng = 120;
    // local.phone = 10112340002;
}

// 提供给外部调用的弹窗接口
game.dialog = {
    showResult: function() {
        $('.dialog-score strong').text(game.score);
        $('#mask').css('display', 'block');
        if (local.isget == 1) {
            $('#dialog-result').css('display', 'block');
            saveScore();
        } else {
            $('#dialog-get').css('display', 'block');
        }
    },
    showRank: function() {
        rank.show();
    },
    showDesc: function() {
        $('#mask').css('display', 'block');
        $('#desc').css('display', 'block');
    },
    showLogin: function() {
        $('#mask').css('display', 'block');
        $('#login').css('display', 'block');
    }
}

// app相关逻辑
var app = {
    login: function() {
        nativeBridge.login().then(ret => {
            nativeBridge.getAppInfo().then(info => {
                initState(info.phone);
            })
        })
    },
    getTicket: function() {
        if (nativeBridge.isLogin()) {
            nativeBridge.ready(info => {
                local.lat = info.lat;
                local.lng = info.lng;
                getTicketRequest({
                    openid: '',
                    phone: info.phone,
                })
            })
        } else {
            nativeBridge.login().then(ret => {
                nativeBridge.getAppInfo().then(info => {
                    initState(info.phone);
                })
            })
        }
    },
    checkAccount: function() {
        nativeBridge.goToView({id: 'ticketList'}).then((ret) => {});
    },
    init: function() {
        // if (local.phone) {
        //     initState(local.phone);
        // }
        $('#phone').css('display', 'none');

        nativeBridge.ready(info => {
            local.lat = info.lat;
            local.lng = info.lng;
            if (info.phone) {
                local.phone = info.phone;
                initState(info.phone)
            }
            // if (nativeBridge.isLogin()) {
            //     local.lat = info.lat;
            //     local.lng = info.lng;
            //     if (info.phone) {
            //         local.phone = info.phone;
            //         initState(info.phone)
            //     }
            // } else {
            //     nativeBridge.login().then(ret => {
            //         app.init();
            //     })
            // }
            
        });
    }
}

// 微信相关逻辑
var wechat = {
    login: function() {
        window.location.href = `/feopen/login/index?url=${encodeURIComponent('/nactive/avoidpolice/index')}`
    },
    getTicket: function() {
        var phone = $('#phone').val();
        if (!this.validate(phone)) return;
        getTicketRequest({
            openid: local.openid,
            phone: phone,
            // avatar: local.avatar
        });
    },
    validate: function(phone) {
        var phonePattern = /^1\d{10}$/;
        if (!phonePattern.test(phone)) {
            new Fixtip({msg: '手机号格式不正确', bottom: '50%'});
            return false;
        }
        return true;
    },
    checkAccount: function() {
        location.href = 'http://dl.ddyc.com/';
    },
    init: function() {
        // if (window.localStorage && localStorage.getItem('avoidpolice_phone')) {
        //     local.phone = localStorage.getItem('avoidpolice_phone');
        // }
        if (local.phone) {
            initState(local.phone);
        }
    }
}

var client = local.isapp ? app : wechat;

// 排行榜相关逻辑
var rank = {
    pageSize: 10,
    cityPage: 1,
    countryPage: 1,
    isInitCountryRank: false,
    isInited: false,
    defaultAvatar: 'http://img01.yangchediandian.com/ycdd/h5/avatar_default.png',

    init: function() {
        var callbak = function() {
            $('#city').find('.more').css('display', 'block');
            Loading.hide();
        }

        if (!local.cityId) {
            getCity(function(cityId) {
                Loading.show();
                rank.getCityRank(callbak);
                rank.isInited = true;
            });
        } else {
            Loading.show();
            rank.getCityRank(callbak);
            rank.isInited = true;
        }
    },
    show: function() {
        if (!rank.isInited) {
            rank.init();
        }
        $('#rank').css('display', 'block');
    },
    render: function(data, page) {
        var html = [];
        for (var i = 0; i < data.length; i++) {
            html.push(
                '<div class="rank-item ui-cell">',
                    '<span class="col1">'+ ((page - 1) * rank.pageSize + i + 1) +'.</span>',
                    '<span class="col2"><img src="'+(data[i].avatar || rank.defaultAvatar)+'">'+formatPhone(data[i].phone)+'</span>',
                    '<span class="col3">'+ data[i].score +'</span>',
                '</div>'
            );
        }
        return html.join('');
    },
    renderMyRank: function(data) {
        var html = [];
        html.push(
            '<div class="rank-item ui-cell">',
                '<span class="col1"><em>我的排名</em>'+ (data.rank + 1) +'.</span>',
                '<span class="col2"><img src="'+(data.avatar || rank.defaultAvatar)+'">'+formatPhone(data.phone)+'</span>',
                '<span class="col3">'+ data.score +'</span>',
            '</div>'
        );
        return html.join('');
    },
    getCityRank: function(callbak) {
        var $more = $('#city').find('.more');
        $more.addClass('disabled').text('加载中...');
        $.post('/nactive/avoidpolice/get_city_rank', {
            phone: local.phone,
            cityId: local.cityId,
            page: rank.cityPage
        }).then(res => {
            if (res.success) {
                callbak && callbak(res);

                if (res.data.data.length == 0) {
                    $more.addClass('disabled').text('没有更多了').css('color', '#ddd');
                    return;
                } else {
                    $more.removeClass('disabled').text('查看更多');
                }

                var html = rank.render(res.data.data, rank.cityPage);
                $('#city .rank-content').append(html);
                if (typeof res.data.rank == 'number') {
                    $('#my-rank').html(rank.renderMyRank(res.data));
                }
                rank.cityPage++;
                $('#city').data('inited', true);

                
            } else {
                new Fixtip({msg: res.message || '请求错误'});
            }

            
        })
    },
    getCountryRank: function(callbak) {
        var $more = $('#country').find('.more');
        $more.addClass('disabled').text('加载中...');
        $.post('/nactive/avoidpolice/get_country_rank', {
            phone: local.phone,
            page: rank.countryPage
        }).then(res => {
            if (res.success) {
                callbak && callbak(res);

                if (res.data.data.length == 0) {
                    $more.addClass('disabled').text('没有更多了').css('color', '#ddd');
                    return;
                } else {
                    $more.removeClass('disabled').text('查看更多');
                }

                if (res.data.data.length == 0) {
                    $('#country .more').css('display', 'none');
                    return;
                }

                var html = rank.render(res.data.data, rank.countryPage);
                $('#country .rank-content').append(html);
                if (typeof res.data.rank == 'number') {
                    $('#my-rank').html(rank.renderMyRank(res.data));
                }
                rank.countryPage++;
                $('#country').data('inited', true);
                rank.isInitCountryRank = true;
            } else {
                new Fixtip({msg: res.message || '请求错误'});
            }
        })
    }
};

// 保存分数
function saveScore() {
    if (game.score - 0 <= local.score - 0) return;
    var bestScore = game.score;
    $.post('/nactive/avoidpolice/save_score', {
        score: bestScore,
        phone: local.phone,
        cityId: local.cityId
    }).then(res => {
        if (res.success) {
           local.score = bestScore;

           setShare(bestScore, local.city, local.phone, local.cityId);
           // common.share({shareTitle: setShare(local.score, local.city, local.rank)});
        }
    })
}

function formatPhone(phone) {
    return phone.substring(0,3)+"****"+phone.substring(7,11);
}

function getMyRank(phone, cityId, callbak) {
    $.post('/nactive/avoidpolice/get_my_rank', {
        phone: phone,
        cityId: cityId
    }).then(res => {
        if (res.success) {
           callbak && callbak(res.data.rank);
        } else {
            new Fixtip({msg: res.message || '请求错误'})
        }
    })
}

function setShare(score, city, phone, cityId) {
    score = score || 0;
    city = city || '同城';

    getMyRank(phone, cityId, function(rank) {
        common.share({
            shareTitle: '哈，我躲过了'+score+'个交警，'+city+'排名第' + (rank + 1)
        });
    });
}

// 获取城市信息
function getCity(callbak) {
    Loading.show();
    $.post('/nactive/avoidpolice/get_city', {
        lat: local.lat,
        lng: local.lng
    }).then(res => {
        if (res.success && res.data) {
            local.cityId = res.data.cityId;
            callbak(res.data.cityId);
        }
        Loading.hide();
    })
}

// 获取初始状态数据
function initState(phone) {
    $.post('/nactive/avoidpolice/state', {phone: phone}).then(res => {
        if (res.success) {
            $.extend(local, res.data);
            if (res.data.isget) {
                setShare(local.score, local.city, local.phone, local.cityId);
            }
            // common.share({shareTitle: setShare(local.score, local.city, local.rank)});
            // local.isget = res.data.isget;
            // local.score = res.data.score;
        }
    })
}

// 获取红包请求
function getTicketRequest(params) {
    var data = $.extend({
        score: game.score,
        lat: local.lat,
        lng: local.lng
    }, params);

    Loading.show();
    $.post('/nactive/avoidpolice/index', data).then(res => {
        if (res.success) {
            local.phone = params.phone;
            // window.localStorage && localStorage.setItem('avoidpolice_phone', params.phone);
            $('#dialog-get').css('display', 'none');
            $('#dialog-success').css('display', 'block');
            $.extend(local, res.data);
            setShare(local.score, local.city, local.phone, local.cityId);
            // common.share({shareTitle: setShare(local.score, local.city, local.rank)});
        } else {
            new Fixtip({msg: res.message || '请求错误'});
        }
        Loading.hide();
    });
}

// 绑定UI事件
function bindEvent() {
    var $body = $('body');
    var $currentDialog = null;

    // 说明弹窗确定按钮
    $('#desc').on('tap', '.alert-btn', function() {
        $('#mask').css('display', 'none');
        $('#desc').css('display', 'none');
    });

    // 说明弹窗确定按钮
    $('#login').on('tap', '.alert-btn', function() {
        $('#mask').css('display', 'none');
        $('#login').css('display', 'none');
    });
    

    // 立即领取
    $('#get-btn').on('tap', function() {
        if (isDev) {
            local.openid = Date.now();
        }
        client.getTicket();
    });

    // game.score = 10;
    // local.phone = 10112340060;
    // local.openid = 1060;
    // local.lat = 30;
    // local.lng = 120;

    // 再玩一次
    $('#rank').on('tap', '.rank-replay-btn', function() {
        location.reload();
        // game.score++;
        // local.phone++;
        // local.openid++;
        
        // getTicketRequest({
        //     openid: local.openid,
        //     phone: local.phone
        // })
    });

    // 分享游戏
    $('#rank').on('tap', '.rank-share-btn', function() {
        $('#mask').css('display', 'block');
        $('#share').css('display', 'block');
    });

    $('#rank').on('tap', '.rank-nav li', function() {
        var $this = $(this);
        var index = $this.index();
        var $rank = $('.rank-list').children('.bd').eq(index);

        $this.addClass('current').siblings().removeClass('current');
        $rank.css('display', 'block').siblings('.bd').css('display', 'none');

        if (!rank.isInitCountryRank) {
            var callbak = function() {
                $('#country').find('.more').css('display', 'block');
                Loading.hide();
            };
            Loading.show();
            rank.getCountryRank(callbak);
        }
    });

    $('#city').on('tap', '.more', function() {
        if ($(this).hasClass('disabled')) return false;
        rank.getCityRank();
    });

    $('#country').on('tap', '.more', function() {
        if ($(this).hasClass('disabled')) return false;
        rank.getCountryRank();
    });

    // 排行榜
    $body.on('tap', '.dialog-rank', function() {
        $currentDialog = $(this).parents('.dialog');
        $currentDialog.css('display', 'none');
        $('#mask').css('display', 'none');
        rank.show();
    });

    // 查看账户
    $body.on('tap', '.dialog-check', function() {
        client.checkAccount();
    });

    // 再玩一次
    $body.on('tap', '.dialog-replay', function() {
        location.reload();
    });

    // 分享弹出层
    $('#share').on('tap', function() {
        $('#share').css('display', 'none');
        $('#mask').css('display', 'none');
    });

    $('#mask').on('tap', function() {
        if ($('#share').css('display') == 'block') {
            $('#share').css('display', 'none');
            $('#mask').css('display', 'none');
        }
    });

}

$(function() {
    common.init(window.CONF).share().getLocation();
    bindEvent();
    client.init();
    
})


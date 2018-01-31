require('./module/jquery.parallax');

const nativeReady = require('@util/native-bridge/lib/ready');
const nativeLogin = require('@util/native-bridge/lib/login');
const nativePayment = require('@util/native-bridge/lib/payment');
const nativeGoToPage = require('@util/native-bridge/lib/goToPage');
const queryString = require('@util/string-util/query-string');
const Tween = require('./module/tween');

const common = require('./module/common')();
const config = window.CONF;
const getLocation = require('./module/location');
const Fixtip = require('@ui/fixtip')
const Loading = require('@ui/loading/wloading');
const modal = require('@ui/modal');
const util = require('./module/util');

require('@ui/lazyload');


const template = require('@ui/template');
template.config("openTag", "[[")
template.config("closeTag", "]]")

//默认城市数据
const cityData = [{ "cityId": 1, "cityName": "杭州" }, { "cityId": 2, "cityName": "上海" }, { "cityId": 5, "cityName": "深圳" }, { "cityId": 6, "cityName": "南京" }, { "cityId": 3, "cityName": "北京" }, { "cityId": 4, "cityName": "广州" }, { "cityId": 8, "cityName": "天津" }, { "cityId": 242, "cityName": "成都" }, { "cityId": 84, "cityName": "苏州" }, { "cityId": 241, "cityName": "重庆" }, { "cityId": 175, "cityName": "武汉" }, { "cityId": 96, "cityName": "嘉兴" }, { "cityId": 81, "cityName": "无锡" }, { "cityId": 104, "cityName": "合肥" }, { "cityId": 141, "cityName": "济南" }, { "cityId": 120, "cityName": "宣城" }, { "cityId": 18, "cityName": "廊坊" }, { "cityId": 219, "cityName": "东莞" }, { "cityId": 125, "cityName": "泉州" }, { "cityId": 94, "cityName": "宁波" }, { "cityId": 122, "cityName": "厦门" }, { "cityId": 189, "cityName": "长沙" }, { "cityId": 208, "cityName": "佛山" }, { "cityId": 83, "cityName": "常州" }];
let latDataCache = {};
let cityCache = {};
let goodsNameCacheData = [];

const URI = {
    'index': '/nactive/nationactivity/index',
    'buying': '/nactive/nationactivity/buying',
    'bind': '/nactive/nationactivity/bind',
    'code': '/nactive/nationactivity/code',
    'couponScheme': 'ddyc://wallet/couponAndRedPacket',
    'download': 'http://dl.ddyc.com?tips=true',
    'homeScheme': 'ddyc://home',
    'viewShop': 'http://active.yangchediandian.com/storelist160119/index.php'
}

let $cContainer, $container;


//分享
common.share();

function showMsg(msg) {
    new Fixtip({ msg: msg, bottom: '63%' });
}

function validatePhone(phone) {
    const phonePattern = /^1\d{10}$/;
    if (!phonePattern.test(phone)) {
        return false;
    }
    return true;
}

/**
 * 滚动
 */
let scroll = {
    $container: null,
    cWidth: 0,
    timer: null,
    getRandomPhone: function() {
        let phones = [1],
            seconds = [3, 5, 8],
            thirds = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        let randoms = [];

        randoms.push(parseInt((Math.random() * 3)) + 1);
        randoms.push(parseInt((Math.random() * 10)) + 1);

        phones.push(seconds[randoms[0] - 1]);
        phones.push(thirds[randoms[1] - 1]);
        phones.push("****");
        phones.push(1000 + parseInt((Math.random() * 9000)));
        return phones.join('');
    },
    createHtml: function() {
        let html = [];
        for (let i = 0; i < 3; i++) {
            let index = parseInt((Math.random() * goodsNameCacheData.length)) + 1;
            html.push('<li><span>' + this.getRandomPhone() + '已抢购' + goodsNameCacheData[index - 1] + '</span></li>');
        }
        return html;
    },
    computorWidth: function($ul1) {
        let width = 0;
        $ul1 = $ul1 || $(this.$container.find("ul")[0]);
        $ul1.find("li").each(function() {
            width += $(this).width() + 1;
        });
        $ul1.css({ width: width });
    },
    removeUl: function() {
        let $uls = this.$container.find("ul");
        $($uls[0]).remove();
    },
    updateUl: function($ul) {
        $ul.html(this.createHtml().join(''));
        this.computorWidth($ul);
    },
    appendUl: function() {
        let $ul = $("<ul class='clearfix'>" + this.createHtml().join('') + "</ul>");
        this.$container.append($ul)
        this.computorWidth($ul);
    },
    checkAnimate: function() {
        let _this = this;
        _this.timer = window.setInterval(function() {
            let $uls = _this.$container.find("ul");
            let $ul1 = $($uls[0]);
            let left = Math.abs($ul1.offset().left);
            if (left > ($ul1.width() - _this.cWidth - 90)) {
                _this.startAnimateTwo()
            }
        }, 500);
    },
    animate: function() {
        let _this = this;
        let $uls = _this.$container.find("ul");
        let $ul1 = $($uls[0]);
        $ul1.animate({ left: -$ul1.width() }, 20000, function() {
            _this.$container.append($ul1);
            _this.updateUl($ul1);
            $ul1.css({ left: '100%' });
        });
    },
    startAnimateTwo: function() {
        let _this = this;
        let $uls = _this.$container.find("ul");
        let $ul2 = $($uls[1]);
        $ul2.animate({ left: -$ul2.width() }, 20000, function() {
            _this.$container.append($ul2);
            _this.updateUl($ul2);
            $ul2.css({ left: '100%' });
        });
    },
    init: function() {
        let _this = this;
        if (goodsNameCacheData.length == 0) {
            return;
        }
        _this.$container = $("#s_scroll_container");
        _this.cWidth = _this.$container.width();
        if (_this.timer) {
            window.clearInterval(this.timer);
        }
        _this.$container.html('');
        _this.appendUl();
        _this.appendUl();
        _this.appendUl();
        _this.animate();
        _this.checkAnimate();

    }
}


//app登录
let appClient = {
    login: function(fn) {
        if (window.APPINFO && window.APPINFO.userId - 0 > 0) {
            fn(window.APPINFO);
            return;
        }

        nativeLogin().then((info) => {
            window.APPINFO = info;
            fn(info)
        });
    },
    payment: function(orderId) {
        nativePayment({ orderId: orderId }).then(() => {})
    },
    viewShop: function() {
        nativeGoToPage({ type: 1, url: URI.viewShop + '?lat=' + latDataCache.lat + '&lng=' + latDataCache.lng, needLogin: false }).then(() => {})
    }
}

//其他登录
let otherClient = {
    callback: function() {},
    isLogin: false,
    login: function(fn) {
        if (this.isLogin) {
            fn(window.APPINFO);
            return;
        }
        $('.login-dialog').removeClass('hide');
        this.callback = fn;
    },
    getVcode: function() {
        const phone = $('#phone').val();
        const $vcodeBtn = $('#vcode-btn');
        if ($vcodeBtn.hasClass('disabled')) {
            return;
        }
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

        if (validatePhone(phone)) {
            $vcodeBtn.addClass('disabled');
            $vcodeBtn.text('发送中...');
            Loading.show();
            $.post(URI.code, {
                phone: phone
            }, function(res) {
                $vcodeBtn.removeClass('disabled');
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
                    $vcodeBtn.removeClass('disabled').text(text);
                    showMsg(res.message || '请求失败');
                }
            });
        } else {
            showMsg('手机号格式不正确');
        }
    },
    dialogLogin: function() {
        let _this = this;
        const phone = $('#phone').val();
        const vcode = $('#vcode').val();
        const $bindBtn = $('#login-dialog-btn');
        if ($bindBtn.hasClass('disabled')) {
            return;
        }

        if (!validatePhone(phone)) {
            return showMsg('手机号格式不正确');
        }
        if (!vcode) {
            return showMsg('请填写验证码');
        }
        $bindBtn.addClass('disabled');

        Loading.show();
        $.post(URI.bind, {
            phone: phone,
            code: vcode,
            openId: window.CONF.openid
        }, function(res) {
            $bindBtn.removeClass('disabled');
            Loading.hide();
            if (res.success) {
                _this.isLogin = true;
                $('.login-dialog').addClass('hide');
                otherClient.callback(res.data);
            } else {
                showMsg(res.message || '请求失败');
            }
        });
    },
    payment: function(url) {
        window.location.href = url;
    },
    viewShop: function() {
        window.location.href = URI.viewShop + '?lat=' + latDataCache.lat + '&lng=' + latDataCache.lng;
    }
}

//统一
let client = (function() {
    if (window.CONF.isapp) {
        return appClient;
    } else {
        return otherClient;
    }
})();

/**
 * 检查当前城市是否支持活动
 */
function checkCity(cityId) {
    cityId = cityId - 0;
    for (let i = 0; i < cityData.length; i++) {
        if (cityData[i].cityId === cityId) {
            cityCache = cityData[i];
            $("#switch_city").find("span").html(cityCache.cityName);
            $("#switch_city").data('cityId', cityCache.cityId);
            return true;
        }
    }
    return false;
}

/**
 * 渲染数据
 */
function renderData(data) {
    //判断当前城市是否支持
    if (!checkCity(data.cityId)) {
        Loading.hide();

        new modal.Modal({
            msg: '你当前城市没有活动，是否继续查看',
            btns: [{
                text: '否',
                onTap: () => {
                    if (window.CONF.isapp) {
                        window.location.href = URI.homeScheme
                    } else {
                        window.location.href = URI.download;
                    }
                }
            }, {
                text: '是',
                onTap: (value) => {
                        loadData(null, 1);
                    } // 返回false时，点击按钮不会隐藏对话框
            }]
        })
        return;
    }

    //初始化模板
    let category1Data = {};
    let category2Data = [];
    let category3Data = [];
    let pageInfoData = data.pageInfo;
    goodsNameCacheData = [];

    for (let i = 0; i < pageInfoData.length; i++) {
        goodsNameCacheData.push(pageInfoData[i].commodityName);
        if (pageInfoData[i].category == 1) {
            category1Data = pageInfoData[i];
            category1Data.appPrice = parseInt(category1Data.appPrice);
        } else if (pageInfoData[i].category == 2) {
            category2Data.push(pageInfoData[i]);
        } else {
            category3Data.push(pageInfoData[i]);
        }
    }

    category2Data = category2Data.sort(util.keysrt('position', false));
    category3Data = category3Data.sort(util.keysrt('position', false));

    if (goodsNameCacheData.length > 0) {
        $("#b_box_container").html(template('catgory1_tmp', category1Data));
        $("#p_list_box").html(template('catgory2_tmp', { data: category2Data }))
        $("#s_p_list_box").html(template('catgory3_tmp', { data: category3Data }))
        $('.lazyload').lazyload({
            effect: "fadeIn",
            event: "sporty"
        });
        var timeout = setTimeout(function() {
            $("img.lazyload").trigger("sporty")
        }, 500);
    } else {
        $("#b_box_container").html('');
        $("#p_list_box").html('');
        $("#s_p_list_box").html('');
    }


    $container.removeClass('hide');
    $cContainer.addClass('hide');
    scroll.init();

    Loading.hide();
}

/**
 * 加载数据
 */
function loadData(latData, cityId, $btn) {
    let data = latData || {};
    if (cityId) {
        data['cityId'] = cityId;
    }
    if (config.isapp) {
        data['userId'] = window.APPINFO.userId;
    }

    $.post(URI.index, data, function(res) {
        if ($btn) {
            $btn.removeClass('disabled');
        }
        if (res.success) {
            if (res.data && res.data.userId) {
                window.APPINFO.userId = res.data.userId;
            }
            renderData(res.data);
        } else {
            if (res.msg === '请选择城市') {
                Loading.hide();
                $container.addClass('hide');
                $cContainer.removeClass('hide');
            } else {
                showMsg(res.msg || '数据加载失败');
            }
        }
    });
}

/**
 * 选择城市
 */
function selectCity(cityId, $btn) {
    loadData(null, cityId, $btn);
}

//抢
function buying($btn, info) {
    if ($btn.hasClass('disabled')) {
        return;
    }
    $btn.addClass('disabled');
    $.post(URI.buying, info, function(res) {
        $btn.removeClass('disabled');
        if (res.success) {
            if (res.data) {
                client.payment(res.data);
            }
        } else {
            if (res.errCode && res.errCode - 0 === 6602) {
                $btn.addClass('hide');
                $btn.siblings('.btn').removeClass('hide');
            }
            showMsg(res.message || res.msg || '数据加载失败');
        }
    });
}

/**
 * 绑定事件
 */
function bindEvent() {

    //选择城市
    $cContainer.on('tap', 'li', function() {
        let $this = $(this);
        if ($this.hasClass('disabled')) {
            return;
        }
        $this.siblings('li').removeClass('active');
        $this.addClass('active');


        $this.addClass('disabled');
        Loading.show();
        selectCity($this.data('cityid'), $this);
    });

    //点击抢
    $container.on('tap', '.btn-init', function() {
        let $this = $(this);

        client.login(function(info) {
            buying($this, {
                goodsName: $this.data('packagename'),
                commodityCode: $this.data('code'),
                cityId: cityCache.cityId,
                cityName: cityCache.cityName,
                userId: (info && info.userId > 0) ? info.userId : '',
                orderSource: 0,
                latitude: latDataCache.lat,
                longitude: latDataCache.lng
            });
        })
    });

    $container.on('tap', '.btn-selected', function() {
        if (window.CONF.isapp) {
            window.location.href = URI.couponScheme;
        } else {
            window.location.href = URI.download;
        }
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

    $('#view_shops').on('tap', function() {
        client.viewShop();
    });

    $("#switch_city").on('tap', function() {
        $cContainer.removeClass('hide');
        $cContainer.find("#c_h_tip").css({ display: 'none' });
        $container.addClass('hide');
        let $li = $("li[data-cityid='" + $(this).data('cityId') + "']");
        $li.siblings("li").removeClass('active');
        $li.addClass('active');
    });

    const $introHeader = $("#intro_header");
    const $body = $("body");
    $("#switch_rule").on('tap', function() {
        new Tween().from({
            top: $body.scrollTop()
        }).to({
            top: $introHeader.offset().top
        }).on('update', function(v) {
            $body.scrollTop(v.top);
        }).start();
    })


}


/**
 * 初始化
 */
function init() {
    Loading.show();
    $cContainer.find("ul").html(template('city_tmp', { data: cityData }));

    getLocation(function(latData) {
        latDataCache = latData || { lat: '', lng: '' };
        if (latData) {
            loadData(latData);
        } else {
            Loading.hide();
            //没有获取到经纬度
            $cContainer.removeClass('hide');
            $container.addClass('hide');
        }
    });

    //parallax
    $("#scene").parallax();
}


$(function() {
    $cContainer = $("#c_container");
    $container = $("#container");
    init();
    bindEvent();
})
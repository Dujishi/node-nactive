const Fixtip = require('@ui/fixtip');
const Common = require('@util/common-page');
const SelectButton = require('@ui/select-button');
const callShare = require('@util/native-bridge/lib/callShare');
const queryString = require('@util/string-util/query-string');
const nativeBridge = require('@util/native-bridge');
const isLogin = require('@util/native-bridge/lib/isLogin');
const Loading = require('@ui/loading/wloading');
const queryParams = queryString.parse(window.location.search);
const jumpNativePage = require('@util/jump-native-page');
const payment = require('@util/native-bridge/lib/payment');
const goToView = require('@util/native-bridge/lib/goToView');
const modal = require('@ui/modal');
const cityIdList = require('../../service/cityList');
let cityList = CONF.cityList.split(',');
const activeId = queryParams.activeId;
require('@ui/lazyload');
const $cityContainer = $('#cityContainer');
let lat, lng;

const common = Common.create();
common.share((type) => {
});
const analytics = Common.analytics;

function getCityId(lat, lng) {
    $.post('/nactive/sku/city', {
        lat,
        lng
    }, (res) => {
        if (res.success) {
            let inArray = false;
            cityList.forEach(function (e) {
                if (e == res.data.cityId) {
                    inArray = true;
                }
            })
            if (!inArray) {
                new modal.Modal({
                    title: '提示',
                    msg: '您所在城市不参与活动，是否继续查看？',
                    inputType: '',
                    btns: [{
                        text: '取消',
                        onTap: () => {
                            //jumpNativePage.init("ddyc://home/vipBuy");
                        }
                    }, {
                        text: '确定',
                        onTap: () => {
                            $('.cityTips').html('请选择城市');
                            $cityContainer.show();
                        }
                    }]
                })
            }
        } else {
            $cityContainer.show();
        }
    });
}

$(() => {
    let dataConfig = [];
    const conf = window.CONF;
    let AppInfo = nativeBridge.getAppInfoSync() || {};
    cityList.forEach(function (e) {
        cityIdList.forEach(function (value) {
            if (e == value.id) {
                dataConfig.push({id: e, name: value.name});
            }
        })
    })

    const selectButton = new SelectButton(dataConfig);
    selectButton.destory();
    $('#xk_select_button button').on('touchend', function () {
        $cityContainer.fadeOut(200);
    })

    common.getLocation().then(function (opts) {
        lat = opts.latitude;
        lng = opts.longitude;
        getCityId(opts.latitude, opts.longitude);
    }, err => {
        $cityContainer.show();
        console.log(err);
    })

    function bindEvent() {
        $('.fixed-tips').off('tap').on('tap', function () {
            $('.mask').fadeIn(200);
        })
        $('.close').off('tap').on('tap', function () {
            $('.mask').hide();
        })
        $('.mask').off('tap').on('tap', function () {
            $('.mask').hide();
        })
        $('.tops-con').off('tap').on('tap', function (e) {
            e.stopPropagation();
        })
        $(".lazy").lazyload();
        $("#btnWrap").on('tap', '.joinvip', function () {
            if (conf.isapp) {
                jumpNativePage.init('ddyc://home/vipBuy');
            } else {
                window.location.href = '/feopen/vip/index';
            }
        }).on('tap', '.buy-btn', function () {
            if (conf.isapp) {
                if (AppInfo.userId) {
                    toOrder(AppInfo.userId).then(res => {
                        payment({
                            orderId: res.data.orderId
                        });
                    });
                    return;
                }
                nativeBridge.ready((info) => {
                    if (isLogin()) {
                        AppInfo = info;
                        toOrder(info.userId).then(res => {
                            payment({
                                orderId: res.data.orderId
                            });
                        });
                    } else {
                        nativeBridge.login().then((info) => {
                            AppInfo = info;
                            $.get('/nactive/sku/bar', {
                                userId: info.userId,
                                activeId
                            }).then(res => {
                                $("#btnWrap").html(res);
                            })
                        })
                    }
                })
            } else {
                // toOrder().then(ret=>{
                //     if(ret.success){
                //         window.location.href = ret.data.uri;
                //     }
                // });
                window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.chediandian.customer&g_f=995720';
            }

        })
    }

    bindEvent();
    function needLogin() {
        return new Promise((resolve, reject) => {
            try {
                nativeBridge.ready((info) => {

                    if (isLogin()) {
                        resolve(info);
                    } else {
                        nativeBridge.login().then((info) => {
                            resolve(info);
                        })
                    }
                })
            } catch (err) {
                reject(err);
            }

        })
    }

    function toOrder(userId) {
        Loading.show();
        return $.ajax({
            url: "/nactive/sku/pay",
            type: "POST",
            dataType: "json",
            data: {
                lat: lat,
                lng: lng,
                commodityCode: CONF.commodityCode,
                activeId: activeId,
                userId
            }
        }).then((ret) => {
            Loading.hide();
            if (!ret.success) {
                if (ret.code == -1) {
                    location.href = '/feopen/login/index?url=' + location.href;
                    return;
                }
                new Fixtip({msg: ret.message});
            }
            return ret;
        }, (err) => {
            console.log(err);
            new Fixtip({msg: '网络错误'});
        });
    }


});

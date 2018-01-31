const ready = require('@util/native-bridge/lib/ready');
const isLogin = require('@util/native-bridge/lib/isLogin');
const login = require('@util/native-bridge/lib/login');
const goToPage = require('@util/native-bridge/lib/goToPage');
const Common = require('@util/common-page');
const Loading = require('@ui/loading/wloading');
const SelectButton = require('@ui/select-button');
const modal = require('@ui/modal');
const Fixtip = require('@ui/fixtip');
const userCarView = require('@util/native-bridge/lib/userCarView');

const CONF = window.CONF;
const isApp = CONF.isapp;
const isWechat = CONF.iswechat;
const originLink = window.location.origin;

const locationData = {};
let cityId;
const activityId = 222;

$(() => {
    Loading.show();
    if (isApp) {
        ready(() => {

        });
    }

    const common = Common.create();
    common.share(() => {});

    const selectButton = new SelectButton();
    selectButton.destory();

    common.getLocation().then((res) => {
        locationData.lat = res.latitude;
        locationData.lon = res.longitude;
        getCity(res.latitude, res.longitude);
    }, () => {
        showCityList();
    });

    function getProductList(city = '') {
        $.post('/nactive/upkeep/index', { cityId: city }, (res) => {
            if (res.success) {
                console.log(res);
                const html = template('product-tpl', res.data);
                $('#productWrap').html(html);
                eventBind();
            }
        });
    }

    function showCityList() {
        $('.container').hide();
        $('.city-container').show();
        Loading.hide();
    }

    function hideCityList() {
        $('.container').show();
        $('.city-container').hide();
    }

    function getCity(lat, lon) {
        if (lat && lon && lat > 0 && lon > 0) {
            $.post('/nactive/upkeep/city', { lat, lon }, (res) => {
                if (res.success && res.data != null) {
                    cityId = res.data.cityId;
                    getNearbyShop();
                    getProductList(cityId);
                    // cityDiff();
                    Loading.hide();
                } else {
                    // 如果接口获取城市id失败，考虑弹出城市选择框
                    showCityList();
                }
            });
        } else {
            showCityList();
        }
    }

    function getNearbyShop() {
        if (locationData.lat && locationData.lon) {
            $.post('/nactive/upkeep/shop', { activityId, commodityCode: 'L1072428', cityId, lat: locationData.lat, lon: locationData.lon }, (res) => {
                if (res.success && res.data && res.data.length > 0) {
                    if (res.data[0].avatar && res.data[0].avatar.indexOf('!') === -1) {
                        res.data[0].avatar = `${res.data[0].avatar}!/both/110x110/force/true`;
                    }
                    const html = template('nearby-shop-tpl', res.data[0]);
                    $('#nearbyShop').html(html);
                } else {
                    $('#nearbyShop').hide();
                }
            });
        } else {
            $('.nearby').hide();
        }
    }

    $('.city-container').on('tap', 'button', function () {
        cityId = $(this).attr('data-id');
        const cityName = $(this).text();
        modal.confirm({
            msg: `您将选择${cityName}作为服务城市`,
            ok: () => {
                // cityDiff();
                getProductList(cityId);
                $('.nearby').hide();
                hideCityList();
            }
        });
    });

    function eventBind() {
        function goToBuy(goodsCode) {
            if (!isApp && !isWechat) {
                window.location.href = 'http://dl.ddyc.com';
                return;
            }
            Loading.show();
            $.post('/nactive/upkeep/mate', { goodsCode, lat: locationData.lat, lon: locationData.lon }, (res) => {
                Loading.hide();
                if (res.success) {
                    window.location.href = res.data.payurl;
                } else if (res.code == -201) {
                    if (isApp) {
                        const carId = (res.data.carId).toString() || '';
                        new modal.Modal({
                            title: '',  // 可以为空
                            msg: '你的车辆信息需要完善后才可以购买！',
                            inputType: '',  // 输入框类型。为空时，不显示输入框
                            btns: [
                                {
                                    text: '取消',
                                }, {
                                    text: '去完善',
                                    onTap: () => {
                                        let status = 1;
                                        if (carId) {
                                            status = 2;
                                        }
                                        userCarView({ status, carId }).then((ret) => {
                                            if (ret) {
                                                goToBuy(goodsCode);
                                            }
                                        });
                                    },
                                }],
                        });
                    } else {
                        new modal.Modal({
                            title: '',  // 可以为空
                            msg: '你的车辆信息需要完善后才可以购买 , 此操作需要在典典养车APP内完成!',
                            inputType: '',  // 输入框类型。为空时，不显示输入框
                            btns: [
                                {
                                    text: '取消',
                                }, {
                                    text: '去下载',
                                    onTap: () => { window.location.href = 'http://dl.ddyc.com'; },
                                }],
                        });
                    }
                } else if (res.code === 'notlogin') {
                    window.location.href = `${window.location.origin}/feopen/login/index?url=${window.location.href}`;
                } else {
                    new Fixtip({ msg: res.message || res.msg });
                }
            });
        }
        $('.buy-btn').on('tap', function () {
            const goodsCode = $(this).attr('data-code');
            if (isApp) {
                if (isLogin()) {
                    goToBuy(goodsCode);
                } else {
                    login().then(() => {
                        goToBuy(goodsCode);
                    });
                }
            } else {
                goToBuy(goodsCode);
            }
        });

        $('.detail-sale').on('tap', function (e) {
            const commodityCode2 = $(this).attr('data-commodityCode2') || '';
            const url = `${originLink}/nactive/upkeep/detail?commodityCode=${commodityCode2}`;
            if (isApp) {
                goToPage({
                    type: 1,
                    url,
                });
            } else {
                window.location.href = url;
            }
            e.stopPropagation();
            // return false;
        });

        $('.go-detail, .product-img').on('tap', () => {
            const url = `${originLink}/nactive/upkeep/detail?commodityCode=L1054652`;
            if (isApp) {
                goToPage({
                    type: 1,
                    url,
                });
            } else {
                window.location.href = url;
            }
        });
        $('#shopView').on('tap', () => {
            let param;
            if (locationData.lat && locationData.lon) {
                param = `activityId=222&commodityCode=L222&cityId=${cityId}&lat=${locationData.lat}&lon=${locationData.lon}&isbuy=no`;
            } else {
                param = `activityId=222&commodityCode=L222&cityId=${cityId}&isbuy=no`;
            }
            const url = `${originLink}/nactive/upkeep/shoplist?${param}`;
            if (isApp) {
                goToPage({
                    type: 1,
                    url,
                });
            } else {
                window.location.href = url;
            }
            e.preventDefault();
            e.stopPropagation();
        });

        $('#goRule').click(function () {
            const top = ($($(this).attr('data-href')).offset().top + 5);
            $('body').scrollTo({ toT: top });
        });
    }
    $.fn.scrollTo = function (options) {
        const defaults = {
            toT: 0, // 滚动目标位置
            durTime: 500, // 过渡动画时间
            delay: 30, // 定时器时间
            callback: null // 回调函数
        };
        let opts = $.extend(defaults, options),
            timer = null,
            _this = this,
            curTop = _this.scrollTop(), // 滚动条当前的位置
            subTop = opts.toT - curTop, // 滚动条目标位置和当前位置的差值
            index = 0,
            dur = Math.round(opts.durTime / opts.delay),
            smoothScroll = function (t) {
                index++;
                const per = Math.round(subTop / dur);
                if (index >= dur) {
                    _this.scrollTop(t);
                    window.clearInterval(timer);
                    if (opts.callback && typeof opts.callback == 'function') {
                        opts.callback();
                    }
                    return;
                }
                _this.scrollTop(curTop + index * per);
            };
        timer = window.setInterval(() => {
            smoothScroll(opts.toT);
        }, opts.delay);
        return _this;
    };
});

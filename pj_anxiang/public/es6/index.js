const Fixtip = require('@ui/fixtip');
const loading = require('@ui/loading/wloading');
const modal = require('@ui/modal');
const ready = require('@util/native-bridge/lib/ready');
const isLogin = require('@util/native-bridge/lib/isLogin');
const payment = require('@util/native-bridge/lib/payment');
// const getAppInfo = require('@util/native-bridge/lib/getAppInfo');
const login = require('@util/native-bridge/lib/login');
const goToPage = require('@util/native-bridge/lib/goToPage');
const stringUtil = require('@util/string-util');
const closeView = require('@util/native-bridge/lib/closeView');
const common = require('./module/common');

// require('@ui/preload/src/loader');

let lat = '';
let lng = '';
// let cityId = '';
let client = '';

const app = {
    name: 'app',
    orderSource: 0,
    userId: 0,
    version: '',
    init() {
        ready((info) => {
            lat = info.lat;
            lng = info.lng;
            getCity();

            if (isLogin()) {
                this.userId = info.userId;
                this.version = info.version;
                initBtnState();
            }
        });
    },
    isLogin() {
        return Boolean(this.userId);
    },
    login() {
        login().then((ret) => {
            location.reload();
        });
    },
    getPrefix() {
        let prefix = 'ddyc';
        if (stringUtil.compareVersion(app.version, '3.7.20') && navigator.userAgent.toUpperCase().indexOf('IOS') != -1) {
            prefix = 'com.xk.ddyc';
        }
        return prefix;
    },
    gotoPay(data) {
        payment({
            orderId: data.orderId
        });
        // location.href = `${this.getPrefix()}://pay/pay?id=${data.orderId}`;
    },
    gotoView() {
        location.href = `${this.getPrefix()}://wallet/couponAndRedPacket`;
    },
    gotoStoreList() {
        goToPage({
            type: 1,     // 1是养车，2是典典
            url: getStoreListUrl()  // 跳转路径
        });
    },
    handleCityError() {
        new modal.Modal({
            msg: '您所在城市不参加此活动，是否继续查看',
            btns: [
                {
                    text: '是'
                },
                {
                    text: '否',
                    onTap: () => {
                        if (stringUtil.compareVersion(app.version, '3.8.30')) {
                            closeView();
                        }
                    }
                }
            ]
        });
    }
};

const wechat = {
    name: 'wechat',
    orderSource: 2,
    userId: 0,
    init() {
        if (this.isLogin()) {
            initBtnState();
        }
    },
    isLogin() {
        return window.CONF.isLogin;
    },
    login() {
        location.href = `${location.origin}/feopen/login/index?url=${decodeURIComponent(location.href)}`;
    },
    gotoPay(data) {
        location.href = data.payUrl;
    },
    gotoView() {
        location.href = 'http://dl.ddyc.com/';
    },
    gotoStoreList() {
        location.href = getStoreListUrl();
    },
    handleCityError() {
        new modal.Modal({
            msg: '您所在城市不参加此活动，是否继续查看',
            btns: [
                {
                    text: '是'
                },
                {
                    text: '否',
                    onTap: () => {
                        location.href = 'http://dl.ddyc.com/';
                    }
                }
            ]
        });
    }
};

const browser = {
    name: 'h5',
    init() {

    },
    gotoPay() {

    },
    handleCityError() {

    },
};

function initClient() {
    if (window.CONF.isapp) {
        client = app;
    } else if (window.CONF.iswechat) {
        client = wechat;
    } else {
        client = browser;
    }
}

function getCodes() {
    const codes = [];
    $('.btn').each(function () {
        codes.push($(this).data('code'));
    });
    return codes.join(',');
}

function getStoreListUrl() {
    const storeList = window.CONF.storeList.split(',').join('-');
    return `https://m.ddyc.com/nactive/storelist/index?careShopIdList=${storeList}`;
}

function initBtnState() {
    loading.show();
    $.post('/nactive/anxiang/isbuy', {
        userId: client.userId,
        codes: getCodes(),
    }, (res) => {
        loading.hide();
        console.log(res);
        if (res.success) {
            console.log($('.btn').length);
            res.data.forEach((v, i) => {
                if (v) {
                    $('.btn').eq(i).text('已购买，去查看').addClass('view-btn');
                }
            });
        } else {
            new Fixtip({ msg: res.message });
        }
    });
}

function getCity() {
    loading.show();
    $.post('/nactive/anxiang/city', { lat, lng }, (res) => {
        loading.hide();
        if (res.success && window.CONF.cityList.split(',').indexOf(String(res.data.cityId)) > -1) {
            // cityId = res.data.cityId;
        } else {
            client.handleCityError();
        }
    });
}

function prepay(code, itemName, shopId) {
    loading.show();
    $.post('/nactive/anxiang/buy', {
        userId: client.userId,
        orderSource: client.orderSource,
        itemCode: code,
        itemName,
        shopId,
        // cityId,
        lat,
        lng,
    }, (res) => {
        loading.hide();
        if (res.success) {
            client.gotoPay(res.data);
        } else if (res.code == -1) {
            client.login();
        } else {
            new Fixtip({ msg: res.message || '预付失败' });
        }
    });
}

function bindEvent() {
    const $body = $('body');

    $('.rules').on('tap', () => {
        $('.dialog-rules').removeClass('hide');
    });

    $('.close').on('tap', function () {
        $(this).closest('.dialog').addClass('hide');
    });

    $('.anxiang .present').on('tap', () => {
        $('.dialog-anxiang').removeClass('hide');
    });

    $('.product1 .present').on('tap', () => {
        $('.dialog-product1').removeClass('hide');
    });

    $('.product2 .present').on('tap', () => {
        $('.dialog-product2').removeClass('hide');
    });

    $('.store-btn').on('tap', () => {
        client.gotoStoreList();
    });

    $body.on('click', '.btn', function () {
        const $this = $(this);
        const code = $this.data('code');
        const itemName = $this.data('name');
        const shopId = $this.data('shopid');

        if (!client.isLogin()) {
            client.login();
            return false;
        }

        if (!$this.hasClass('view-btn')) {
            prepay(code, itemName, shopId);
        }
    });

    $body.on('tap', '.buy-btn', () => {
        $('.slide').addClass('hide');
        $('.sale').appendTo('.container');
    });

    $body.on('click', '.view-btn', () => {
        client.gotoView();
    });

    $body.on('tap', '.mask', function () {
        $(this).parents('.dialog').addClass('hide');
    });
}

$(() => {
    initClient();
    client.init();
    common.init(window.CONF).share().getLocation((latitude, longitude) => {
        lat = latitude;
        lng = longitude;
        getCity();
    });
    bindEvent();
});

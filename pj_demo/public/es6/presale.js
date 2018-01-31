const ready = require('@util/native-bridge/lib/ready');
const login = require('@util/native-bridge/lib/login');
const isLogin = require('@util/native-bridge/lib/isLogin');
const payment = require('@util/native-bridge/lib/payment');
const Fixtip = require('@ui/fixtip');

const ns = '/nactive/demo';
let appInfo = {};

/**
 * 下单
 */
let doing = false;
function subAction(shopId, goodsCode, goodsName, payPrice, shopPrice) {
    if (doing) {
        return;
    }
    if (shopId === '') {
        new Fixtip({
            msg: '请选择商家'
        });
        return;
    }

    doing = true;
    $.post(`${ns}/presale`, { shopId, goodsCode, goodsName, lat: appInfo.lat || '', lng: appInfo.lng || '', payPrice, shopPrice }, ({ success, message, data }) => {
        if (success) {
            if (window.CONF.isapp) {
                window.location.href = `com.xk.ddyc://pay/payment?orderId=${data}`;
                // payment({
                //     orderId: data
                // });
            } else {
                window.location.href = data;
            }
        } else {
            new Fixtip({
                msg: message
            });
        }
        doing = false;
    }, 'json');
}

function bindEvent() {
    $('.sub-btn').on('tap', function () {
        if (window.CONF.isapp) {
            if (!app.checkLogin()) {
                return;
            }
        }

        const $this = $(this);
        const goodsCode = $this.data('goodscode');
        const payPrice = $this.data('payprice');
        const shopPrice = $this.data('shopprice');
        const goodsName = $this.data('goodsname');
        const $shops = $(`input[name=shop_${goodsCode}]`);
        let shopId = '';
        for (let i = 0; i < $shops.length; i++) {
            if ($shops[i].checked) {
                shopId = $shops[i].value;
            }
        }
        subAction(shopId, goodsCode, goodsName, payPrice, shopPrice);
    });
}


const app = {
    init() {
        ready((info) => {
            appInfo = info;
            app.checkLogin();
        });
    },
    checkLogin() {
        if (!isLogin()) {
            login(() => {
                window.location.reload(true);
            });
            return false;
        }
        return true;
    }
};


const wechat = {
    init() {

    }
};

const task = {
    init() {
        if (window.CONF.isapp) {
            app.init();
        } else if (window.CONF.iswechat) {
            wechat.init();
        }
    }
};


$(() => {
    task.init();
    bindEvent();
});

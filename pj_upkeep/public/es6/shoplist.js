const Loading = require('@ui/loading/wloading');
const Fixtip = require('@ui/fixtip');
const ready = require('@util/native-bridge/lib/ready');
const isLogin = require('@util/native-bridge/lib/isLogin');
const login = require('@util/native-bridge/lib/login');
const payment = require('@util/native-bridge/lib/payment');
const modal = require('@ui/modal');
const queryString = require('@util/string-util/query-string');
const Common = require('@util/common-page');

const CONF = window.CONF;
const isApp = CONF.isapp;
let pageNumber = 1;

$(() => {
    const queryParams = queryString.parse(window.location.search);
    const lon = queryParams.lon || 0;
    const lat = queryParams.lat || 0;
    const commodityCode = queryParams.commodityCode;
    const activityId = queryParams.activityId;
    const cityId = queryParams.cityId;
    const isbuy = queryParams.isbuy;
    let userId;

    const common = Common.create();
    common.share((type) => {});
    const analytics = Common.analytics;

    if (isbuy == 'no') {
        $('.top-tips').hide();
        $('#wrap').css('padding', '0 .24rem 0');
    } else {
        $('.wrap').on('tap', '.shop-item', function (e) {
            const shopId = $(this).attr('data-id');
            const name = $(this).attr('data-name');
            new modal.Modal({
                title: `是否确认${name}作为保养服务商家？`,  // 可以为空
                msg: '',
                inputType: '',  // 输入框类型。为空时，不显示输入框
                btns: [{
                    text: '取消',
                }, {
                    text: '支付定金',
                    onTap: () => {
                        buy(commodityCode, shopId);
                    },
                }],
            });
        });
    }

    function getData() {
        $.post('/nactive/upkeep/shop', { activityId, commodityCode, cityId, pageNumber, lat, lon, userId }, (res) => {
            if (res.success) {
                Loading.hide();
                const data = res.data;
                let dom = '';
                pageNumber++;
                if (data.length < 10) {
                    $('#more').hide();
                }
                data.forEach((item) => {
                    const address = item.address || '';
                    const defaultAvatar = '//store.ddyc.com/res/xkcdn/icons/share/icon_storelist.png';
                    if (item.avatar) {
                        item.avatar = `${item.avatar.split('!')[0]}!/both/110x110/force/true`;
                    } else {
                        item.avatar = defaultAvatar;
                    }
                    if (item.distance !== undefined && item.distance !== null && item.distance !== '') {
                        item.distance = `${item.distance} km`;
                    } else {
                        item.distance = '';
                    }
                    dom += `<div class="shop-item" data-id="${item.careShopId}" data-name="${item.careShopName}">
                                    <div class="shop-img">
                                        <img src="${item.avatar}" alt="">
                                    </div>
                                    <div class="shop-text">
                                        <div class="shop-title">${item.careShopName}</div>
                                        <div class="shop-address">${address}</div>
                                        <div class="shop-len">${item.distance}</div>
                                    </div>
                                </div>`;
                });
                $('#wrap').append(dom);
            } else {
                $('#more').hide();
                Loading.hide();
                if (res.code == -2000) {
                    const dom = '<h3>暂无支持该活动的商家</h3>';
                    $('#wrap').append(dom);
                }
            }
        });
    }

    function toPayMent(id, url) {
        if (isApp) {
            ready((info) => {
                userId = info.userId;
                if (isLogin()) {
                    payment({ orderId: id });
                } else {
                    login().then((info) => {
                        userId = info.userId;
                    });
                }
            });
        } else {
            window.location.href = url;
        }
    }

    function buy(goodsCode, shopId) {
        $.post('/nactive/upkeep/order', {
            shopId,
            goodsCode,
            lat,
            lon,
            userId,
            activityId
        }, (res) => {
            Loading.hide();
            if (res.success && res.data && res.data.orderId) {
                const data = res.data;
                toPayMent(data.orderId, data.payUrl);
            } else {
                new Fixtip({
                    msg: res.message || '操作失败！'
                });
            }
        });
    }

    $('#more').on('tap', () => {
        Loading.show();
        getData();
    });
    if (isApp) {
        ready((info) => {
            if (isLogin()) {
                userId = info.userId;
                $('#more').trigger('tap');
            } else {
                login().then((info) => {
                    userId = info.userId;
                    $('#more').trigger('tap');
                });
            }
        });
    } else {
        userId = CONF.userId || '';
        $('#more').trigger('tap');
    }
});

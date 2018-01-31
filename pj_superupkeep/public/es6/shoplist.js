const Loading = require('@ui/loading/wloading');
const Fixtip = require('@ui/fixtip');
const nativeBridge = require('@util/native-bridge');
const modal = require('@ui/modal');
const queryString = require('@util/string-util/query-string');

const CONF = window.CONF;
const isApp = CONF.isapp;
let pageNumber = 1;

$(() => {
    const queryParams = queryString.parse(window.location.search);
    const lng = queryParams.lng;
    const lat = queryParams.lat;
    const goodsCode = queryParams.goodsCode;
    const activeId = queryParams.activeId;
    let AppInfo = nativeBridge.getAppInfoSync() || {};


    function getData() {
        $.post('/nactive/superupkeep/shop', { lon: lng || '30.288973', lat: lat || '120.089225', pageNumber, pageSize: 10, cityId: 1, careShopTypeList: [1, 5, 9], showStatus: 1 }, (res) => {
            if (res.success) {
                Loading.hide();
                const data = res.data;
                let dom = '';
                pageNumber++;
                if (data.length < 10) {
                    $('#more').hide();
                }
                data.forEach((item) => {
                    if (item.careShopId != 1231) {
                        const address = item.address || '';
                        const defaultAvatar = '//store.ddyc.com/res/xkcdn/icons/share/icon_storelist.png';
                        if (item.avatar) {
                            if (item.avatar.indexOf('!') == -1) {
                                item.avatar = `${item.avatar}!/both/110x110/force/true`;
                            }
                        } else {
                            item.avatar = defaultAvatar;
                        }
                        dom += `<div class="shop-item" data-id="${item.careShopId}" data-name="${item.careShopName}">
                                    <div class="shop-img">
                                        <img src="${item.avatar}" alt="">
                                    </div>
                                    <div class="shop-text">
                                        <div class="shop-title">${item.careShopName}</div>
                                        <div class="shop-address">${address}</div>
                                        <div class="shop-len">${item.distance}km</div>
                                    </div>
                                </div>`;
                    }
                });

                $('#wrap').append(dom);
            }
        });
    }

    function toPayMent(id, url) {
        if (isApp) {
            nativeBridge.ready((info) => {
                AppInfo = info;
                if (nativeBridge.isLogin()) {
                    nativeBridge.payment({ orderId: id });
                } else {
                    nativeBridge.login().then((info) => {
                        AppInfo = info;
                    });
                }
            });
        } else {
            window.location.href = url;
        }
    }

    function buy(goodsCode, shopId) {
        $.post('/nactive/superupkeep/buy', {
            shopId,
            goodsCode,
            lat,
            lng,
            userId: AppInfo.userId,
            activeId
        }, (res) => {
            Loading.hide();
            if (res.success) {
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
    $('#more').trigger('tap');

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
                    buy(goodsCode, shopId);
                },
            }],
        });
    });
});

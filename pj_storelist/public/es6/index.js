const Common = require('@util/common-page');
const ready = require('@util/native-bridge/lib/ready');
const setDocumentTitle = require('@util/native-bridge/lib/setDocumentTitle');
const Loading = require('@ui/loading/wloading');
const Fixtip = require('@ui/fixtip');
const queryUtil = require('@util/string-util/query-string');
const template = require('@util/xtpl/by-id');
const locationFn = require('@ui/getlocation').getLocation;
const modal = require('@ui/h5Dialog');

require('@ui/lazyload');

const loading = new Loading();

const map = require('../../../pj_cooperation/public/es6/module/map/index').default;

const urlParams = queryUtil.parse(window.location.search.substring(1));
const common = Common.create();

const isapp = window.CONF.isapp;
const analytics = Common.analytics;
const rb = !!urlParams.rb; // 判断是否为人保过来的连接

let pageNumber = urlParams.pageNumber || 1;
const pageSize = urlParams.pageSize || 20;

window.lat = urlParams.lat || 0;
window.lon = urlParams.lon || 0;

// 服务端返回的图片有少量是又拍云处理过的，已经加了参数
// 需要移除已经加的参数，并强制转换成110x100大小的图片
function getImg(img) {
    if (!img) return '';
    if (img.indexOf('!/') > -1) {
        img = img.split('!')[0];
    }
    return `${img}!/both/110x110/force/true`;
}

function initLazyload() {
    $('.lazyload').lazyload({
        placeholder_data_img: 'http://store.ddyc.com/res/xkcdn/icons/default/icon_pack1_default@2x.png'
    });
}

function renderStores() {
    function success(res) {
        const data = res.data;
        const defaultAvatar = '//store.ddyc.com/res/xkcdn/icons/share/icon_storelist.png';
        const $more = $('#more');
        let content = '';

        if (data && data.length) {
            data.forEach((item) => {
                item.avatar = getImg(item.avatar || defaultAvatar);
            });
            content = template(`${rb ? 'rb_tpl' : 'common_tpl'}`, { data, isapp });
        } else {
            content = '<li class="tc">暂无商家列表</li>';
        }

        $('#loading').remove();
        $('.all-stores ul').append(content);
        initLazyload();

        if (data.length < pageSize) {
            $more.css('display', 'none');
        } else {
            $more.css('display', 'block');
            pageNumber++;
        }
    }

    const params = $.extend({}, urlParams, {
        lon: window.lon,
        lat: window.lat,
        pageNumber,
        pageSize
    });


    // $.get("/pj_storelist/public/mock/stores.json", params, function(res) {
    $.post('/nactive/storelist/index', params, (res) => {
        if ($('.ui-loading-fixed').length > 0) {
            loading.forceHide();
        }
        if (res.success) {
            if (res.data && res.data.length > 0) {
                success(res);
            } else {
                renderEmpty();
            }
        } else {
            $('#more').css('display', 'none');
            new Fixtip({
                msg: res.message || '加载失败'
            });
        }
    }, 'json');
}

function renderEmpty() {
    $('.empty').css('display', 'block');
    $('#loading').css('display', 'none');
}

function bindEvent() {
    let istap = false;

    function detail() {
        if (istap || rb) {
            return;
        }
        if (isapp) {
            istap = true;
            window.setTimeout(() => {
                istap = false;
            }, 500);
            window.bridge.callHandler('shopDetail', {
                careShopId: $(this).data('careshopid') - 0
            }, () => {});
        } else {
            window.location.href = 'http://dl.xiaokakeji.com/';
        }
    }

    $('.store-list').on('tap', 'h3', () => {
        detail();
    });

    $('.store-list').on('tap', '.address', () => {
        detail();
    });

    $('.store-list').on('tap', 'img', () => {
        detail();
    });

    $('.store-list').on('tap', '.dh', function (e) {
        e.stopPropagation();
        e.preventDefault();

        const $this = $(this);
        map({
            latitude: $this.data('lat'), // 纬度，浮点数，范围为90 ~ -90
            longitude: $this.data('lng'), // 经度，浮点数，范围为180 ~ -180。
            slat: window.lat, // 开始坐标
            slon: window.lon, // 开始坐标
            shopName: $this.data('name'), // 位置名
            address: $this.data('address'), // 地址详情说明
        });
        return false;
    });

    $('#more').on('tap', () => {
        Loading.show();
        renderStores();
    });
}

function setTitle() {
    const title = urlParams.title || '典典连锁门店';

    if (isapp) {
        setDocumentTitle({
            title
        });
    } else {
        document.title = title;
    }
}

function init(lat, lon) {
    window.lat = window.lat || lat;
    window.lon = window.lon || lon;
    Loading.show();
    renderStores();
    bindEvent();
    setTitle();
}

function clearMadal() {
    $('#mask_box_bg').css({ display: 'none' });
    $('#confirm_box').remove();
    $('html').css('overflow', '');
}

/**
 * 处理获取位置信息
 */
let isModal = false;
function locationHandler(fn) {
    common.getLocation().then((res) => {
        clearMadal();
        fn(res);
    }, (res) => {
        // 事件打点， 该接口会自动发送数据，然后自动删除事件数据
        analytics.event('click', { type: 'storelist_location_error', errorMsg: JSON.stringify(res) });

        locationFn('h5').then((res) => {
            clearMadal();
            fn(res);
        }, (res) => {
            // 事件打点， 该接口会自动发送数据，然后自动删除事件数据
            analytics.event('click', { type: 'storelist_location_error_h5', errorMsg: JSON.stringify(res) });

            if (!isModal) {
                loading.forceHide();
                modal.alert({
                    btnText: '',
                    content: '获取地理位置失败，正在重新获取',
                    callback() {}
                });
                isModal = true;
            }
            window.setTimeout(() => {
                locationHandler(fn);
            }, 1000);
        });
    });
}

$(() => {
    $('#loading').css('display', 'none');
    loading.show();
    if (location.href.indexOf('debug') > -1) {
        delete urlParams.debug;
        init(30.288961, 120.089181);
        return;
    }
    common.share();

    if (window.lat && window.lon) {
        init();
        return;
    }

    if (isapp) {
        ready((info) => {
            init(info.lat, info.lng);
        });
        return;
    }

    locationHandler((res) => {
        init(res.latitude, res.longitude);
    });
});

import payment from './module/payment';
import loginAction from './module/login';
import rule from '../../config/rule';
import getQueryString from './module/queryString';

const ready = require('@util/native-bridge/lib/ready');
const Fixtip = require('@ui/fixtip');
const Common = require('@util/common-page');
const dialog = require('@ui/h5Dialog');
const Ajax = require('./module/service.js');
const template = require('@util/xtpl/by-id');
const Loading = require('@ui/loading/wloading');


const common = Common.create();
common.share();

const locationData = {
    lat: '0',
    lon: '0',
};


let pageNumber = 1;


const activityId = getQueryString('activityId');


// 获取参与活动商家
function getShopIdList(pageNumber, locationData) {
    Ajax.post('/nactive/double11/washCarRoom', { pageNumber, activityId, locationData }).then((res) => {
        if (res.length === 0) {
            $('.get-more-btn').text('已获取全部');
            $('.get-more-btn').attr('disable', false);
            return;
        }
        const data = res;
        const content = template('wash_tpl', { data });
        $('.ul').append(content);
    });
}


// 活动规则弹框
function dialogShow() {
    dialog.alert({ content: rule.washRule });
}

// 下单
function goPayment(e) {
    const shopId = e.target.getAttribute('data-shopid');
    const goodsCode = e.target.getAttribute('data-code');
    const goodsItem = e.target.getAttribute('data-item');
    payment(2, locationData.lat, locationData.lon, goodsCode, shopId, goodsItem);
}

// 绑定监听事件
function bindEvent() {
    $('.active-rule').on('tap', () => {
        dialogShow();
    });

    $('.go-main').on('tap', () => {
        window.location.href = 'index';
    });

    $('.ul').on('tap', '.solding-btn', (e) => {
        Ajax.post('/nactive/double11/isSign').then((res) => {
            if (res === 0) {
                loginAction();
            } else if (locationData.lat != 0 || locationData.lon != 0) {
                goPayment(e);
            } else {
                Loading.show();
                common.getLocation().then((res) => {
                    Loading.hide();
                    locationData.lat = res.latitude;
                    locationData.lon = res.longitude;
                    goPayment(e);
                }, () => {
                    Loading.hide();
                    new Fixtip({ msg: '系统暂时获取不到你的定位哦~可以试试点击购买，并允许定位获取。' });
                });
            }
        });
    });

    $('.ul').on('tap', '.soldout-btn', () => {
        new Fixtip({ msg: '已被抢完' });
    });

    $('.get-more-btn').on('tap', (e) => {
        if (e.target.getAttribute('disable') !== 'false') {
            getShopIdList(++pageNumber, locationData);
        }
    });
}


// 获取经纬度
function getLocation() {
    if (window.CONF.isapp) {
        ready((info) => {
            locationData.lat = info.lat;
            locationData.lon = info.lng;
            getShopIdList(pageNumber, locationData);
        });
        return;
    }
    Loading.show();
    common.getLocation().then((res) => {
        Loading.hide();
        locationData.lat = res.latitude;
        locationData.lon = res.longitude;
        getShopIdList(pageNumber, locationData);
    }, () => {
        Loading.hide();
        getShopIdList(pageNumber, locationData);
        new Fixtip({ msg: '无法获取您的地理位置！' });
    });
}


$(() => {
    getLocation();
    bindEvent();
    // getShopIdList();
});

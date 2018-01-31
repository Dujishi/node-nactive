import payment from './module/payment';
import loginAction from './module/login';
import getQueryString from './module/queryString';
import changeRestTime from './module/time';
// import rule from '../../config/rule';


const ready = require('@util/native-bridge/lib/ready');
const Fixtip = require('@ui/fixtip');
const Common = require('@util/common-page');

const Ajax = require('./module/service.js');
const template = require('@util/xtpl/by-id');
const Loading = require('@ui/loading/wloading');


const common = Common.create();
common.share();

const locationData = {
    lat: '0',
    lon: '0',
};


// 获取活动id
const activityId = getQueryString('activityId') || window.CONF.activityId;


// 查询活动信息
function getActiveInfo() {
    const waxIds = window.CONF.waxIds;
    const oilIds = window.CONF.oilIds;

    Ajax.post('/nactive/double11/main', { waxIds, oilIds }).then((res) => {
        // console.log(res);
        const waxData = res.waxSkuList;
        const oilData = res.oilSkuList;
        const waxContent = template('wax_tpl', { waxData });
        const oilContent = template('oil_tpl', { oilData });
        // $('.time-text').text(res.status.countDownStr);
        // changeRestTime();
        $('.wax-block').append(waxContent);
        $('.oil-block').append(oilContent);
    });
}

// 下单
function goPayment(e) {
    const commodityCode = e.target.getAttribute('data-code');
    const shopId = '';
    const goodsItem = e.target.getAttribute('data-item');
    payment(1, locationData.lat, locationData.lon, commodityCode, shopId, goodsItem);
}

// 绑定事件
function bindEvent() {
    $('.wash-sku').on('tap', (e) => {
        const className = e.target.className;
        if (className === 'pay-btn') {
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
        } if (className.indexOf('button') > -1) {
            const commodityCode = e.target.getAttribute('data-code');
            const shopId = e.target.getAttribute('data-shopid');
            const lv1Id = e.target.getAttribute('data-lv1');
            const lv2Id = commodityCode.slice(1);
            window.location.href = `/feopen/goods/index?commodityCode=${commodityCode}&shopId=${shopId}&lv2Id=${lv2Id}&lv1Id=${lv1Id}&isBottom=true`;
        }
    });

    $('.go-wash').on('tap', () => {
        window.location.href = `washCarRoom?activityId=${activityId}`;
    });

    $('.active-rule').on('tap', () => {
        $('.main-dialog').show();
        $('body').css('position', 'fixed').css('overflow', 'hidden');
        $('html').css('position', 'fixed').css('overflow', 'hidden');
    });

    $('.close').on('tap', () => {
        $('.main-dialog').hide();
        $('body').css('overflow', 'auto').css('position', 'static');
        $('html').css('overflow', 'auto').css('position', 'static');
    });
}

// 获取经纬度
function init() {
    if (window.CONF.isapp) {
        ready((info) => {
            locationData.lat = info.lat;
            locationData.lon = info.lng;
        });
    }
}


$(() => {
    init();
    getActiveInfo();
    bindEvent();
});

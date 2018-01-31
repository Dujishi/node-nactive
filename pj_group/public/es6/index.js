const ready = require('@util/native-bridge/lib/ready');
const isLogin = require('@util/native-bridge/lib/isLogin');
const login = require('@util/native-bridge/lib/login');
const Common = require('@util/common-page');
const Loading = require('@ui/loading/wloading');
const modal = require('@ui/modal');
const Fixtip = require('@ui/fixtip');
const userCarView = require('@util/native-bridge/lib/userCarView');
const callShare = require('@util/native-bridge/lib/callShare');
const queryString = require('@util/string-util/query-string');
const FastClick = require('fastclick');
// require('@ui/lazyload');

const queryParams = queryString.parse(window.location.search);
const groupId = queryParams.groupId;
const common = Common.create();
const analytics = Common.analytics;
const CONF = window.CONF;
const originLink = window.location.origin;
const locationData = {
    lat: '0',
    lon: '0',
};

const ajaxUrl = {
    getProduct: '/nactive/group/getProduct',
    getTuanInfos: '/nactive/group/getTuanInfos',
    getPintuanInfo: '/nactive/group/getPintuanInfo',
    mateCar: '/nactive/group/mate',
};

const goToBuy = (goodsCode, pintuanNumber) => {
    Loading.show();
    let param = {};
    if (pintuanNumber || pintuanNumber === 0) {
        param = { goodsCode, lat: locationData.lat, lon: locationData.lon, extendInfo: pintuanNumber, };
    } else {
        param = { goodsCode, lat: locationData.lat, lon: locationData.lon, };
    }
    $.post(ajaxUrl.mateCar, param, (res) => {
        Loading.hide();
        if (res.success) {
            window.location.href = res.data.payurl;
        } else if (res.code == -201) {
            if (CONF.isapp) {
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
            if (CONF.isapp) {
                login().then((info) => {
                    window.location.reload();
                });
            } else {
                window.location.href = `${window.location.origin}/feopen/login/index?url=${window.location.href}`;
            }
        } else {
            new Fixtip({ msg: res.message || res.msg });
        }
    });
};

const bindEvent = () => {
    $('#groupWrap').on('click', '.btn-item-buy', function(){
        goToBuy($(this).attr('data-code'));
    });
    $('#groupHot').on('click', '.btn-item-group', function(){
        goToBuy($(this).attr('data-code'), 0);
    });
    $('#groupInvite').on('click', '.btn-item-group', function(){
        const pintuanNumber = $(this).attr('data-id');
        goToBuy($(this).attr('data-code'), pintuanNumber);
    });
    $('#groupMe').on('click', '.btn-item-group', function(){
        const commodityName = $(this).attr('data-commodityName');
        const id = $(this).attr('data-id');
        const appPrice = $(this).attr('data-appPrice');
        const commodityOriginCodePrice = $(this).attr('data-commodityOriginCodePrice');
        const shareUrl = `${CONF.shareUrl}?groupId=${(id)}`;
        const shareTitle = `拼团！我${appPrice}元买了售价${commodityOriginCodePrice}元的${commodityName}`;
        const shareContent = `售价${commodityOriginCodePrice}元的${commodityName}拼团只需${appPrice}元`;
        const shareImgUrl = CONF.shareImgUrl;
        if (CONF.isapp) {
            callShare({
                url: shareUrl,
                content: shareContent,
                title: shareTitle,
                subTitle: shareContent,
                image: shareImgUrl,
            }).then(() => {
                // {success: true}
            });
        } else if (CONF.iswechat) {
            common.share((type) => { }, {
                shareUrl,
                shareContent,
                shareTitle,
                shareSubTitle: shareTitle,
                shareImgUrl,
            });
            $('.share-mask').show().on({'tap': function () {
                $(this).hide();
            },'touchstart':function(e){
                e.preventDefault();
            }});
        }
    });
    $('.header-history').on('click', function(){
        if (CONF.isapp) {
            if (!isLogin()) {
                login().then((info) => {
                    window.location.href = `${originLink}/nactive/group/history`;
                });
                return;
            }
        }
        window.location.href = `${originLink}/nactive/group/history`;
    });
    $('#groupWrap').on('click', '.group-img', function(){
        const code = $(this).attr('data-code');
        window.location.href = `${originLink}/nactive/group/detail?commodityCode=${code}`;
    });
};

const getProduct = () => {
    return $.post(ajaxUrl.getProduct, (res) => {
        if (res.success && res.data.length > 0) {
            const html = template('group-item-tpl', res.data);
            $('#groupHot').append(html).show();
            Loading.hide();
        } else {
            new Fixtip({ msg: res.message || res.msg });
        }
    });
};

const getUserGroup = () => {
    return $.post(ajaxUrl.getTuanInfos, { status: 1 }, (res) => {
        if (res.success && res.data.length > 0) {
            const html = template('group-item-tpl', res.data);
            $('#groupMe').append(html).show();
            countTime($('#groupMe').find('.end-time-count'));
        } else {
            // new Fixtip({ msg: res.message || res.msg });
        }
    });
};

const getPintuanInfo = (groupId) => {
    let ajax;
    if (groupId) {
        ajax = $.post(ajaxUrl.getPintuanInfo, { id: groupId, }, (res) => {
            if (res.success) {
                if (res.code == 200){
                    const arr = [];
                    res.data.buyNow = true;
                    arr.push(res.data);
                    const html = template('group-item-tpl', arr);
                    $('#groupInvite').append(html).show();
                    $('#groupInvite').find('.tips-title').text(res.data.userPhone);
                    countTime($('#groupInvite').find('.end-time-count'));
                }
            } else {
                new Fixtip({ msg: res.message || res.msg });
            }
        });
    }
    return ajax;
};

template.helper('imgSize', (url) => {
    return `${url.split('!')[0]}!/both/700x280/force/true`;
});

const countTime = (dom) => {
    dom.forEach((ele) => {
        const endTime = new Date(parseInt($(ele).attr('data-endtime')));
        const newTime = new Date();
        let gap = endTime - newTime;
        const toTen = (n) => {
            return (n >= 10) ? n : `0${n}`;
        };
        const timeFormat = (date) => {
            // 计算出相差天数
            const days = Math.floor(date / (24 * 3600 * 1000));
            // 计算出小时数
            const leave1 = date % (24 * 3600 * 1000);
            // 计算天数后剩余的毫秒数
            const hours = Math.floor(leave1 / (3600 * 1000));
            // 计算相差分钟数
            const leave2 = leave1 % (3600 * 1000);
            // 计算小时数后剩余的毫秒数
            const minutes = Math.floor(leave2 / (60 * 1000));
            // 计算相差秒数
            const leave3 = leave2 % (60 * 1000);
            // 计算分钟数后剩余的毫秒数
            const seconds = Math.floor(leave3 / 1000);
            return `${toTen(hours)}:${toTen(minutes)}:${toTen(seconds)}`;
        };
        setInterval(() => {
            $(ele).text(`剩余 ${timeFormat(gap)}`);
            gap -= 1000;
            if (gap <= 1000) {
                $(ele).html('拼团成功');
            }
        }, 1000);
    });
};

$(() => {
    FastClick.attach(document.body);
    Loading.show();
    common.share(() => {});
    common.getLocation().then((res) => {
        locationData.lat = res.latitude;
        locationData.lon = res.longitude;
    }, () => {
        new Fixtip({ msg: '无法获取您的地理位置！' });
    });
    getProduct();
    getPintuanInfo(groupId);
    getUserGroup();
    bindEvent();
});

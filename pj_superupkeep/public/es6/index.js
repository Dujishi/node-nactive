const ready = require('@util/native-bridge/lib/ready');
const isLogin = require('@util/native-bridge/lib/isLogin');
const goToPage = require('@util/native-bridge/lib/goToPage');
const userCarView = require('@util/native-bridge/lib/userCarView');
const login = require('@util/native-bridge/lib/login');
const shopDetail = require('@util/native-bridge/lib/shopDetail');

const Fixtip = require('@ui/fixtip');
const common = require('./module/common')();
const Loading = require('@ui/loading/wloading');
const SelectButton = require('@ui/select-button');
const modal = require('@ui/modal');
const queryString = require('@util/string-util/query-string');
const getLocation = require('./module/location');
const Pin = require('./module/Pin');
const jumpNativePage = require('@util/jump-native-page');
// const commonNew = require('@util/common-page');
const cityArr = require('../../config/city');

// const commonNewPage = commonNew.create();
require('@ui/lazyload');

const CONF = window.CONF;
const href = window.location.href;
const isApp = CONF.isapp;
const isWechat = CONF.iswechat;

const activeId = queryString.parse(window.location.search).activeId || '';
const shoplistUrl = `${window.location.origin}/nactive/storelist/index`;
const loginUrl = `${window.location.origin}/feopen/login/index?url=${href}`;
const defaultAvatar = '//store.ddyc.com/res/xkcdn/icons/share/icon_storelist.png';
const pageid = encodeURIComponent(`ddyc://home/mall?url=https://m.ddyc.com/nactive/superupkeep/index?activeId=${activeId}`);

let shopId = '';
let userId = '';
let cityId = '';
let latDataCache = {};
let hasCar = false;
let recommonName = '';
let recommonCode = '';
let recommonCode2 = '';
let initCarNum = '';
let initModelName = '';
let initSeriesName = '';
let newCarNum = '';
let newModelName = '';
let newSeriesName = '';
let intervalTimer;
const citys = [];
let timeCount = 0;
let itemData;
function getLoc(name) {
    try {
        return localStorage.getItem(name);
    } catch (e) {
        alert(e);
    }
}

if (isWechat) {
    wx.error((res) => {
        new Fixtip({ msg: `wx error:  ${JSON.stringify(res)}` });
        Loading.hide();
        $container.addClass('hide');
        $cityContainer.removeClass('hide');
        $('.ui-shop').hide();
    });
}

/**
 * 获取 webp 图片链接
 * @param {any} imgsrc
 * @returns
 */
function getWebpSrc(imgsrc, webpimgsrc) {
    let needwebp = false;
    let src = '';
    if (window.localStorage && typeof localStorage === 'object') {
        needwebp = localStorage.getItem('webpsupport') === 'true';
    }
    src = needwebp ? webpimgsrc : imgsrc;
    return src;
}

// 先加小的载模糊图片，再加载清晰图片
const imgSmall = document.querySelector('.img-small');
const loadImage = () => {
    const img = new Image();
    img.src = imgSmall.src;
    img.addEventListener('load', () => {
        imgSmall.classList.add('loaded');
    }, false);
    const imgLarge = new Image();
    imgLarge.src = getWebpSrc(imgSmall.dataset.large, imgSmall.dataset.largewebp);
    imgLarge.addEventListener('load', () => {
        imgLarge.classList.add('loaded');
    }, false);
    $('.img-small').after(imgLarge);
};

Loading.show();

$(() => {
    // return

    loadImage();

    function initLazyload() {
        $('.lazyload').lazyload({
            placeholder_data_img: 'http://store.ddyc.com/app/decorate/2016/12/21/20161221053306elduaidhyah9jedb.jpg',
            effect: 'fadeIn',
            enevt: 'scrollstop',
            // threshold: 220,
        });
    }
    common.share();
    // alert(1);
    // window.setTimeout(() => {
    //     commonNewPage.share(() => { alert(2); });
    // }, 50);


    // const analytics = commonNewPage.analytics;
    $('body').scrollTop(0);
    const $container = $('.container');
    const $cityContainer = $('.city-container');
    const $fixTopNologin = $('.fix-top-nologin');
    const $fixTop = $('.fix-top');
    const $fixTopOther = $('.fix-top-other');
    const selectButton = new SelectButton([{ id: 1, name: '杭州' }]);
    selectButton.destory();


    if (isApp) {
        ready((info) => {
            if (isLogin()) {
                userId = info.userId;
                $fixTop.addClass('hide');
                if (!initCarNum) {
                    $.post('/nactive/superupkeep/car', { userId }, (res) => {
                        if (res.success && res.data) {
                            initCarNum = res.data.plateNumbers;
                            initModelName = res.data.modelName;
                            initSeriesName = res.data.seriesName;
                        }
                    });
                }
            } else {
                userId = '';
                $fixTop.addClass('hide');
                $fixTopNologin.removeClass('hide');
            }
        });
    } else {
        userId = CONF.userId;
        if (userId !== '') {
            $fixTop.addClass('hide');
        } else {
            $fixTop.addClass('hide');
            $fixTopNologin.removeClass('hide');
        }
    }

    // if (getLoc('lat') && getLoc('lng')) {
    //     latDataCache.lat = getLoc('lat') || '30.288973';
    //     latDataCache.lng = getLoc('lng') || '120.089225';
    //     getCityId(latDataCache.lat, latDataCache.lng);
    //     getShop(latDataCache);
    //     $container.removeClass('hide');
    //     $cityContainer.addClass('hide');
    // } else {
        // commonNewPage.getLocation().then((res) => {
        //     // latDataCache = res;
        //     latDataCache.lat = res.latitude;
        //     latDataCache.lng = res.longitude;
        //     alert();
        //     Loading.hide();
        //     console.log(latDataCache);
        //     if (latDataCache.lng && latDataCache.lat) {
        //         getCityId(res.latitude, res.longitude);
        //         getShop(latDataCache);
        //         $container.removeClass('hide');
        //         $cityContainer.addClass('hide');
        //     } else {
        //         Loading.hide();
        //         $container.addClass('hide');
        //         $cityContainer.removeClass('hide');
        //         $('.ui-shop').hide();
        //     }
        // }, (error) => {
        //     Loading.hide();
        //     $container.addClass('hide');
        //     $cityContainer.removeClass('hide');
        //     $('.ui-shop').hide();
        // });

        // 获取地理位置
    getLocation((latData) => {
            // latData 获取到的数据格式是 {lat: '3333', lng: '120.00'}
        latDataCache = latData || {};
        if (latDataCache.lat && latDataCache.lng) {
            getCityId((latDataCache.lat || '30.288973'), (latDataCache.lng || '120.089225'));
            getShop(latDataCache);
            $container.removeClass('hide');
            $cityContainer.addClass('hide');
        } else {
            Loading.hide();
            $container.addClass('hide');
            $cityContainer.removeClass('hide');
            $('.ui-shop').hide();
        }
    });
    // }

    // 吸顶设置
    const $height = $('header img').height();
    new Pin('.fix-top', '.fix-top', $height, {
        onPin: () => {
            $fixTop.each(function (index) {
                if (!$(this).hasClass('hide')) {
                    $(this).addClass('hide').fadeOut(200);
                    $($fixTopOther[index]).removeClass('hide').fadeIn(200);
                }
            });
        },
        onUnpin: () => {
            $fixTopOther.each(function (index) {
                if (!$(this).hasClass('hide')) {
                    $(this).addClass('hide').fadeOut(200);
                    $($fixTop[index]).removeClass('hide').fadeIn(200);
                }
            });
        }
    });

    /**
     * 获取活动相关数据
     *
     * @param {any} userId
     * @param {any} cityId
     */
    function getData(userId, cityId) {
        $.post('/nactive/superupkeep/index', { userId, cityId, activeId }, (res) => {
            let shopItemTemp = '';
            let recomentStr = '';
            let recommendTop = '';
            let btnStr = '';
            let carStr = '';
            let carTopStr = '';
            if (res.success) {
                itemData = res.data.items.list;
                const shopInfoList = res.data.items.list;
                const carInfo = res.data.car;
                recommonName = res.data.items.recommendation ? res.data.items.recommendation : '';
                let shopItemTemp1 = '';
                let shopItemTemp2 = '';
                let shopItemTemp0 = '';
                shopInfoList.map((item, index) => {
                    if (index === 0 && recommonName !== '') {
                        recomentStr = '<div class="recommend">推荐</div>';
                        recommendTop = '<div class="recommend-top"></div>';
                    } else {
                        recomentStr = '';
                        recommendTop = '';
                    }
                    if (item.bought != null) {
                        if (item.bought.toString() == 'true') {
                            btnStr = `<div class="buy hasaction-btn" data-bought="${1}" data-name="${item.name}" data-code="${item.code}" data-recommend="${item.recommendType}">
                                        <div class="buy-money">
                                            <p>定金:￥<span>${item.deposit}</span></p>
                                            <div>尾款:￥${item.balance}</div>
                                        </div>
                                        <div class="buy-status hasaction">立即<br/>查看</div>
                                    </div>`;
                        } else if (item.bought.toString() == 'false') {
                            btnStr = ` <div class="buy action-btn" data-name="${item.name}" data-code="${item.code}">
                                            <div class="buy-money">
                                                <p>定金:￥<span>${item.deposit}</span></p>
                                                <div>尾款:￥${item.balance}</div>
                                            </div>
                                            <div class="buy-status action"><span>限购<br/>1份</span><strong>抢</strong></div>
                                        </div>`;
                        }
                    } else {
                        btnStr = `<div class="buy" data-name="${item.name}" data-code="${item.code}">
                                        <div class="buy-money">
                                            <p>定金:￥<span>${item.deposit}</span></p>
                                            <div>尾款:￥${item.balance}</div>
                                        </div>
                                        <div class="buy-status">未开抢</div>
                                    </div>`;
                    }

                    const dom1 = `<div class="ui-cell">
                            ${recomentStr} 
                            <div class="ui-box" data-index="${index}" data-name="${item.name}" data-isbuy="${item.bought}" data-code="${item.code}" data-sales="${item.sales}" data-content="" data-title="${item.detail.itemTitle}" data-hbcontent="">
                                ${recommendTop}`;
                    const dom2 = `<div class="ui-title">${item.descr}</div>
                                <div class="ui-content">
                                    <div class="ui-img"><img width="100%" class="lazyload"  data-original="${item.imgUrl}" alt="${item.name}" /></div>
                                    <div class="ui-font">
                                        <div class="text-title">${item.name}</div>
                                        <div class="text-content">${item.type}<br />${item.specification}<br />${item.advice}</div>
                                        <div class="text-money"><div>送价值</div><div class="t"><span>${item.redPacketMoney}</span>元超值礼包<img src="/pj_superupkeep/public/images/new/arrow.png"/></div></div>
                                    </div>
                                </div>
                            </div>
                            ${btnStr}
                            <span class="sales-count">已售出${item.sales}份</span>
                        </div>`;

                    if (item.recommendType == 1) {
                        recommonName = item.name;
                        recommonCode = item.code;
                        shopItemTemp1 += `${dom1}<span class="ui-tag ui-tag-red">推荐</span>${dom2}`;
                    }
                    if (item.recommendType == 2) {
                        recommonCode2 = item.code;
                        shopItemTemp2 += `${dom1}<span class="ui-tag ui-tag-yellow">适用</span>${dom2}`;
                    }
                    if (item.recommendType == 0) {
                        shopItemTemp0 += `${dom1}${dom2}`;
                    }
                });
                shopItemTemp = shopItemTemp1 + shopItemTemp2 + shopItemTemp0;
                $('.container').removeClass('hide');
                $('.city-container').addClass('hide');
                $('.ui-cell-box').html(shopItemTemp);
                initLazyload();
                // 检查用户车辆信息是否完善
                if (!userId) {
                    // 未登录
                    $fixTop.addClass('hide');
                    $fixTopNologin.removeClass('hide');
                } else {
                    // 登录
                    if (carInfo && carInfo.series && carInfo.model) {
                        carStr = ` <div class="fix-top-img"><img src="${carInfo.imgUrl}" alt="" /></div>
                                    <div class="fix-top-xian"><img src="/pj_superupkeep/public/images/line.jpg" alt=""></div>
                                    <div class="fix-top-text"><span>${carInfo.brand} ${carInfo.series}</span><br />${carInfo.model ? carInfo.model : ''}</div>
                                    <div class="fix-top-button">更改<br />车辆</div>`;
                        carTopStr = `<div class="fix-top-img"><img src="${carInfo.imgUrl}" alt="" /></div>
                                        <div class="fix-top-xian"><img src="/pj_superupkeep/public/images/line.jpg" alt=""></div>
                                        <div class="fix-top-text"><span>${carInfo.brand} ${carInfo.series}</span><br />${carInfo.model ? carInfo.model : ''}</div>
                                        <div class="fix-top-button">更改车辆</div>`;
                        hasCar = true;
                        $fixTop.addClass('hide');
                        $('.fix-top-other-hascar').html(carTopStr);
                        $('.fix-top-hascar').html(carStr);
                        $('.fix-top-hascar').removeClass('hide');
                    } else {
                        $fixTop.addClass('hide');
                        $('.fix-top-nocar').removeClass('hide');
                        if (carInfo && carInfo.carId) {
                            $('.fix-top-nocar').attr('data-carId', carInfo.carId);
                        }
                        hasCar = false;
                    }
                }
            } else {
                new Fixtip({
                    msg: res.message || '数据加载失败'
                });
            }
            Loading.hide();
        });
    }


    /**
     * 根据经纬度获取城市 id
     *
     * @param {any} lng
     * @param {any} lat
     */
    function getCityId(lat, lng) {
        $.post('/nactive/superupkeep/city', { lat, lng }, (res) => {
            if (res.success) {
                cityId = res.data.cityId;
                cityArr.cityData.map(item => citys.push(item.cityId));
                if (citys.indexOf(cityId) > -1) {
                    getData(userId, cityId);
                } else {
                    $container.addClass('hide');
                    $cityContainer.removeClass('hide');
                    Loading.hide();
                }
            } else {
                // 如果接口获取城市id失败，考虑弹出城市选择框
                Loading.hide();
                $container.addClass('hide');
                $cityContainer.removeClass('hide');
            }
        });
    }

    /**
     * 获取附近门店
     *
     * @param {any} latDataCache
     */
    function getShop() {
        $.post('/nactive/superupkeep/shop', { lon: (latDataCache.lng || '120.089225'), lat: (latDataCache.lat || '30.288973'), pageNumber: 1, pageSize: 10, careShopTypeList: [1, 5, 9], showStatus: 1 }, (res) => {
            if (res.success) {
                const data = res.data;
                // const defaultAvatar = '//store.ddyc.com/res/xkcdn/icons/share/icon_storelist.png';
                shopId = data[0].careShopId;
                const shopTemp = `<img src=${data[0].avatar ? data[0].avatar : defaultAvatar} alt="">
                                <p class="shop-name">${data[0].careShopName}</p>
                                <p class="shop-address">${data[0].address ? data[0].address : ''}</p>
                                <span class="shop-distance">距离：${data[0].distance}km</span>`;
                $('.shop-item').html(shopTemp);
            } else {
                $('.ui-shop').hide();
                new Fixtip({ msg: res.message || '获取不到附近商家数据' });
            }
        });
    }


    /**
     * 查看店铺
     */
    function goToShop() {
        //
        const url = `${shoplistUrl}?lat=${latDataCache.lat}&lon=${latDataCache.lng}&pageSize=10&careShopTypeList=1-5-9&showStatus=1`;
        if (isApp) {
            goToPage({
                type: 1,
                url,
            });
        } else if (isWechat) {
            window.location.href = url;
        } else {
            window.location.href = url;
            // jumpNativePage.init(pageid);
            // window.location.href = 'http://dl.ddyc.com';
        }
    }

    /**
     * 前往详情页
     */
    function goToDetail() {
        const detailUrl = `${window.location.origin}/nactive/superupkeep/detail?activeId=${activeId}&lat=${latDataCache.lat}&lng=${latDataCache.lng}`;
        if (isApp) {
            goToPage({
                type: 1,
                url: detailUrl,
            });
        } else {
            window.location.href = detailUrl;
        }
    }

    /**
     * 完善车辆信息
     */
    function completeCarInfo() {
        if (isApp) {
            const carId = $('.fix-top-nocar').attr('data-carId');
            if (carId) {
                userCarView({ status: 2, carId }).then((ret) => {
                    if (ret) {
                        hasCar = true;
                        getData(userId, cityId);
                    }
                });
            } else {
                userCarView({ status: 1, carId: '' }).then((ret) => {
                    if (ret) {
                        hasCar = true;
                        getData(userId, cityId);
                    }
                });
            }
        } else {
            new modal.Modal({
                title: '',  // 可以为空
                msg: '此操作需要在典典养车APP内完成，有APP，去打开；没APP，去下载~',
                inputType: '',  // 输入框类型。为空时，不显示输入框
                btns: [{
                    text: '取消',
                }, {
                    text: '去下载',
                    onTap: () => { window.location.href = 'http://dl.ddyc.com'; },
                }],
            });
        }
    }

    /**
     * 去登录，有些情况需要刷新页面，有些情况不刷新体验更好
     *
     */
    function toLogin(isreload) {
        if (isApp) {
            login().then((ret) => {
                userId = ret.userId;
                isreload ? window.location.reload() : getData(userId, cityId);
            });
        } else {
            window.location.href = loginUrl;
        }
    }

    /**
     * 去商户详情
     */
    function goToShopDetail() {
        if (isApp) {
            shopDetail({
                careShopId: shopId,
            });
        } else {
            jumpNativePage.init(pageid);
            // window.location.href = 'http://dl.ddyc.com';
        }
    }

    /**
     * 去红包页面
     */
    function goToRedEnvelope() {
        if (isApp) {
            goToView({ id: 'ticketList' });
        } else if (isWechat) {
            new modal.Modal({
                title: '',  // 可以为空
                msg: '此操作需要在典典养车APP内完成，有APP，去打开；没APP，去下载~',
                inputType: '',  // 输入框类型。为空时，不显示输入框
                btns: [
                    {
                        text: '取消',
                    }, {
                        text: '去下载',
                        onTap: () => { window.location.href = 'http://dl.ddyc.com'; },
                    }],
            });
        } else {
            jumpNativePage.init(pageid);
        }
    }

    /**
     * 更改车辆，因为更改车辆后 H5 无法通过回调获取新的默认车辆信息，只能通过定时器去轮询，获取到新的默认车辆信息后就清除定时器
     *
     * @param {any} id
     * @param {any} url
    */
    function toChangeCar() {
        if (isApp) {
            if (newCarNum !== '' && newCarNum !== initCarNum) {
                clearInterval(intervalTimer);
            } else {
                intervalTimer = setInterval(() => {
                    timeCount++;
                    if (timeCount > 50) {
                        clearInterval(intervalTimer);
                    } else {
                        getDefaultCar(userId);
                    }
                }, 2000);
            }
            window.location.href = 'ddyc.car://carList';
        } else if (isWechat) {
            new modal.Modal({
                title: '',  // 可以为空
                msg: '此操作需要在典典养车APP内完成，有APP，去打开；没APP，去下载~',
                inputType: '',  // 输入框类型。为空时，不显示输入框
                btns: [
                    {
                        text: '取消',
                    }, {
                        text: '去下载',
                        onTap: () => { window.location.href = 'http://dl.ddyc.com'; },
                    }],
            });
        } else {
            jumpNativePage.init(pageid);
        }
    }

    /**
     *  获取默认车辆
     */
    function getDefaultCar(userid) {
        $.post('/nactive/superupkeep/car', { userId: userid }, (res) => {
            if (res.success) {
                if (res.data == null) {
                    window.location.reload();
                } else {
                    newCarNum = res.data.plateNumbers;
                    newModelName = res.data.modelName;
                    newSeriesName = res.data.seriesName;
                    if (newCarNum !== initCarNum || newSeriesName !== initSeriesName || newModelName !== initModelName) {
                        window.location.reload();
                    }
                }
            }
        });
    }


    /**
     * 抢购
     */
    function buy(code) {
        if (!userId) {
            toLogin();
        } else {
            Loading.hide();
            const lng = latDataCache.lng || '120.089225';
            const lat = latDataCache.lat || '30.288973';
            window.location.href = `/nactive/superupkeep/shoplist?lat=${lat}&lng=${lng}&goodsCode=${code}&activeId=${activeId}`;
        }
    }

    $('#xk_select_button').on('tap', 'button', function (e) {
        e.preventDefault();
        Loading.show();
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
        cityId = $(this).attr('data-id');
        $container.removeClass('hide');
        $cityContainer.addClass('hide');
        getData(userId, cityId);
    });
    $('.shop-btn').on('tap', goToShop);
    $('header').on('tap', 'img', goToDetail);
    $('.fix-top-nocar, .fix-top-other-nocar').on('tap', '.fix-top-button', (e) => {
        e.preventDefault();
        completeCarInfo();
    });

    $('.fix-top-nologin, .fix-top-other-nologin').on('tap', '.fix-top-button', (e) => {
        e.preventDefault();
        toLogin();
    });

    $('.fix-top-hascar, .fix-top-other-hascar').on('tap', '.fix-top-button', (e) => {
        e.preventDefault();
        toChangeCar();
    });

    $('.shop-item').on('tap', (e) => {
        e.preventDefault();
        goToShopDetail();
    });

    $('.mask-btn').on('tap', function () {
        $('.mask-bg').hide();
        buyNow($(this));
    });

    function buyNow(obj) {
        const itemName = obj.attr('data-name');
        const code = obj.attr('data-code');
        if (!userId) {
            toLogin();
        } else if (hasCar) {
            // if (code !== recommonCode && code !== recommonCode2) {
            //     new modal.Modal({
            //         title: '确认抢购',  // 可以为空
            //         msg: `您所购买的${itemName}可能不适用于您的爱车，典典为您智能推荐${recommonName}`,
            //         inputType: '',  // 输入框类型。为空时，不显示输入框
            //         btns: [
            //             {
            //                 text: '去更改',
            //                 onTap: () => {
            //                         // toChangeCar();
            //                 },
            //             }, {
            //                 text: '坚持购买',
            //                 onTap: () => {
            //                     buy(code);
            //                 },
            //             }],
            //     });
            // } else {
                Loading.show();
                buy(code);
            //}
        } else {
            new modal.Modal({
                title: '确认抢购',  // 可以为空
                msg: '您还没有填写车辆信息<br/>无法为您推荐保养套餐哦',
                inputType: '',  // 输入框类型。为空时，不显示输入框
                btns: [
                    {
                        text: '去完善',
                        onTap: () => {
                            completeCarInfo();
                        }
                    }, {
                        text: '坚持购买',
                        onTap: () => {
                            buy(code);
                        },
                    }],
            });
        }
    }

    $('.ui-cell-box').on('tap', '.ui-box', function (e) {
        // 查看套餐详情
        e.preventDefault();
        const $index = $(this).attr('data-index');
        const code = $(this).attr('data-code');
        const bought = $(this).attr('data-isbuy');

        $('.mask-bg').show();
        $('.mask-header').text(itemData[$index].detail.itemTitle);
        $('.mask-middle').html(itemData[$index].detail.itemContent);
        $('.mask-close').on('tap', () => {
            $('.mask-bg').hide();
        });
        $('.mask-btn').attr('data-code', itemData[$index].code);
        $('.mask-btn').attr('data-name', itemData[$index].name);
        if (bought == 'true' || bought == true) {
            $('.mask-btn').hide();
        } else {
            $('.mask-btn').show();
        }
    })
    .on('tap', '.action-btn', function (e) {
        // 抢购
        e.preventDefault();
        buyNow($(this));
    })
    .on('tap', '.hasaction-btn', (e) => {
        // 已购买去查看
        e.preventDefault();
        goToRedEnvelope();
    });

    $.fn.scrollTo = function (options) {
        const defaults = {
            toT: 0,    // 滚动目标位置
            durTime: 500,  // 过渡动画时间
            delay: 30,     // 定时器时间
            callback: null   // 回调函数
        };
        let opts = $.extend(defaults, options),
            timer = null,
            _this = this,
            curTop = _this.scrollTop(), // 滚动条当前的位置
            subTop = opts.toT - curTop,    // 滚动条目标位置和当前位置的差值
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
                } else {
                    _this.scrollTop(curTop + index * per);
                }
            };
        timer = window.setInterval(() => {
            smoothScroll(opts.toT);
        }, opts.delay);
        return _this;
    };

    $('#goRule').click(function () {
        const top = ($($(this).attr('data-href')).offset().top) - 55;
        $('body').scrollTo({ toT: top });
    });
});

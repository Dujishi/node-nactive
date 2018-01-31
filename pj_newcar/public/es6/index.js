const ready = require('@util/native-bridge/lib/ready');
const isLogin = require('@util/native-bridge/lib/isLogin');
const login = require('@util/native-bridge/lib/login');
const Fixtip = require('@ui/fixtip');
const template = require('@util/xtpl');
const getSelectCar = require('./module/select_car');
const stringUtil = require('@util/string-util');
const getCommon = require('./module/common');
const callShare = require('@util/native-bridge/lib/callShare');
const norepeat = require('@ui/norepeat-event');
const SelectCity = require('@ui/select-city');
const loading = require('@ui/loading/wloading');
let selectCity = new SelectCity();
const jumpNativePage = require('@util/jump-native-page');
require('@ui/lazyload');
let formMgr;
let userId = '';
let bodyScrollTop = 0;

$(function () {

    let applyName = $('#applyName');
    let applyTel = $('#applyTel');

    // 分享
    function share() {
        if (CONF.isapp || CONF.iswechat) {
            let common = getCommon();
            common.share();
        } else {
            $('.share').hide();
        }
    }

    function checkLogin(info, cb) {
        // if (!isLogin()) {
        //     return ;
        // }         
        formMgr = {
            type: 'app',
            uuid: info.userId,
            lat: info.lat,
            lng: info.lng,
            phone: info.phone
        };
        userId = formMgr.uuid;
        getCarList();
        if (typeof cb === 'function') {
            cb();
        }
    }

    function bindEvent() {
        $('body').on('tap', '.booking-btn', function () {
            let href = $(this).data('href');
            href = window.location.protocol + '//' + window.location.host + href;
            if (CONF.isapp) {
                if (!isLogin()) {
                    login().then((info) => {
                        checkLogin(info, () => {
                            // goToPage({
                            //     type: 1,
                            //     url: href
                            // }).then(() => {
                            // })
                            window.location.href = href;
                        })
                    });
                    return;
                }
                // goToPage({
                //     type: 1,
                //     url: href
                // }).then(() => {
                // });
                window.location.href = href;
                return;
            }
            window.location.href = href;
        });
        // show config
        $('#carBox').on('touchend', '.show-config', function (e) {
            $(this).find('i').toggleClass('arrow');
            let config = $(this).parents('.car-item-text').find('.config');
            let text = $(this).find('span');
            if(config.hasClass('active')){
                config.removeClass('active');
                text.text('展开配置');
            }else{
                config.addClass('active');
                text.text('收起配置');
            }
            e.preventDefault();
        });
        // 购车流程展示事件
        $('#flowBtn').on('touchend', function (e) {
            $('.flow-mask').show().on('touchstart',function (e) {
                e.preventDefault();
            });
            $(".flow-mask-img").addClass('animated zoomIn');
            e.preventDefault();
        });
        $('#flowMaskBtn').on('touchend', function (e) {
            $('.flow-mask').hide();
            e.preventDefault();
        });

        //
        $('body').on('touchend', '.item-text-btn-chance-icon', function (e) {
            $('.sale-mask').show().on('touchstart',function (e) {
                e.preventDefault();
            });
            $(".sale-mask-wrap").addClass('animated zoomIn');
            e.stopPropagation();
            e.preventDefault();
        });
        $('#saleMaskBtn').on('touchend', function (e) {
            $('.sale-mask').hide();
            e.preventDefault();
        });
        // 分享按钮事件
        $('#shareBtn').on('tap', function () {
            if (CONF.isapp) {
                callShare({
                    url: CONF.shareUrl,
                    content: CONF.shareContent,
                    title: CONF.shareTitle,
                    subTitle: CONF.shareSubTitle,
                    image: CONF.shareImgUrl
                }).then(ret => {
                    // {success: true}
                })
            } else if (CONF.iswechat) {
                $('.share-mask').show().on({'tap': function () {
                    $(this).hide();
                },'touchstart':function(e){
                    e.preventDefault();
                }});
            }

        });
        // 城市地区选择
        $('#applyDes').on('touchend', function (e) {
            let that = $(this);
            selectCity.onTap(function (v) {
                $('#applyDes').val(v[1].n).attr('data-city', v[1].c);
            }).show();
            e.preventDefault();
        });
        // 车型选择
        $('#applyCar').on('touchend', function (e) {
            getSelectCar().onTap((v) => {
                let carName = v[0].brandName + ' ' + v[1].seriesName + ' ' + v[2].modelName;
                $('#applyCar').val(carName).attr({
                    'data-brand': v[0].brandId,
                    'data-series': v[1].seriesId,
                    'data-model': v[2].modelId,
                    'data-brand-name': v[0].brandName,
                    'data-series-name': v[1].seriesName,
                    'data-model-name': v[2].modelName
                });
            }).show();
            e.preventDefault();
        });
        // 填写没有想要的车辆
        norepeat.auto('#applyBtn').on('tap', function () {
            let name = $('#applyName');
            let tel = $('#applyTel');
            let des = $('#applyDes');
            let car = $('#applyCar');
            const $this = $(this);
            if ($this.hasClass('disabled')) {
                return;
            }
            loading.show();
            $.ajax({
                url: "/nactive/newcar/want",
                type: "POST",
                data: {
                    userId: userId,
                    userName: name.val(),
                    phone: tel.val(),
                    city: des.val(),
                    brandId: car.attr("data-brand"),
                    seriesId: car.attr("data-model"),
                    modelId: car.attr("data-series"),
                    brandName: car.attr("data-brand-name"),
                    seriesName: car.attr("data-series-name"),
                    modelName: car.attr("data-model-name")
                }
            }).then((ret) => {
                loading.hide();
                if (ret.success) {
                    name.val('');
                    tel.val('');
                    des.val('');
                    car.val('');
                    new Fixtip({msg: ret.data});
                }else{
                    new Fixtip({msg: ret.message});
                }
            }, () => {
                new Fixtip({msg: '网络错误'});
            });
        });
    }

    // 获取商品列表
    function getCarList() {
        $.ajax({
            url: '/nactive/newcar/list',
            type: 'GET',
            data: {userId: userId}
        }).then((ret) => {
            if (ret.success) {
                loading.hide();
                // console.log(ret);
                $('#carBox').html(template($('#car_item').html(), { data: ret.data.recommend }));
                $('#carMoreBox').html(template($('#car_more_item').html(), { data: ret.data.goods }));

                countdown.init(2017, 1, 6, 20, 0, 0);

                $('img.lazyload').lazyload({
                    effect: 'fadeIn'
                });
                $('div.lazyimg').lazyload({
                    effect: 'fadeIn'
                });

                $('body').append(template($('#swiper_item').html(), { data: ret.data.recommend }))

                $('.swiper-container').each(function(){
                    let swiper = new Swiper($(this), {
                        zoom: true,
                        zoomToggle :false,
                        // Disable preloading of all images
                        preloadImages: false,
                        // Enable lazy loading
                        lazyLoading: true,
                        onSlideChangeEnd: function (swiper) {
                            let elem = swiper.container.find('.pagination .pagination-num');
                            elem.html(swiper.activeIndex + 1);
                        }
                    });
                })
                
                

                $('.car-item-mask').on('click',function(e){
                    let index = $(this).attr('data-index');
                    let container = $(this).parent('.car-item-img').find('.swiper-container').find('.swiper-wrapper');
                    let swiper = $('.swiper-mask').eq(index);
                    swiper.css({'opacity':1,'z-index':600}).addClass('zoomIn');
                    bodyScrollTop = $('body').scrollTop();
                    console.log(bodyScrollTop);
                    $('.big-wrap').css({'height':$(window).height(),'overflow':'hidden'});
                    // let elemImg = swiper.find('img');
                    // for (let i = 0; i < elemImg.length; i++) {
                    //     elemImg[i].setAttribute('src', elemImg[i].getAttribute('data-swiper'));
                    // }
                    e.preventDefault();
                });

                $('.swiper-mask').on('click',function(){
                    $('.swiper-mask').css({'opacity':0,'z-index':'-600'}).removeClass('zoomIn');
                    $('.big-wrap').css({'height':'auto','overflow':'auto'});
                    $('body').scrollTop(bodyScrollTop);
                    console.log(bodyScrollTop);
                });

                

            } else {
                new Fixtip({msg: ret.message || ret.msg});
            }

        }, () => {
            new Fixtip({msg: '网络错误'});
        });
    }

    // 倒计时
    let countdown = {
        init: function (year, month, day, hour, minute, second) {
            let me = this;
            let ts = (new Date(year, month - 1, day, hour, minute, second)) - (new Date());//计算剩余的毫秒数
            if (ts > 0) {
                setInterval(function () {
                    me.count(year, month, day, hour, minute, second)
                }, 1000);
            }else{
                $('.countdown').html('活动已结束');
                $('.time-btn').html('<p class="item-text-btn-out">免费预约</p>');
                $('.time-btn-2').html('<p class="item-text-btn item-text-btn-out">免费预约</p>');
            }
        },
        count: function (year, month, day, hour, minute, second) {
            // 2018, 11, 11, 9, 0, 0
            let ts = (new Date(year, month - 1, day, hour, minute, second)) - (new Date());//计算剩余的毫秒数
            let dd = parseInt(ts / 1000 / 60 / 60 / 24, 10);//计算剩余的天数
            let hh = parseInt(ts / 1000 / 60 / 60 % 24, 10);//计算剩余的小时数
            let mm = parseInt(ts / 1000 / 60 % 60, 10);//计算剩余的分钟数
            let ss = parseInt(ts / 1000 % 60, 10);//计算剩余的秒数
            $("#countdownTime .time-d").text(this.checkTime(dd));
            $("#countdownTime .time-h").text(this.checkTime(hh));
            $("#countdownTime .time-m").text(this.checkTime(mm));
            $("#countdownTime .time-s").text(this.checkTime(ss));
        },
        checkTime: function (i) {
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        }
    };

    let checkValWarn = function () {
        let name = $('#applyName');
        let tel = $('#applyTel');
        name.on('keyup', function () {
            console.log(name.val());
            if (!/^[\u4e00-\u9fa5|a-zA-Z]{2,7}$/.test(name.val())){
                $('.item-warn-name').show();
            } else {
                $('.item-warn-name').hide();
            }
        });
        tel.on('keyup', function () {
            if (!/1[34578]\d{9}/.test(tel.val())) {
                $('.item-warn-tel').show();
            } else {
                $('.item-warn-tel').hide();
            }
        });
    };

    let timeHandler = window.setInterval(function () {
        function checkVal() {
            let name = $('#applyName').val();
            let tel = $('#applyTel').val();
            let des = $('#applyDes').text();
            let car = $('#applyCar').text();
            if (des == '请选择地区') {
                return false;
            }
            if (car == '请选择意向车型') {
                return false;
            }
            if (!/^[\u4e00-\u9fa5|a-zA-Z]{2,7}$/.test(name)) {
                return false;
            }
            if (!/1[34578]\d{9}/.test(tel)) {
                return false;
            }
            return true;

        }

        if (checkVal()) {
            $('.item-warn-name').hide();
            $('.item-warn-tel').hide();
            $('#applyBtn').removeClass('disabled');
        } else {
            $('#applyBtn').addClass('disabled');
        }
    }, 50);

    if (CONF.isapp) {
        ready((info) => {
            checkLogin(info);
        });
    } else {
        getCarList();
    }

    loading.show();
    share();
    bindEvent();
    getSelectCar().setBrandData();
    checkValWarn();

});
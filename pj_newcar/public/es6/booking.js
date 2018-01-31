const modal = require('@ui/modal');
const ready = require('@util/native-bridge/lib/ready');
const Fixtip = require('@ui/fixtip');
const template = require('@util/xtpl');
const getCommon = require('./module/common');
const isLogin = require('@util/native-bridge/lib/isLogin');
const stringUtil = require('@util/string-util');
const norepeat = require('@ui/norepeat-event');
const SelectCity = require('@ui/select-city');
const loading = require('@ui/loading/wloading');
let stringParse = stringUtil.queryString.parse(window.location.search);
let commodityCode = stringParse['commodity_code'];
let bookingPay = stringParse['booking_pay'];
let userId = "";
let goodsName = "";

$(function () {

    loading.show();

    // 分享
    function share() {
        if (CONF.iswechat) {
            let common = getCommon();
            common.share();
        }
    }

    share();

    if (CONF.isapp) {
        ready(info => {
            userId = info.userId;
            $('#bookTel').val(info.phone);
            if (!/1[34578]\d{9}/.test(info.phone)) {
                $('#infoBox .tel p').show();
            } else {
                $('#infoBox .tel p').hide();
            }
        });
    }

    $.ajax({
        url: "/nactive/newcar/item",
        type: "GET",
        data: {goodsCode: commodityCode}
    }).then((ret) => {
        loading.hide();
        let carData = {
            commodity_name: ret.data.commodityName,
            seckill_price: ret.data.ddPrice,
            commodity_imgs: ret.data.thumbImg
        };

        if (ret.success) {
            $('#carBox').html(template($('#car_info').html(), { data: carData }));
            goodsName = ret.data.commodityName;
        } else {
            new Fixtip({msg: ret.message});
        }
    }, () => {
        new Fixtip({msg: '网络错误'});
    });


    function checkVal() {
        let name = $('#bookName').val();
        let tel = $('#bookTel').val();
        let des = $('#bookDes').val();
        if (!/^[\u4e00-\u9fa5|a-zA-Z]{2,7}$/.test(name)) {
            return false;
        }
        if (!/1[34578]\d{9}/.test(tel)) {
            return false;
        }
        if (des == '') {
            return false;
        }
        return true;
    }

    function checkValShow() {
        let name = $('#bookName');
        let tel = $('#bookTel');
        let des = $('#bookDes');
        name.on('keyup', function () {

            if (!/^[\u4e00-\u9fa5|a-zA-Z]{2,7}$/.test(name.val())) {
                $('#infoBox .name p').show();
            } else {
                $('#infoBox .name p').hide();
            }
        });
        tel.on('keyup', function () {
            if (!/1[34578]\d{9}/.test(tel.val())) {
                $('#infoBox .tel p').show();
            } else {
                $('#infoBox .tel p').hide();
            }
        });
        des.on('keyup', function () {
            if (des.val() == '') {
                $('#infoBox .city p').show();
            } else {
                $('#infoBox .city p').hide();
            }
        });
    }

    checkValShow();

    let timeHandler = setInterval(function () {
        if (checkVal()) {
            $('.bar-btn').removeClass('disabled');
            $('#infoBox p').hide();
        } else {
            $('.bar-btn').addClass('disabled');
        }
    }, 50);

    // 城市地区选择
    let selectCity = new SelectCity();
    $('#bookDes').on('touchend', function (e) {
        let that = $(this);
        selectCity.onTap(function (v) {
            $("#bookDes").val(v[1].n).attr("data-city", v[1].c);
        }).show();
        e.preventDefault();
    });

    $('#successBtn').attr('href', "/nactive/newcar/contract?commodity_code=" + commodityCode);

    norepeat.auto('.bar-btn').on('tap', function () {

        const $this = $(this);
        if ($this.hasClass('disabled')) {
            return;
        }
        loading.show();
        let name = $('#bookName').val();
        let tel = $('#bookTel').val();
        let des = $('#bookDes').val();

        let params = {
            userId: userId,
            userName: name,
            phone: tel,
            city: des,
            goodsName: goodsName,
            goodsCode: commodityCode
        };
        $.ajax({
            url: "/nactive/newcar/order",
            type: "POST",
            data: params
        }).then((ret) => {
            $this.removeClass('disabled');
            loading.hide();
            if (ret.success) {
                // window.clearInterval(timeHandler);
                if (bookingPay == 'no') {
                    $('#successBtn').hide();
                } else {
                    $('#successBtn').show();
                }
                $('.booking-wrap').hide();
                $('.success').show().addClass('animated bounceInDown');
            } else {
                if(ret.code == 40060){
                    new modal.Modal({
                        title: '',
                        msg: ret.message,
                        inputType: '',
                        btns: [{
                            text: '我知道了',
                            onTap: (value) => {
                                window.location.href = '/nactive/newcar/index';
                            }
                        }]
                    });
                }else{
                    new Fixtip({msg: ret.message});
                }

            }
        }, () => {
            new Fixtip({msg: '网络错误'});
        });
    });

});
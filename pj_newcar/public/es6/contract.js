const modal        = require('@ui/modal');
const Fixtip       = require('@ui/fixtip');
const stringUtil   = require('@util/string-util');
const ready        = require('@util/native-bridge/lib/ready');
const isLogin      = require('@util/native-bridge/lib/isLogin');
const payment      = require('@util/native-bridge/lib/payment');
const getCommon    = require('./module/common');
const locationData = require('./module/location');
const norepeat     = require('@ui/norepeat-event');
const loading      = require('@ui/loading/wloading');


let bookingInfo    = stringUtil.queryString.parse(window.location.search.substring(1));
let urlParse = location.search;
let commodityCode = bookingInfo['commodity_code'];
let look = bookingInfo['look'];
let userId = "";
let lat;
let lng;
let formMgr;

$(function () {

    loading.show();
    
    // 分享
    function share(){
        if(CONF.iswechat){
            let common = getCommon();
            common.share();
        }
    }
    share();

    // 大写金额
    function AmountLtoU(num) {
         ///<summery>小写金额转化大写金额</summery>
         ///<param name=num type=number>金额</param>
         if (isNaN(num)) return "";
         var strPrefix = "";
         if (num < 0) strPrefix = "(负)";
         num = Math.abs(num);
         if (num >= 1000000000000) return "无效数值！";
         var strOutput = "";
         var strUnit = '仟佰拾亿仟佰拾万仟佰拾元角分';
         var strCapDgt = '零壹贰叁肆伍陆柒捌玖';
         num += "00";
         var intPos = num.indexOf('.');
         if (intPos >= 0) {
             num = num.substring(0, intPos) + num.substr(intPos + 1, 2);
         }
         strUnit = strUnit.substr(strUnit.length - num.length);
         for (var i = 0; i < num.length; i++) {
             strOutput += strCapDgt.substr(num.substr(i, 1), 1) + strUnit.substr(i, 1);
         }
         return strPrefix + strOutput.replace(/零角零分$/, '整').replace(/零[仟佰拾]/g, '零').replace(/零{2,}/g, '零').replace(/零([亿|万])/g, '$1').replace(/零+元/, '元').replace(/亿零{0,3}万/, '亿').replace(/^元/, "零元");
     };

    $.ajax({
            url: "/nactive/newcar/item",
            type: "GET",
            data: { goodsCode:commodityCode }
            }).then((ret)=>{
                 loading.hide();
                if(ret.success){
                     let price = ret.data.ddPrice;
                     $('#conPrice').text(price);
                     $('#bigPrice').text(AmountLtoU(price));
                }else{ 
                    new Fixtip({ msg:ret.message});
                }
        },() => {
                new Fixtip({ msg: '网络错误' });
        });

        if(look == 'look'){
            $("#barBox").hide();
        } 

    $('#checkWrap').on('tap',function(e){
        if($("#check").hasClass('check-icon')){
            $("#check").removeClass('check-icon');
            $(".bar-btn").addClass("bar-btn-no");
        }else{
            $("#check").addClass('check-icon');
            $(".bar-btn").removeClass("bar-btn-no");
        }
        e.preventDefault();
        e.stopPropagation();
    });

    function bindEvent(){
        norepeat.auto("#payBtn").on("tap", function () {
            if ($("#check").hasClass('check-icon')) {
                loading.show();
                $.ajax({
                    url: "/nactive/newcar/prepay",
                    type: "POST",
                    data: {
                        userId: formMgr.uuid,
                        lat: formMgr.lat,
                        lng: formMgr.lng,
                        goodsCode: commodityCode
                    }
                }).then((ret) => {
                    loading.hide();
                    if (ret.success) {
                        new modal.Modal({
                            title: '', 
                            msg: '请在10分钟内完成付款，否则订单将会被取消',
                            inputType: '',  
                            btns: [{
                                text: '我知道了',
                                onTap: (value) => {
                                    if (window.CONF.isapp) {
                                        // app 支付
                                        payment({
                                            "orderId": ret.data.orderId // 订单ID
                                        });
                                    } else {
                                        // 微信支付
                                        window.location.href = ret.data.uri;
                                    }
                                } 
                            }]
                        })

                    } else {
                        if(ret.code == 40060 || ret.code == 40070){
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
                            new Fixtip({ msg: ret.message });
                        }

                    }
                }, () => {
                    new Fixtip({ msg: '网络错误' });
                });
            } else {
                new Fixtip({ msg: '请先同意合同条款' });
            }

        });
    }

    if(CONF.isapp){
        ready( (info) => {
            formMgr = {
                uuid   : info.userId,
                lat    : info.lat,
                lng    : info.lng,
                phone  : info.phone
            };
            bindEvent();
        });
    }else{
        locationData(( res ) => {
            res = res || { lat: '', lng: '' };
            formMgr = {
                uuid: '',
                lat: res.lat,
                lng: res.lng,
                phone: ''
            };
            bindEvent();
        });
    }


});


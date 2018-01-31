const CONF = window.CONF;
// common 初始化
const Common = require('@util/common-page');
// 会自动使用window.CONF对象
const common = Common.create();
// 注册分享，并添加回调，目前分享仅支持APP和微信
common.share((type) => {
});


$(() => {
    let FastClick = require('fastclick');
    FastClick.attach(document.body);
    // window.location.href = '/nactive/template/index?activeId=188&test=hello';

    $("#getParamBtn").on('click',function(){
        const queryString = require('@util/string-util/query-string');
        const queryParams = queryString.parse(window.location.search);
        $("#getParam").html(JSON.stringify(queryParams));
    });

    $('#isLogin').on('click', function () {
        if(CONF.isapp){
            const isLogin = require('@util/native-bridge/lib/isLogin');
            if (isLogin()) {
                alert('已经登录');
            } else {
                alert('未登录');
            }
        }else{
            alert('当前不在App环境下');
        }

    });

    $('#goToLogin').on('click',function(){
        const isLogin = require('@util/native-bridge/lib/isLogin');
        const login = require('@util/native-bridge/lib/login');
        if(CONF.isapp){
            if(!isLogin){
                login().then((info)=>{
                    alert(JSON.stringify(info));
                })
            }else{
                alert('已经登录');
            }
        }else{
            alert('当前不在App环境下');
        }

    });

    $('#callAppShare').on('click', function () {
        const callShare = require('@util/native-bridge/lib/callShare');
        if(CONF.isapp){
            callShare({
                url: CONF.shareUrl,
                content: CONF.shareContent,
                title: CONF.shareTitle,
                subTitle: CONF.shareSubTitle,
                image: CONF.shareImgUrl
            }).then(ret => {})
        }else{
            alert('当前不在App环境下');
        }
    });

    $('#getLatLong').on('click',function(){
        common.getLocation().then(function(opts) {
            $('#latitude').text(opts.latitude);
            $('#longitude').text(opts.longitude);
        }, err => {
            console.log(err);
        })
    })

    $('#getCityId').on('click',function(){
        let lat = $('#getLat').val();
        let lng = $('#getLong').val();
        $.ajax({
            type:'GET',
            url:'getCityId',
            data:{
                lat:lat,
                lng:lng
            },
            success:function(data){
                $('#cityId').text(JSON.stringify(data));
            }
        });
    })

    $('#goToPay').on('click',function(){
        const payment  = require('@util/native-bridge/lib/payment');
        if(CONF.isapp){
            payment({
                orderId: '484239472394'
            });
        }else {
            //window.location.href = ''; // 拼接的h5跳转页面
        }
    })


});
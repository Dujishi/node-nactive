const ready = require('@util/native-bridge/lib/ready');
const isLogin = require('@util/native-bridge/lib/isLogin');
const login = require('@util/native-bridge/lib/login');
const loading = require('@ui/loading/wloading');
const callShare = require('@util/native-bridge/lib/callShare');
const getCommon = require('./module/wxshare');
require('./module/jquery.parallax');

$(()=>{
    function doneView(){
        $('#btn').addClass('btn-done');
        $('#viewDone').show();
        $('#viewText').hide();
        $('#activeText').hide();
    }

    function maskView(){
        $('#tips').on('tap',function(){
            $('#mask').show();
            $('#mask .tips-2').show().addClass('slideInDown');
        })
        $('#mask .btn').on('tap',function(){
            $('#mask').hide();
            $('#mask .tips-2').removeClass('slideInDown').hide();
        });
        $('#btn').on('tap',function(){
            window.location.href = 'http://dl.ddyc.com/';
        });

        // function loadImage(url, callback) {
        //     var img = new Image();
        //     img.src = url;
        //     img.onload = function(){ 
        //         callback.call(img); 
        //     };
        // }
        // loadImage('https://store.ddyc.com/res/xkcdn/images/freeticket/people.png',function(){
        //     $('#people img').show();
        //     $('#people').addClass('pulse');
        // });
    }

    $('#btn').parallax();
    $('#activeText').parallax();

    maskView();
    let common = getCommon();
    common.share();


});


const ready = require('@util/native-bridge/lib/ready');
const isLogin = require('@util/native-bridge/lib/isLogin');
const login = require('@util/native-bridge/lib/login');
const loading = require('@ui/loading/wloading');
const callShare = require('@util/native-bridge/lib/callShare');
const jumpNativePage = require('@util/jump-native-page');
const goToView = require('@util/native-bridge/lib/goToView');
require('./module/jquery.parallax');
const isApp = window.CONF.isapp;

$(()=>{
    function doneView(){
        $('#btn').addClass('btn-done');
        $('#viewDone').show();
        $('#viewText').hide();
        $('#activeText').hide();
        $('#btn').off('tap').on('tap',function(){
            if(isApp){
                goToView({ id: 'checkViolation' });
            }else{
                jumpNativePage.init('ddyc.car://violation');
            }
        })
        $('#viewDone').off('tap').on('tap',function(){
            if(isApp){
                goToView({ id: 'ticketList' });
            }else{
                jumpNativePage.init('ddyc.car://couponAndRedPacket');
            }
        })
    }

    function maskView(){
        $('#tips').on('tap',function(){
            $('#mask').show();
            $('#mask .tips-1').show().addClass('slideInDown');
        })
        $('#mask .btn').on('tap',function(){
            $('#mask').hide();
            $('#mask .tips-1').removeClass('slideInDown').hide();
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

    maskView();

    $('#btn').on('tap',function(){
        if(isApp){
            callShare({
                url: CONF.shareUrl,
                content: CONF.shareContent,
                title: CONF.shareTitle,
                subTitle: CONF.shareSubTitle,
                image: CONF.shareImgUrl
            }).then(ret => {
                // {success: true}
            })   
        }else{
            window.location.href = 'http://dl.ddyc.com/';
        }
                    
    });


    if(window.CONF.viewCounts>=2){
        doneView();
    }else{
        $('#viewText span').text(window.CONF.viewCounts);
    }
    
    $('#btn').parallax();
    $('#activeText').parallax();


    
});


const Common = require('@util/common-page');
const createFullpageAnimate = require('@ui/fullpage-animate');
const util = require('./module/util');
// const callShare = require('@util/native-bridge/lib/callShare');
// const ready = require('@util/native-bridge/lib/ready');

$(function(){

    var defaultOption = {
        container : '.page-inner',
        animationTime : 1000,
        loop      : false,
        beforeMove: function (index, count, $pages) {
            beforeMoveHandler(index, count, $pages)
        },
        afterMove : function (index, count, $pages) {
            afterMoveHandler(index, count, $pages)
        }
    }

    var fullpageAnimate = createFullpageAnimate(defaultOption);
    const comon = Common.create(window.CONF);
    comon.share()
    function sliderPage(direction){
        $('.adv').css({
            '-webkit-transition' : '1000ms',
            'transition' : '1000ms',
            top: direction*10.16+'rem'
        })
    }

    function beforeMoveHandler(index, count, $pages){
        if(index == 3){
            $('.arrow').removeClass('unvisiable');
        }
    }

    function afterMoveHandler(index, count, $pages){
        if(index == 3){
            $('.arrow').addClass('unvisiable');
        }

        if(index == 1){
            $('#page2').find('.mask_top').addClass('animate_top');
            $('#page2').find('.mask_bottom').addClass('animate_b');
        }else{
            $('#page2').find('.mask_top').removeClass('animate_top');
            $('#page2').find('.mask_bottom').removeClass('animate_b');
        }
        
        // if(index == 2){
        //     $('#page3').find('.mask_top').addClass('animate_top');
        //     $('#page3').find('.mask_bottom').addClass('animate_b');
        // }else{
        //     $('#page3').find('.mask_top').removeClass('animate_top');
        //     $('#page3').find('.mask_bottom').removeClass('animate_b');
        // }
    }


    function bindEvent(){

        util.touchMove('section.move',function(obj){
            let target = $(obj.target);
            if(obj.tapObj.direction === 'up'){
                if(target.hasClass('one') || target.parent().hasClass('one')){
                    sliderPage(-1);
                }else if(target.hasClass('two') || target.parent().hasClass('two')){
                    sliderPage(-2);
                }else{
                    fullpageAnimate.next();
                }
            }

            if(obj.tapObj.direction === 'down'){
                if(target.hasClass('three') || target.parent().hasClass('three')){
                    sliderPage(-1);
                }else if(target.hasClass('two') || target.parent().hasClass('two')){
                    sliderPage(0);
                }else{
                    fullpageAnimate.prev();
                }
                
            }
        })

    }

    // ready( info => {
    //     callShare({
    //         url: window.CONF.shareUrl,
    //         title: window.CONF.shareTitle,
    //         subTitle: window.CONF.shareSubTitle,
    //         image: window.CONF.shareImgUrl,
    //         content: window.CONF.shareContent
    //     });
    // })
    

    bindEvent();
})
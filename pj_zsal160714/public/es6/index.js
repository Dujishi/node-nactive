const createFullpageAnimate = require('@ui/fullpage-animate');
const common = require('./module/common');
/**
 * 适配各种机型
 */
;(function(doc,win){
    let docEl = doc.documentElement;    
    let resizeEvt = 'orientation change' in window ? 'orientation change' : 'resize';
    
    function recalc() {
        let clientWidth = docEl.clientWidth;
        let clientHeight= docEl.clientHeight;
        let fontSize = 100 * clientWidth / 750; 
        if (clientWidth==320 && clientHeight<=420) {
            // iphone 4
            $('section').css({
                'box-sizing':'border-box',
                'padding': '0 25px' 
            });
            $('.page1-text2').css({
                left: '1.3rem'
            })
            fontSize = 35;
        };
        if (clientWidth>=360 && clientHeight/clientWidth<1.6) {
            // 大屏幕android
            $('section').css({
                'box-sizing': 'border-box',
                'padding'   : '0 15px'
            });
            $('.page1-text2').css({
                'left' : '0.9rem'
            })
        
            fontSize -= 5;
        }
        
        docEl.style.fontSize =  fontSize + 'px';
    }

    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document,window);

$(function () {
    let $nextPage = $('.next-page');
    
    let fullpageAnimate = createFullpageAnimate({
        afterMove : function (index, count) {
            if(index >= count -1){
                $nextPage.hide();
            }else{
                $nextPage.show();
            }
        }
    });


    $nextPage.on('tap',function () {
        fullpageAnimate.next();
    })

    $('body').on('swipeUp', function () {
        fullpageAnimate.next();
    }).on('swipeDown', function () {
        fullpageAnimate.prev();
    });


    common.init(window.CONF).share();
})


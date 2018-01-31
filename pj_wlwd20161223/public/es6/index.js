const createFullpageAnimate = require('@ui/fullpage-animate');
const Fixtip = require('@ui/fixtip');
const common = require('./module/common')();
const loading = require('@ui/loading/wloading');
require('@ui/preload/src/loader');

let arr = {};
let fullpageAnimate = null;

const sub = {
    '1': 'B',
    '2': 'A',
    '3': 'C',
    '4': 'C',
    '5': 'B',
    '6': 'C',
    '7': 'B',
    '8': 'C',
};
const Arr = [
    {
        'Content': 4,
        'subTiltle': 5,
        'detail1': '在污的路上',
        'detail2': '你还能走的更远~~',
    },{
        'Content': 13,
        'subTiltle': 11,
        'detail1': '在污的路上',
        'detail2': '你还能走的更远~~',
    },{
        'Content': 25,
        'subTiltle': 16,
        'detail1': '在污的路上',
        'detail2': '你还能走的更远~~',
    },{
        'Content': 39,
        'subTiltle': 24,
        'detail1': '不及格呢',
        'detail2': '看来平常学习不努力~',
    },{
        'Content': 55,
        'subTiltle': 48,
        'detail1': '不及格呢',
        'detail2': '看来平常学习不努力~',
    },{
        'Content': 59,
        'subTiltle': 55,
        'detail1': '不及格呢',
        'detail2': '看来平常学习不努力~',
    },{
        'Content': 74,
        'subTiltle': 78,
        'detail1': '你与污力大神之间',
        'detail2': '只差再测一次！',
    },{
        'Content': 88,
        'subTiltle': 89,
        'detail1': '你与污力大神之间',
        'detail2': '只差再测一次！',
    },{
        'Content': 100,
        'subTiltle': 99,
        'detail1': '原来你就是传说中的污力大神！',
        'detail2': '我等膜拜！',
    }
];
/*
*适配机型
*/ 
;(function(doc,win){
    let docEl = doc.documentElement;    
    let resizeEvt = 'orientation change' in window ? 'orientation change' : 'resize';
    
    function recalc() {
        let clientWidth = docEl.clientWidth;
        let clientHeight= docEl.clientHeight;
        $('section').css({
            'height': clientHeight,
            'box-sizing':'border-box',
        });
        let fontSize = 100 * clientWidth / 750; 
        if (clientWidth==320 && clientHeight<=420) {
            // iphone 4
            $('section').css({
                'padding-left': '25px',
                'padding-right': '25px', 
            });
            $('.page1-text2').css({
                left: '1.3rem'
            })
            fontSize = 35;
        };
        if (clientWidth>=360 && clientHeight/clientWidth<1.6) {
            // 大屏幕android
            $('section').css({
                'padding-left': '15px',
                'padding-right': '15px', 
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


function bindEvent () {
    // 控制歌曲播放
    $('.header').on('tap', function () {
        if ($(this).hasClass('on')){
            $('audio')[0].pause();
            $('.header').removeClass('on').addClass('off');
        } else {
            $('audio')[0].play();
            $('.header').removeClass('off').addClass('on');
        }
    });
    // loading
    // $('.page1-text').animate(
    //     {
    //         "width": '4.2rem',
    //     },
    //     3000, 'linear',
    //     () => {
    //         fullpageAnimate.next();
    //     }
    // );
    // page2
    $('.page2-bottom').on('tap', () => {
        fullpageAnimate.next();
    });
    // 题目点击切换
    $('.page-text').on('tap', 'li' ,function () {
        const index = $(this).closest('section').attr('name');
        if ($(this).closest('.page-text').find('img').length > 0) {
            return false;
        }
        $(this).siblings('li').find('img').remove('img');
        $(this).append(`<img src='/pj_wlwd20161223/public/images/tap.png'>`);
        if ($(this).hasClass('page-textA')){
            arr[index] = 'A';
        } else if ($(this).hasClass('page-textB')) {
            arr[index] = "B";
        } else if ($(this).hasClass('page-textC')) {
            arr[index] = "C";
        }
        // console.log(arr);
        if ($(this).closest('section').hasClass('page10')) {
            sum();

            let config = window.CONF;
            config = {
                shareTitle: '平生不识苍老师，有钱有颜也枉然',
                shareContent: '我的污力指数' + $('.page11-text>div span').html(),
                shareSubTitle: '我的污力指数' + $('.page11-text>div span').html(),
            };
            common.share(config);
        }
        setTimeout(() => {
            fullpageAnimate.next();
        },300);
    });

    $('.page-bottom').on('tap',function () {
         $(this).closest('section').find('.share').css('display','block');
    });

    $('.page11-bottom').on('tap',function(){
        $('.phone').css('display','block');
        $('.phone-bg').css('display','block');
    });

   $('.page11 .page11-share').on('tap',function(){
       $(this).closest('section').find('.share').css('display','block');
   });

   $('.back').on('tap',function(){
       $('.phone').css('display','none'); 
   });

    $('.phone-btn').on('tap',function(){
        const $phone = $('.phone-bg input').val();
        const phonePattern = /^1\d{10}$/;
		if(!$phone || !phonePattern.test($phone)){
            new Fixtip({
                msg: '手机号输入错误'
            });
            return false;
        }
        console.log('aa');
        loading.show();
        $.post('/nactive/wlwd20161223/index', {
            phone: $phone,
        }, function (res) {
            loading.hide();
            $('.phone').css('display','none');
            $('.phone-bg').css('display','none');
            $('.redbag').css('display','block');
            if(res.success == true){
                if (res.had == "true" && res.isNew == true){
                    $('.bag').css('display','block');
                    $('.redbag .luck').css('display','inline-block');
                    $('.bottom-text span').html($phone);
                } else if (res.had == "true" && res.isNew == false) {
                    $('.bag').css('display','block');
                    $('.redbag .no').css('display','inline-block');
                    $('.bottom-text span').html($phone);
                } else if (res.had == "false") {
                    $('.unbag').css('display','block');
                } else if (res.had == "err"){
                    $('.redbag').css('display','none');
                    new Fixtip({
                        msg: res.message || "操作失败",
                    });
                }
            } else {
                new Fixtip({
                    msg: '操作失败！'
                })
            }
        });
    });

   $('.share').on('tap',function(){
       $(this).css('display','none');
   });

   $('.redbag').on('tap', function(){
        $(this).css('display','none');
   });

   $('.redbag_btn').on('tap', function(){
       window.location.href='http://dl.ddyc.com';
   });

   $('.reset').on('tap',function (e) {
        if($(this).hasClass('disabled')){
            return ;
        }
        $(this).addClass('disabled');
        
        $('.page-text li').find('img').remove('img');
        $('.page-inner').removeClass('anim');
        fullpageAnimate.go(1);
        window.setTimeout(function(){
            $('.page-inner').addClass('anim');
        },500);
        $(this).removeClass('disabled');
        e.preventDefault();

        //window.location.reload(true);
        //window.location.href = window.location.href + "#" + (new Date()).getTime()
   });
}

function sum () {
    console.log(arr);
    console.log(sub);
    let T = 0;
    let F = 0;
    for (let key in arr) {
        if (arr[key] == sub[key]) {
            T++;
        } else {
            F++;
        }
    }
    console.log(T);
    console.log(F);
    console.log(Arr[T]);
    $('.page11-text>div span').html(Arr[T].Content);
    $('.page11-text>p span').html(Arr[T].subTiltle);
    $('.page11-detail').html(Arr[T].detail1+'<br/><span>'+Arr[T].detail2+'</span>');
}

function initPage() {
    // 切换动画
    const $nextPage = $('.next-page');
    let countFlag = 0;
    fullpageAnimate = createFullpageAnimate({
        afterMove: (index, count) => {
            if (index >= count - 2) {
                $nextPage.hide();
            } else {
                $nextPage.show();
            }
            countFlag = index;
        }
    });
}

let precent = 0;
let proHandler = null;
function progress() {
    if (precent <= 4.2) {
        $('.page1-text').css({ display: 'block', width: `${precent}rem` });
        precent += 0.2;
        proHandler = setTimeout(progress, 80);
    } else {
        clearTimeout(proHandler);
    }
}

function loadingRes() {
    const defaults = {
        loadType: 0,
        minTime: 0,
        onLoading: (count, total) => {
            if (count === 1) {
                progress();
            } else if (count === total) {
                
            }
        },
        onComplete: () => {
            $('.page-inner').append($('#pages').html());
            bindEvent();
            initPage();
            const checkHandler = setInterval(function(){
                if(precent >= 4.2){
                    clearInterval(checkHandler);
                    fullpageAnimate.next();
                }
            }, 800);
        }
    };
    new mo.Loader(window.imagesRes, defaults);
}

$(() => {
    common.share();
    loadingRes();
});


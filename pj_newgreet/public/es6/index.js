const CONF = window.CONF;
const Common = require('@util/common-page');
const Fixtip = require('@ui/fixtip');
const queryString = require('@util/string-util/query-string');
const queryParams = queryString.parse(window.location.search);
const channelId = queryParams.channelId;
let timer;

$(() => {
    const common = Common.create();
    const analytics = Common.analytics;
    common.share((type) => {
    });

    const $phoneText = $('#phoneText');
    const $codeText = $('#codeText');
    const $codeTips = $('#codeTips');
    const $getCode = $('#getCode');
    const $tips = $('.tips');
    const $tips1 = $('.tips-1');
    const $tips2 = $('.tips-2');
    const $peopleImg = $tips2.find('.tips-people img');

    function showAlreadyGet(){
        $peopleImg.attr('src',$peopleImg.data('img1'));
        $tips2.find('.tips-subtitle').text('您已参与该活动！');
        $tips2.on('touchstart',(e)=>{
            e.preventDefault();
        });
        $tips2.show();
    }
    function showNoGet(){
        $peopleImg.attr('src',$peopleImg.data('img2'));
        $tips2.find('.tips-subtitle').text('您不符合领取的条件哦~');
        $tips2.on('touchstart',(e)=>{
            e.preventDefault();
        });
        $tips2.show();
    }
    function showSuccessGet(phone) {
        $('#tipsPhone').text(phone);
        $tips1.show();
    }
    function resetCode() {
        $getCode.show();
        $codeTips.hide();
        $codeTips.find('span').text(60);
        clearInterval(timer);
    }
    function showCodeTips() {
        $getCode.hide();
        $codeTips.show();
        let sec = 59;
        timer = setInterval(()=>{
            if(sec>0){
                $codeTips.find('span').text(sec--);
            }else{
                resetCode();
            }
        },1000);
    }

    $('.tips-close').on('tap',()=>{
        $tips.hide();
        resetCode();
    });

    $('.share-wx').on('tap',()=>{
        $('.share-mask').show().on({'tap': function () {
            $(this).hide();
        },'touchstart':function(e){
            e.preventDefault();
        }});
    });

    $('#getCode').on('touchend',()=>{
        if($phoneText.val()==''){
            new Fixtip({msg:'请输入手机号码'});
            return ;
        }
        if(!/1[034578]\d{9}/.test($phoneText.val())){
            new Fixtip({msg:'您输入的手机号码不正确'});
            return ;
        }
        $.post('code',{ phone: $phoneText.val(),channelId },(res)=>{
            if(res.success){
                showCodeTips();
            }else{
                if(res.packetCode==1){
                    showNoGet();
                    return ;
                }
                new Fixtip({ msg:res.message || res.msg });
            }
        })
    });

    $('#getBtn').on('touchend',()=>{
        if($phoneText.val()==''){
            new Fixtip({msg:'请输入手机号码'});
            return ;
        }
        if($codeText.val()==''){
            new Fixtip({msg:'请先获取验证码'});
            return ;
        }
        $.post('check',{ phone: $phoneText.val(), code:$codeText.val(),channelId },(res)=>{
            if(res.success){
                $.post('packet','',(res)=>{
                    if(res.success){
                        showSuccessGet($phoneText.val());
                        analytics.event('newgreet_user', {phone:$phoneText.val(),channelId});
                    }else{
                        if( res.errCode== 'REPEAT_CODE' ){
                            showAlreadyGet();
                            return ;
                        }
                        new Fixtip({msg:res.message||res.msg||'VIP特权领取失败，请重试！'});
                    }
                })
            }else{
                new Fixtip({msg:res.message||res.msg||'验证码不正确，请重试！'});
            }
        });
    });
});
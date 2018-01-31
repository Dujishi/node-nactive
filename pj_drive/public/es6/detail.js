const getCommon = require('./module/common');
const ready     = require('@util/native-bridge/lib/ready');
const utils     = require('./module/utils');
const goToPage     = require('@util/native-bridge/lib/goToPage');

const proxyUrl  = CONF.uriProxy;
let insureUrl   = CONF.uriInsure;

class WinMask{
    constructor(selector){
        this.$small = $(selector);
        this.$mask  = $('.winmask');
        this.bindEvent();
    }
    bindEvent(){
        let me = this;
        this.$small.on('tap', () => {
            me.show();
        });
        this.$mask.on('tap', function (e) {
            if ( $(e.target).hasClass('winmask-box') ) {
                me.hide();
            }
        });
    }
    show(){
        this.$mask.removeClass('hide');
    }
    hide(){
        this.$mask.addClass('hide');
    }
}

function main (data) {
    $('#active-time').html(data.time);
    $('#active-members').html(data.member + '人');
    $('#active-leaderwx').html(data.leader);
    $('#active-wxgroup').attr('src', data.wxq);
    $('#active-callnum').html(data.customer).attr('href', 'tel:'+data.customer);
    $('#active-mask-code').attr('src', data.wxq);
    if (data.content) {
        $('#remark').html(data.content);
    }
    $('.page-desc').html(data.desc);

    insureUrl = insureUrl +'?member=' + data.member;

    switch(data.instatus){ // 保险状态
        case 0: // 可领
            break;
        case 1: // 已领
            $('.footer-btn').addClass('gray').html('已申请领取');
            $('.footer-text').html('您已提交投保信息，祝您出行愉快！ <span class="cl-18f">查看保险详情 ></span>');
            break;
        case 2: // 已过期
            $('.footer-btn').addClass('gray').html('免费领取已结束');
            break;
    }
}

function openUrl(url) {
    if (CONF.isapp) {
        goToPage({
            type: 1,
            url : url
        });
    }else{
        window.location.href = url;
    }
}

getCommon().share();

if (CONF.isapp) {
    ready( info => {
        $.ajax({
            url : proxyUrl + '?k=detail',
            type: 'POST',
            data : {
                type : 'app',
                uuid : info.userId
            }
        }).then( ret => {
            if (utils.isOk(ret)) {
                main(ret.data);
            }  
        });
        _ax.push(['set', 'openid', info.userId]);
        _ax.push(['send']);
    });
}else{
    $.post(proxyUrl+'?k=detail',{
        type: 'wechat',
        uuid: CONF.openid
    }).then( ret => {
        if (utils.isOk(ret)) {
            main(ret.data);
            new WinMask('#active-wxgroup');
        }
    });
}

$(() => {
    $('.container').removeClass('hide');
    new WinMask('#active-wxgroup');

    $('.footer-btn').on('tap', function() {
        let that = $(this);
        if (that.hasClass('gray')) { return ;}
        window.location.href = insureUrl;
    });

    $('.footer-text').on('tap', function() {
        let that = $(this);
        openUrl(that.data('url'));
    });
});

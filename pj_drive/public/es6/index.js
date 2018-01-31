const ready        = require('@util/native-bridge/lib/ready');
const login        = require('@util/native-bridge/lib/login');
const isLogin      = require('@util/native-bridge/lib/isLogin');
const goToPage     = require('@util/native-bridge/lib/goToPage');
const map          = require('@ui/map');
const Fixtip       = require('@ui/fixtip');
const loading      = require('@ui/loading/wloading');
const fixedSticky  = require('@ui/fixed-sticky');
const getCommon    = require('./module/common');
const utils        = require('./module/utils');
const getWinPhone  = require('./module/win_phone');
const Tween        = require('./module/tween');

const proxyUrl  = CONF.uriProxy;
const detailUrl = CONF.uriDetail;
const signupUrl = CONF.uriSignup;

let clientCommon ;
let client ;
let common ;  // 微信分享相关

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

class ClientCommon{
    constructor(){

        this.state = CONF.state;
        this.$btnDo = $('#btn-do');
        this.initTime();
        this.bindMapEvent();
        this.bindEvent();
    }
    initTime(){
        // 活动未开始
        // 活动已结束
        // 活动已开始 && 人数已满
        // 活动已开始 && 人数没满
        
        if (this.state == 1) {
            $('footer').addClass('hide');
            return ;
        }
        if (this.state == 2) { // 活动已结束
            if (CONF.residue > 0) { // 未保满
                $('.footer-text').html('报名已结束');
            }
            this.changeBtnState('next');
            return ;
        }
        if (CONF.residue <= 0) {
            this.changeBtnState('next');
        }else{
            this.changeBtnState('signup');
        }
    }
    initState(code){
        switch (code){
            case 1: // 未报名
                if (CONF.state == 2) { // 活动已结束
                    this.changeBtnState('next');
                }else{
                    if (CONF.residue <= 0) {
                        this.changeBtnState('next');
                    }else{
                        this.changeBtnState('signup');
                    }
                }
                break;
            case 2 : // 已报名, 已支付
                this.changeBtnState('signup-do');
                break;
            case 3 : // 已预约
                if (CONF.residue <= 0) { //没有名额
                    this.changeBtnState('next-do');
                }else{
                    this.changeBtnState('signup');
                }
                break;
            case 4 : // 已报名，未支付
                this.changeBtnState('signup');
                break; 
        }
    }
    changeBtnState(state){
        let $btn = this.$btnDo;
        $btn.data('state', state);
        switch(state){
            case 'end': // 活动已结束
                $btn.html('已结束').removeClass('orange blue').addClass('gray');
                break;
            case 'next': // 人数已满，还没有申请下一次
                $btn.html('下回告诉我').removeClass('gray blue').addClass('orange');
                break;
            case 'next-do': // 人数已满，已申请下一次
                $btn.html('下回告诉我').removeClass('orange blue').addClass('gray');
                break;
            case 'signup' : // 人数未满，没有报名
                $btn.html('立即报名').removeClass('gray blue').addClass('orange');
                break;
            case 'signup-do': // 报名成功
                $('.win-info-btn').removeClass('hide');
                $btn.html('拉好友一起').removeClass('orange gray').addClass('blue');
                break;
        }
    }

    bindMapEvent(){
        // 查看地图
        let $dialog = $('.dialog-map');
        $('#open-map').on('tap', function () {
            let that = $(this);
            let lat  = that.data('lat');
            let lng  = that.data('lng');
            let label = that.data('label');
            let mapUrl = map.setLabelUrl( lng+','+lat , label);
            $dialog.removeClass('hide');
            $('iframe').attr('src', mapUrl);
            $('body').scrollTop(1);
        });
        $('.map-close').on('tap', function () {
            $dialog.addClass('hide');
            common.share();
        });
    }

    bindEvent(){
        // 打开详情页
        $('.win-info-btn').on('tap', () => {
            client.goToDetail();
        });

        let $share = $('.dialog-share');
        $share.on('tap', () => {
            $share.addClass('hide');
        });

        let me = this;
        this.$btnDo.on('tap', function () {
            let that = $(this);
            let state = that.data('state');
            switch(state){
                case 'signup-do':
                    $share.removeClass('hide');
                    return ;
                case 'next':
                    client.postSubscribe();
                    return ;
                case 'signup':
                    client.postSignup();
                    return ;
            }
        });

        // 往期回顾
        $('.history').on('tap', function() {
            let url = $(this).data('url');
            openUrl(url)
        })
    }
}


class ClientWechat{
    constructor(){
        this.winPhone = getWinPhone();
        this.postState();
    }
    postState(){
        $.ajax({
            url : proxyUrl + '?k=state',
            data: {
                type : 'wechat',
                uuid : CONF.openid
            },
            type: 'POST',
            dataType : 'json'
        }).then( ret => {
            if (utils.isOk(ret)) {
                let data = ret.data;
                clientCommon.initState(data.status);
                if (data.show == '1') {
                    $('.dialog-share').removeClass('hide');
                }
            }
        });
    }
    inputPhoneCallback(fn){ 
        this.winPhone.onOk( (phone) => {
            this.phone = phone;
            fn();
        });
        this.winPhone.show();
    }
    postSubscribe(){
        if (!this.phone) {
            this.inputPhoneCallback(() => {
                this.postSubscribe();
            });
            return ;
        }
        $.ajax({
            url : proxyUrl + '?k=subscribe',
            data: {
                type   : 'wechat',
                uuid   : CONF.openid,
                phone  : this.phone
            },
            type : 'POST',
            dataType : 'json'
        }).then( ret => {
            if (utils.isOk(ret)) {
                clientCommon.changeBtnState('next-do');
                new Fixtip({msg: ret.msg || ret.message });
            }
        });
    }
    postSignup(){
        window.location.href = signupUrl;
    }
    goToDetail(){
        window.location.href = detailUrl;
    }
}

class ClientApp{
    constructor(){
    }
    init(info){
        if (info) {
            this.isLogin = true;
            this.userId  = info.userId;
            this.phone   = info.phone;
            return this.postState();
        }else{
            this.isLogin = false;
            return Promise.resolve(false);
        }
    }
    loginCallback(){
        login().then( info => {
            if (info) {
                _ax.push(['openid', info.userId]);
                _ax.push(['send']);
                this.init(info).then(function(state) {
                    if (state) {
                        clientCommon.$btnDo.trigger('tap');
                    }
                });
            }
        });
    }
    postState(){
        if (!this.isLogin) {
            this.loginCallback();
            return ;
        }
        return $.ajax({
            url : proxyUrl+'?k=state',
            data: {
                type : 'app',
                uuid : this.userId
            },
            type: 'POST',
            dataType: 'json'
        }).then( (ret) => {
            if (utils.isOk(ret)) {
                let data = ret.data;
                clientCommon.initState(data.status);
                if (data.show == '1') {
                    $('.dialog-share').removeClass('hide');
                }
                return true;
            }
            return false;
        });  
    }
    postSubscribe(){
        if (!this.isLogin) {
            this.loginCallback();
            return;
        }
        $.ajax({
            url : proxyUrl+'?k=subscribe',
            data: {
                type : 'app',
                uuid : this.userId,
                phone  : this.phone
            },
            type: 'POST',
            dataType: 'json'
        }).then( ret => {
            if (utils.isOk(ret)) {
                clientCommon.changeBtnState('next-do');
                new Fixtip({msg: ret.msg || ret.message });
            }
        });
    }
    postSignup(){
        if (!this.isLogin) {
            this.loginCallback();
            return;
        }
        goToPage({
            type: 1,
            url : signupUrl
        });
    }
    goToDetail(){
        goToPage({
            type : 1,
            url  : detailUrl
        });
    }
}

class TabMgr{
    constructor(){
        fixedSticky.init('.tabs-content');

        this.$item = $('.tabs-content li');
        this.$body = $('body');
        this.$tag = $('[data-id]');

        this.stopScrollEvent = false;

        this.bindTapEvent();
        this.bindScrollEvent();
    }
    bindScrollEvent(){
        let $body = this.$body;
        let $tag  = this.$tag;
        let $item = this.$item;
        // fix 最后一项内容过短，导致无法自动聚焦的Bug
        let $lastContent = $('.last-content');
        let minHeight = document.body.clientHeight - $('footer').height() - this.$item.height();
        $lastContent.css({
            'min-height' : minHeight
        });

        $(window).on('scroll', () => {
            // 页面滚动时，秒点自动切换焦点
            if (this.stopScrollEvent) { return ; }
            let scrollTop = $body.scrollTop();
            let id = $tag.eq(0).data('id');
            $tag.each(function() {
                let that = $(this);
                let elTop = that.offset().top;
                if (elTop - 65 < scrollTop) {
                    id = that.data('id');
                }
            });
            $item.removeClass('focus');
            $item.filter('[data-tag="'+id+'"]').addClass('focus');
        });
    }
    bindTapEvent(){
        let $body = this.$body;
        let $tag  = this.$tag;
        let $item = this.$item;
        let itemHeight = $item.height() ;
        let me = this;
        $item.on('tap', function() { // 锚点
            let that = $(this);
            $item.removeClass('focus');
            that.addClass('focus');
            let idx = that.index();
            let tagId = that.data('tag');
            let $tagDom = $tag.filter('[data-id="'+tagId+'"]');
            if ($tagDom.length) {
                let offset = $tagDom.offset();
                me.stopScrollEvent = true;
                let aimTop = offset.top - itemHeight - 30;
                if (idx===0) {aimTop = offset.top - 30;}
                new Tween().from({
                    top : $body.scrollTop()
                }).to({
                    top : aimTop
                }).on('update',function(v) {
                    $body.scrollTop(v.top);
                }).on('complate',function() {
                    me.stopScrollEvent = false;
                }).start();
            }
        });
    }
}
/**
 * 初始化
 */
common = getCommon().share();
setTimeout(function() {
    utils.lazyload(); // 加载图片, 
}, 50);

clientCommon = new ClientCommon();

if (CONF.isapp) {
    ready( info => {
        client = new ClientApp();
        if (isLogin()) {
            client.init(info);
            _ax.push(['openid', info.userId]);
            _ax.push(['send']);
        }
    });
}else{
    client = new ClientWechat();
}


$(function () {
    $('.container').removeClass('hide');
    $('.header-offer').on('tap', function() {
        let url = $(this).data('link');
        openUrl(url);
    });
    new TabMgr();
});



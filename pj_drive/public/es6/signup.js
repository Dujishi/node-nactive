const ready        = require('@util/native-bridge/lib/ready');
const isLogin      = require('@util/native-bridge/lib/isLogin');
const payment      = require('@util/native-bridge/lib/payment');
const utils        = require('./module/utils');
const Validation   = require('./module/validation');
const Fixtip       = require('@ui/fixtip');
const getCommon    = require('./module/common');
const loading      = require('@ui/loading/wloading');
const modal        = require('@ui/modal');

let client ;
let formMgr ;
let common ;  // 微信分享相关

const proxyUrl   = CONF.uriProxy;
const indexUrl   = CONF.uriIndex;
// <script src="/node_modules/alloylever/dist/alloy_lever.min.js"></script>
let payUrl = CONF.payUrl;

class FormManager {
    constructor (o) {
        this.$valids   = $('[data-validtype]');
        this.$nickname = $('#nickname');
        this.$phone    = $('#phone');
        this.$wxid     = $('#wxid');
        this.$phone1   = $('#phone1');
        this.$content  = $('#remark');
        this.$nums     = $('.win-num');
        this.$radio    = $('.win-radio');
        
        this.type      = o.type;
        this.uuid      = o.uuid;
        this.lat       = o.lat;
        this.lng       = o.lng;

        this.validation = new Validation(this.$valids);

        this.bindEvent();
        this.$phone.val(o.phone);
        this.setMaxCount(CONF.residue); // 设置最大可选人数
    }
    getData () {   
        let obj = {
            type      : this.type,
            member    : this.getMember(),
            uuid      : this.uuid,
            lat       : this.lat,
            lng       : this.lng
        };
        let cityName  = this.getCity();
        if (cityName) {
            obj.city = cityName;
        }
        let inputData = this.getInputData();
        return $.extend(obj, inputData);
    }
    setCacheData(data){
        this.$nickname.val(data.nickname || '');
        if (data.phone) {
            this.$phone.val(data.phone || '');
        }
        
        this.$wxid.val(data.wxid || '');
        this.$phone1.val(data.phone1 || '');
        this.$content.val(data.content || ''); // 备注信息
        if (data.member) {
            this.$nums.eq(data.member-1).trigger('tap');
        }
        if (data.city) {
            this.setCity(data.city);
        }
        this.setMaxCount(data.residue);
        
        return this;
    }
    setMaxCount(residue){
        let enable = residue > 4 ? 4 : residue;  // 从1开始计数
        this.$nums.each(function (i) {
            if(i >= enable){
                $(this).addClass('disable');
            }
        });
        // 默认同游人数 ： 2
        if (enable > 1) {
            this.$nums.eq(1).trigger('tap');
        }else if(enable == 1){
            this.$nums.eq(0).trigger('tap');
        }
    }
    getInputData(){
        let ret = {};
        this.$valids.each(function () {
            let that = $(this);
            let key = that.attr('name');
            let value = that.val().trim();
            ret[key] = value;
        });
        return ret;
    }
    getMember(){
        let $num = this.$nums.filter('.selected');
        return $num.html();
    }
    setCity(city){
        if (!this.$radio.length) {return ;}
        this.$radio.each(function() {
            let that = $(this);
            if (that.find('span').html() == city) {
                that.addClass('choose');
            }
        });
    }
    getCity(){
        if (!this.$radio.length) { return ''; }
        let $radio = this.$radio.filter('.choose');
        return $radio.find('span').html();
    }
    disablePhone(){
        this.$phone.attr('disabled','disabled');
    }
    bindEvent () {
        let me = this;
        let $valids = this.$valids; // 需要输入校验的元素
        let $nums   = this.$nums;    // 人数选择
        let $radio  = this.$radio;  // 城市选择
        let $modal  = $('.modal-tips'); // 服务协议弹框
        
        $valids.on('keydown',function() {
            $(this).removeClass('error');
        });
        
        $nums.on('tap' ,function () {
            let that = $(this);
            if (!that.hasClass('disable')) {
                me.$nums.removeClass('selected');
                that.addClass('selected');
                let count = Number(that.html());
                let totalPrice = (count * CONF.price).toFixed(1);
                $('#total-price').html(totalPrice);
            }
        });

        if ($radio.length) {
            $radio.on('tap', function () {
                let that = $(this);
                if (!that.hasClass('choose')) {
                    $radio.removeClass('choose');
                    that.addClass('choose');
                }
            });
            // 默认选中第1个城市
            $radio.eq(0).trigger('tap'); 
        }
        
        $('.agree-text').on('tap', function () {
            $modal.removeClass('hide');
        });
        $modal.on('tap', function (e) {
            if ($(e.target).hasClass('modal-tips-box')) {
                $modal.addClass('hide');
            }
        });
        $modal.find('.modal-close-btn').on('tap', function () {
            $modal.addClass('hide');
        });
        

        // fix iOS 软键盘BUG
        // let $footer = $('.footer-content');
        // if ($.os.ios) {
        //     this.$valids.on('focus', function () {
        //         $footer.css('position', 'relative');
        //     }).on('blur', function () {
        //         $footer.css('position', 'fixed');
        //     })
        // }
    }
}

class ClientApp{
    constructor(){
        ready( info => {
            if (!isLogin()) {
                return ;
            }         
            formMgr = new FormManager({
                type   : 'app',
                uuid   : info.userId,
                lat    : info.lat,
                lng    : info.lng,
                phone  : info.phone
            });
            formMgr.disablePhone();
            this.postCache(info.userId);

            _ax.push(['set', 'openid', info.userId]);
            _ax.push(['send']);
        });
    }
    postCache(userId){
        $.post(proxyUrl+'?k=cache' , {
            type : 'app',
            uuid : userId
        }).then( ret => {
            if (ret.success) {
                formMgr.setCacheData(ret.data);
            }
        });
    }
    postSignup(){
        let err = formMgr.validation.getErr();
        if (err) {
            new Fixtip({ msg : err});
            return ;
        }

        modal.confirm({
            msg : "付款成功后1个工作日内工作人员将与您联系",
            ok  : () => {
                loading.show();
                $.ajax({
                    url: proxyUrl + '?k=signup',
                    data : formMgr.getData(),
                    type : 'POST',
                    dataType : 'json'
                }).then((ret) => {
                    if (utils.isOk(ret)) {
                        //new Fixtip({ msg : ret.msg || ret.message });
                        payment({
                            orderId : ret.orderId
                        });
                        window.location.href = indexUrl;
                    }
                    loading.hide();
                },function () {
                    new Fixtip({ msg: '网络错误'});
                    loading.hide();
                });
            }
        });
    }
}

class WechatApp{
    constructor(){
        common.getLocation( (lat,lng) => {
            formMgr = new FormManager({
                type   : 'wechat',
                uuid   : CONF.openid,
                lat    : lat,
                lng    : lng,
                phone  : ''
            });
            this.postCache(CONF.openid);
        });
    }
    postCache(openid){
        $.post(proxyUrl+'?k=cache' , {
            type : 'wechat',
            uuid : openid
        }).then( ret => {
            if (ret.success) {
                formMgr.setCacheData(ret.data);
            }
        });
    }
    postSignup(){
        let err = formMgr.validation.getErr();
        if (err) {
            new Fixtip({ msg : err});
            return ;
        }
        modal.confirm({
            msg : "付款成功后1个工作日内工作人员将与您联系",
            ok  : () => {
                loading.show();
                $.ajax({
                    url : proxyUrl+'?k=signup',
                    type: 'POST',
                    data: formMgr.getData(),
                    dataType : 'json'
                }).then((ret) => {
                    if (utils.isOk(ret)) {
                        //new Fixtip({ msg : ret.msg || ret.message });
                        window.location.href = utils.urlAppend(payUrl,{
                            orderId : ret.orderId,
                            userId  : ret.userId,
                            source  : 'WAP',
                            callback: indexUrl
                        });
                    }
                    loading.hide();
                },function () {
                    new Fixtip({ msg: '网络错误'});
                    loading.hide();
                });
            }
         });
    }
}



common = getCommon().share();

if (CONF.isapp) {
    client = new ClientApp();
}else{
    client = new WechatApp();
}


$(function () {
    $('.container').removeClass('hide');

    // 去支付
    let $payment = $('#goto-payment');

    $('.agree-btn').on('tap', function() {
        let $icon = $(this).find('i');
        if ($icon.hasClass('icon-choose')) {
            $icon[0].className = 'icon-unchoose';
            $payment.addClass('disable');
        }else{
            $icon[0].className = 'icon-choose';
            $payment.removeClass('disable');
        }
    });
 
    $payment.on('tap', function() {
        if (!$payment.hasClass('disable')) {
            client.postSignup();
        }else{
            new Fixtip({msg : '请阅读并同意《服务协议》'});
        }
    });
});
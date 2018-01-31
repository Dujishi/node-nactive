const nativeBridgeReady = require('@util/native-bridge/lib/ready');
const nativeBridgeShare = require('@util/native-bridge/lib/share');

function isWechat() {
    return typeof wx != 'undefined';
}
function shareApp(conf) {
    nativeBridgeReady(function () {
        nativeBridgeShare({
            url     : conf.shareUrl || 'https://m.ddyc.com/feopen/vip/index',
            content : conf.shareContent || '加入典典VIP，一年可省1230元',
            title   :conf.shareTitle || '典典VIP，处处都省钱',
            subTitle: conf.shareContent || '加入典典VIP，一年可省1230元' ,
            image   : conf.shareImgUrl || 'http://store.ddyc.com/membership/3.7.2/member_share.png'
        })
    })
}
function shareWechat(conf) {
    let url      = conf.shareUrl;
    let content  = conf.shareContent;
    let title    = conf.shareTitle;
    let subTitle = conf.shareSubTitle;
    let imgUrl   = conf.shareImgUrl;

    wx.ready(function () {
        var shareOpt={
            title: title, // 分享标题
            link: url, // 分享链接
            imgUrl: imgUrl, // 分享图标
            desc:content,
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
                var dt= new Date();
                var day = [dt.getFullYear(),dt.getMonth()+1,dt.getDate()];
                var time = [dt.getHours(),dt.getMinutes(),dt.getSeconds()];
                var timeShow= [day.join('-'),time.join(':')].join(' ');
                _vds.track("微信分享", { activeName: title, activeUrl:url,shareTime: timeShow, userId: ""})
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        };
        wx.onMenuShareTimeline(shareOpt);
        wx.onMenuShareAppMessage(shareOpt);
        wx.onMenuShareQQ(shareOpt);
        wx.onMenuShareWeibo(shareOpt);
    })
}

function adv() {
    /** grwoingio */
    var _vds = _vds || [];
    window._vds = _vds;
    (function(){
        _vds.push(['setAccountId', 'e2f213a5f5164248817464925de8c1af']);
        (function() {
            var vds = document.createElement('script');
            vds.type='text/javascript';
            vds.async = true;
            vds.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'dn-growing.qbox.me/vds.js';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(vds, s);
        })();
    })();
}
let config ;

exports.init = function (conf) {
    adv();

    config = conf;
    if (!isWechat()) {  return this; }

    wx.config({
        debug: conf.debug?true:false,
        appId: conf.appId,
        timestamp: conf.timestamp,
        nonceStr: conf.nonceStr,
        signature: conf.signature,
        jsApiList: [
            // 所有要调用的 API 都要加到这个列表中
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'getLocation'
        ]
    });

    return this;
}

exports.share = function (options) {
    $.extend(config,options||{});
    if (config.isapp) {
        shareApp(config);
    }

    if (isWechat()) {
        shareWechat(config);
    }

    return this;
}
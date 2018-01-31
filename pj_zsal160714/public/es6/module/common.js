const nativeBridge = require('@util/native-bridge');


function isWechat() {
    return typeof wx != 'undefined';
}
function shareApp(conf) {
    nativeBridge.ready(function () {
        nativeBridge.share({
            url     : conf.shareUrl,
            content : conf.shareContent,
            title   : conf.shareTitle,
            subTitle: conf.shareSubTitle,
            image   : conf.shareImgUrl
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
        wx.onMenuShareTimeline({
            title: title, // 分享标题
            link: url, // 分享链接
            imgUrl: imgUrl, // 分享图标
            success: function () {
                
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });
        wx.onMenuShareAppMessage({
            title: title, // 分享标题
            desc: content, // 分享描述
            link: url, // 分享链接
            imgUrl: imgUrl, // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
  
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });
        wx.onMenuShareQQ({
            title: title, // 分享标题
            desc: content, // 分享描述
            link: url, // 分享链接
            imgUrl: imgUrl, // 分享图标
            success: function () {

            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });
        wx.onMenuShareWeibo({
            title: title, // 分享标题
            desc: content, // 分享描述
            link: url, // 分享链接
            imgUrl: imgUrl, // 分享图标
            success: function () {
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });
    })
}

let config ;

exports.init = function (conf) {
    config = conf;
    if (!isWechat()) {  return this; }   
    
    wx.config({
        debug: false,
        appId: conf.appId,
        timestamp: conf.timestamp,
        nonceStr: conf.nonceStr,
        signature: conf.signature,
        jsApiList: [
            // 所有要调用的 API 都要加到这个列表中
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo'
        ]
    });
    
    return this;
}

exports.share = function () {
    if (config.isapp) {
        shareApp(config);
    }
    
    if (isWechat()) {
        shareWechat(config);
    }
    
    return this;
}
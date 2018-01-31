// const nativeBridge = require('native-bridge');
const ready = require('@util/native-bridge/lib/ready');
const share = require('@util/native-bridge/lib/share');


function getTime() {
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function isWechat() {
    return typeof wx != 'undefined';
}

function shareApp(conf) {
    ready(function() {
        share({
            url: conf.shareUrl,
            content: conf.shareContent,
            title: conf.shareTitle,
            subTitle: conf.shareContent,
            image: conf.shareImgUrl
        })
    })
}

function shareWechat(conf) {
    let url = conf.shareUrl;
    let content = conf.shareContent;
    let title = conf.shareTitle;
    let subTitle = conf.shareSubTitle;
    let imgUrl = conf.shareImgUrl;

    wx.ready(function() {
        wx.onMenuShareTimeline({
            title: title, // 分享标题
            link: url, // 分享链接
            imgUrl: imgUrl, // 分享图标
            success: function() {
                _vds.track("微信分享", {
                    activeName: "iWatch2秒杀活动",
                    activeUrl: CONF.shareUrl,
                    shareTime: getTime(),
                    userId: CONF.openid || ''
                });
            },
            cancel: function() {
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
            success: function() {
                _vds.track("微信分享", {
                    activeName: "iWatch2秒杀活动",
                    activeUrl: CONF.shareUrl,
                    shareTime: getTime(),
                    userId: CONF.openid || ''
                });
            },
            cancel: function() {
                // 用户取消分享后执行的回调函数
            }
        });
        wx.onMenuShareQQ({
            title: title, // 分享标题
            desc: content, // 分享描述
            link: url, // 分享链接
            imgUrl: imgUrl, // 分享图标
            success: function() {
                _vds.track("微信分享", {
                    activeName: "iWatch2秒杀活动",
                    activeUrl: CONF.shareUrl,
                    shareTime: getTime(),
                    userId: CONF.openid || ''
                });
            },
            cancel: function() {
                // 用户取消分享后执行的回调函数
            }
        });
        wx.onMenuShareWeibo({
            title: title, // 分享标题
            desc: content, // 分享描述
            link: url, // 分享链接
            imgUrl: imgUrl, // 分享图标
            success: function() {
                _vds.track("微信分享", {
                    activeName: "iWatch2秒杀活动",
                    activeUrl: CONF.shareUrl,
                    shareTime: getTime(),
                    userId: CONF.openid || ''
                });
            },
            cancel: function() {
                // 用户取消分享后执行的回调函数
            }
        });
    })
}

let config;

exports.init = function(conf) {
    config = conf;
    if (!isWechat()) { return this; }

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
            'onMenuShareWeibo',
            'getLocation'
        ]
    });

    return this;
}

exports.share = function() {
    if (config.isapp) {
        shareApp(config);
    }

    if (isWechat()) {
        shareWechat(config);
    }

    return this;
}
exports.getLocation = function(fn) {
    wx.ready(function() {
        wx.getLocation({
            type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success: function(res) {
                var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                var speed = res.speed; // 速度，以米/每秒计
                var accuracy = res.accuracy; // 位置精度
                fn(res.latitude, res.longitude);
            }
        });
    })
    return this
}
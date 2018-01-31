const nativeReady = require('@util/native-bridge/lib/ready');
const nativeShare = require('@util/native-bridge/lib/share'); 

function addZero (n) {
    if (n < 10) {
        return '0'+n;
    }
    return ''+n;
}
function getTime () {
    let now = new Date();
    let year = now.getFullYear();
    let month = addZero(now.getMonth() + 1);
    let day  = addZero(now.getDate());
    let hours = addZero(now.getHours());
    let minutes = addZero(now.getMinutes());
    let seconds = addZero(now.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function isWechat() {
    return typeof wx != 'undefined';
}

function shareApp(conf) {
    nativeReady(function () {
        nativeShare({
            url      : conf.shareUrl,
            content  : conf.shareContent,
            title    : conf.shareTitle,
            subTitle : conf.shareSubTitle,
            image    : conf.shareImgUrl
        })
    })
}
function shareWechat(conf) {
    wx.ready(function () { 
        let shareOpt = {
            title     : conf.shareTitle, // 分享标题
            link      : conf.shareUrl, // 分享链接
            imgUrl    : conf.shareImgUrl, // 分享图标
            desc      : conf.shareContent,
            type      : '', // 分享类型,music、video或link，不填默认为link
            dataUrl   : '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
                _vds.track("微信分享", { 
                    activeName: conf.activeName, 
                    activeUrl: conf.shareUrl,
                    shareTime: getTime(), 
                    userId   : conf.openid || ''
                });
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

class Common{
    constructor(conf){
        this.config = conf;
        if (isWechat()) {
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
        }
    }
    share(){
        if (this.config.isapp) {
            shareApp(this.config);
        }
        if (isWechat()) {
            shareWechat(this.config);
        }
        return this;
    }
    getLocation(fn){
        wx.ready(function () {
            wx.getLocation({
                type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                success: function (res) {
                    var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                    var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                    var speed = res.speed; // 速度，以米/每秒计
                    var accuracy = res.accuracy; // 位置精度
                    fn(res.latitude, res.longitude);
                }
            });
        })
        return this;
    }
}

let common;

/**
 * 单例模式， 依赖全局的 CONF 配置对象
 * const getCommon = require('./module/common');
 * getCommon().share();
 */
module.exports = function () {
    if (!common) {
        common = new Common(window.CONF);
    }
    return common;
}
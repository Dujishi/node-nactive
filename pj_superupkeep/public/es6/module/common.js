const nativeReady = require('@util/native-bridge/lib/ready');
const nativeShare = require('@util/native-bridge/lib/share');
const Fixtip = require('@ui/fixtip')
const queryString = require('@util/string-util/query-string');

function addZero(n) {
    if (n < 10) {
        return '0' + n;
    }
    return '' + n;
}

function getTime() {
    let now = new Date();
    let year = now.getFullYear();
    let month = addZero(now.getMonth() + 1);
    let day = addZero(now.getDate());
    let hours = addZero(now.getHours());
    let minutes = addZero(now.getMinutes());
    let seconds = addZero(now.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${secoeds}`;
}

function isWechat() {
    return navigator.userAgent.indexOf('MicroMessenger') > -1;
}

function shareApp(conf) {
    nativeReady(function(appInfo) {
        nativeShare({
            url: conf.shareUrl,
            content: conf.shareContent,
            title: conf.shareTitle,
            subTitle: conf.shareSubTitle,
            image: conf.shareImgUrl
        })
    })
}

function shareWechat(conf) {
    wx.ready(function() {
        let shareOpt = {
            title: conf.shareTitle, // 分享标题
            link: conf.shareUrl, // 分享链接
            imgUrl: conf.shareImgUrl, // 分享图标
            desc: conf.shareContent,
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function() {
                _vds.track("微信分享", {
                    activeName: conf.activeName,
                    activeUrl: conf.shareUrl,
                    shareTime: getTime(),
                    userId: conf.openid || ''
                });
            },
            cancel: function() {
                // 用户取消分享后执行的回调函数
            }
        };
        wx.onMenuShareTimeline(shareOpt);
        wx.onMenuShareAppMessage(shareOpt);
        wx.onMenuShareQQ(shareOpt);
        wx.onMenuShareWeibo(shareOpt);
    })
}

/**
 * 获取user-agent里面的设备号
 * user-agent示例
 * deviceID/94A8FF48-DCA8-4D8A-9678-7A34FCFE59FF
 */
function getDeviceID() {
    let userAgent = navigator.userAgent;
    let deviceID = '';
    if (userAgent.indexOf('deviceID/') > -1) {
        let strs = userAgent.split('deviceID/');
        if (strs.length > 1) {
            let str = strs[1];
            if (str.indexOf(' ') > -1) {
                deviceID = str.split(' ')[0]
            } else {
                deviceID = str;
            }
        }
    }
    return deviceID;
}

function stat(info) {
    // source 和 openid 需要手动设置
    window._ax = [];
    let source = 'other';
    if (window.CONF.isapp) {
        source = 'app';
    } else if (isWechat()) {
        source = 'wechat';
    } else {
        if (window.location.search) {
            let search = window.location.search.substring(1);
            let params = queryString.parse(search);
            if (params['trackId']) {
                source = params['trackId'];
            }
        }
    }

    _ax.push(['set', 'source', source]);
    _ax.push(['set', 'userId', info && info.userId ? info.userId : '']);
    _ax.push(['set', 'openid', window.CONF.openid]);
    _ax.push(['set', 'deviceID', getDeviceID()]);

    (function() {
        var vds = document.createElement('script');
        vds.type = 'text/javascript';
        vds.async = true;
        vds.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'store.ddyc.com/res/xkcdn/analytics/v1.0.0/analytics.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(vds, s);
    })();
}

class Common {
    constructor(conf) {
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
        if (this.config.isapp) {
            nativeReady(function(info) {
                stat(info);
            })
        } else {
            stat();
        }
    }
    share() {
        if (this.config.isapp) {
            shareApp(this.config);
        }
        if (isWechat()) {
            shareWechat(this.config);
        }
        return this;
    }
    getLocation(fn) {
        wx.ready(function() {
            wx.getLocation({
                type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                success: function(res) {
                    var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                    var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                    var speed = res.speed; // 速度，以米/每秒计
                    var accuracy = res.accuracy; // 位置精度
                    fn(res.latitude, res.longitude);
                },
                error: function(res) {
                    new Fixtip({
                        msg: '获取地理位置失败，请确认是否已开启'
                    });
                }
            });
        })
        return this;
    }
    isWechat() {
        return isWechat();
    }
}

let common;

/**
 * 单例模式， 依赖全局的 CONF 配置对象
 * const getCommon = require('./module/common');
 * getCommon().share();
 */
module.exports = function() {
    if (!common) {
        common = new Common(window.CONF);
    }
    return common;
};
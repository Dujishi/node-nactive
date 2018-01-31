const ready = require('@util/native-bridge/lib/ready');
const share = require('@util/native-bridge/lib/share');

// function getTime() {
//     const now = new Date();
//     const year = now.getFullYear();
//     const month = now.getMonth() + 1;
//     const day = now.getDate();
//     const hours = now.getHours();
//     const minutes = now.getMinutes();
//     const seconds = now.getSeconds();

//     return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
// }

function isWechat() {
    return typeof wx != 'undefined';
}

function shareApp(conf) {
    ready(() => {
        share({
            url: conf.shareUrl,
            content: conf.shareContent,
            title: conf.shareTitle,
            subTitle: conf.shareContent,
            image: conf.shareImgUrl
        });
    });
}

function shareWechat(conf) {
    const url = conf.shareUrl;
    const content = conf.shareContent;
    const title = conf.shareTitle;
    // const subTitle = conf.shareSubTitle;
    const imgUrl = conf.shareImgUrl;

    wx.ready(() => {
        wx.onMenuShareTimeline({
            title, // 分享标题
            link: url, // 分享链接
            imgUrl, // 分享图标
            success() {
            },
            cancel() {
                // 用户取消分享后执行的回调函数
            }
        });
        wx.onMenuShareAppMessage({
            title, // 分享标题
            desc: content, // 分享描述
            link: url, // 分享链接
            imgUrl, // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success() {
            },
            cancel() {
                // 用户取消分享后执行的回调函数
            }
        });
        wx.onMenuShareQQ({
            title, // 分享标题
            desc: content, // 分享描述
            link: url, // 分享链接
            imgUrl, // 分享图标
            success() {
            },
            cancel() {
                // 用户取消分享后执行的回调函数
            }
        });
        wx.onMenuShareWeibo({
            title, // 分享标题
            desc: content, // 分享描述
            link: url, // 分享链接
            imgUrl, // 分享图标
            success() {
            },
            cancel() {
                // 用户取消分享后执行的回调函数
            }
        });
    });
}

let config;

exports.init = function (conf) {
    config = conf;
    if (!isWechat()) { return this; }

    wx.config({
        debug: !!conf.debug,
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
};

exports.share = function () {
    if (config.isapp) {
        shareApp(config);
    }

    if (isWechat()) {
        shareWechat(config);
    }

    return this;
};
exports.getLocation = function (fn) {
    wx.ready(() => {
        wx.getLocation({
            type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success(res) {
                // const latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                // const longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                // const speed = res.speed; // 速度，以米/每秒计
                // const accuracy = res.accuracy; // 位置精度
                fn && fn(res.latitude, res.longitude);
            }
        });
    });
    return this;
};

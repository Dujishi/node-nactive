$(function () {
    
    /**
     * 自动生成锚点
     */
    ;(function () {
        let banner = $('.banner');
        let heightBanner = banner.height();
    
        let dotHtml = ''
        let dots = $('.js-dot');
        dots.each(function () {
            let that = $(this);
            let h = parseInt(that.offset().top - heightBanner,10);
            dotHtml += `<div class="dot" style="top:${h}px"></div>`;
        
        });
        $('.vertical-line').html(dotHtml);
    }());
    
    /**
     * 立即使用
     */
    $('.to-use').on('tap', function () {
        let that = $(this);
        window.location = that.data('scheme');
        
        if (!window.CONF.isapp) {
            setTimeout( () => {
                window.location = 'http://dl.ddyc.com';
            }, 3 * 1000);
        }
    })
});


if (typeof wx != 'undefined') {
    wx.config({
        debug: false, // 开启调试模式
        appId: CONF.appId, // 必填，公众号的唯一标识
        timestamp: CONF.timestamp, // 必填，生成签名的时间戳
        nonceStr: CONF.nonceStr, // 必填，生成签名的随机串
        signature: CONF.signature,// 必填，签名，见附录1
        jsApiList: ['hideOptionMenu'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });
    
    // 隐藏右上角菜单
    wx.ready(function () {
        wx.hideOptionMenu();
    })
    
}
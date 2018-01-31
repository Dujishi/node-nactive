
require('./module/jquery.parallax');
const Fixtip = require('@ui/fixtip');
const common = require('./module/common');
// const Loading = require('@ui/loading/wloading');
const callShare = require('@util/native-bridge/lib/callShare');
const ready = require('@util/native-bridge/lib/ready');
const login = require('@util/native-bridge/lib/login');
const isLogin = require('@util/native-bridge/lib/isLogin');
const goToView = require('@util/native-bridge/lib/goToView');

/**
 * 获取 webp 图片链接
 * @param {any} imgsrc
 * @returns
 */
function getWebpSrc(imgsrc, webpimgsrc) {
    let needwebp = false;
    let src = '';
    if (window.localStorage && typeof localStorage === 'object') {
        needwebp = localStorage.getItem('webpsupport') === 'true';
    }
    src = needwebp ? webpimgsrc : imgsrc;
    return src;
}

// 先加小的载模糊图片，再加载清晰图片
const imgSmall = document.querySelector('.img-small');
const loadImage = () => {
    const img = new Image();
    img.src = imgSmall.src;
    img.addEventListener('load', () => {
        imgSmall.classList.add('loaded');
    }, false);
    const imgLarge = new Image();
    const imgHeader = new Image();
    imgLarge.src = getWebpSrc(imgSmall.dataset.large, imgSmall.dataset.largewebp);
    imgHeader.src = getWebpSrc(imgSmall.dataset.header, imgSmall.dataset.headerwebp);
    imgHeader.addEventListener('load', () => {
        imgHeader.classList.add('header-img');
    });
    $('#scene li').html(imgHeader);
    imgLarge.addEventListener('load', () => {
        imgLarge.classList.add('loaded');
    }, false);
    imgSmall.parentNode.appendChild(imgLarge);
};
loadImage();

$(() => {
    const config = window.CONF;
    common.init(config);
    const $ruleDialog = $('.dialog-rule');
    const $succDialog = $('.dialog-success');
    const $usedDialog = $('.dialog-used');
    $('.container').on('tap', '.rules', () => {
        $ruleDialog.removeClass('hide');
    });
    $('.dialog').on('tap', '.close', function () {
        $(this).parents('.dialog').addClass('hide');
    });
    $('#scene').parallax();
    // APP 分享
    let userid;
    ready((info) => {
        userid = info.userId;
    });
    const shareCb = () => {
        if (isLogin()) {
            callShare({
                url: window.CONF.shareUrl,
                title: window.CONF.shareTitle,
                subTitle: window.CONF.shareSubTitle,
                image: window.CONF.shareImgUrl,
                content: window.CONF.shareContent,
            });
            $.post('/nactive/appinvite/index', { userId: userid }, (res) => {
                if (res.success) {
                    if (res.data === 0) {
                        setTimeout(() => {
                            $usedDialog.removeClass('hide');
                        }, 4000);
                    } else if (res.data === 1) {
                        setTimeout(() => {
                            $succDialog.removeClass('hide');
                        }, 4000);
                    }
                } else {
                    setTimeout(() => {
                        new Fixtip({
                            msg: res.msg || '数据请求失败',
                        });
                    }, 4000);
                }
            });
        } else {
            login();
        }
    };
    $('.share-btn').on('tap', shareCb);

    const gotToHongbao = () => {
        goToView({
            id: 'ticketList',
        });
    };
    $('.use-btn, .check-btn').on('tap', gotToHongbao);
});

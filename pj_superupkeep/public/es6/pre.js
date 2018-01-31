require('@ui/lazyload');
const common = require('./module/common')();
// const Loading = require('@ui/loading/wloading');
const callShare = require('@util/native-bridge/lib/callShare');
const ready = require('@util/native-bridge/lib/ready');
const goToPage = require('@util/native-bridge/lib/goToPage');
const countDown = require('@util/count-down');


const CONF = window.CONF;
const isApp = CONF.isapp;
const iswechat = CONF.iswechat;
const shoplistUrl = 'https://m.ddyc.com/nactive/storelist/index';
const detailUrl = CONF.isDebug ? 'https://new-m.ddyc.com/nactive/superupkeep/detail' : 'https://m.ddyc.com/nactive/superupkeep/detail';
let latDataCache = {};


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
    imgLarge.src = getWebpSrc(imgSmall.dataset.large, imgSmall.dataset.largewebp);
    imgLarge.addEventListener('load', () => {
        imgLarge.classList.add('loaded');
    }, false);
    $('.img-small').after(imgLarge);
};
$(() => {
    loadImage();
    function initLazyload() {
        $('.lazyload').lazyload({
            placeholder_data_img: 'http://store.ddyc.com/app/decorate/2016/12/21/20161221053306elduaidhyah9jedb.jpg',
            effect: 'fadeIn',
            threshold: 220,
        });
    }
    initLazyload();
    // 获取地理位置
    // getLocation((latData) => {
    //     latDataCache = latData || { lat: '', lng: '' };
    // });
    common.share();
    // 倒计时
    const $time = $('.fix-bottom-time');
    countDown({
        countTime: CONF.remainSecs * 1000,
        onCount: (res) => {
            const node = `<span>${res.nD}</span>天<span>${res.nH}</span>时<span>${res.nM}</span>分<span>${res.nS}</span>秒`;
            $time.html(node);
        },
    });

    // 获取附近店铺
    // $.post('/nactive/superupkeep/shop', { lon: latDataCache.lng || '30.288973', lat: latDataCache.lat || '120.089225', pageNumber: 1, pageSize: 10 }, (res) => {
    //     if (res.success) {
    //         const data = res.data;
    //         // const defaultAvatar = '//store.ddyc.com/res/xkcdn/icons/share/icon_storelist.png';
    //         const shopTemp = `<img src=${data[0].avatar} alt="">
    //                         <p class="shop-name">${data[0].careShopName}</p>
    //                         <p class="shop-address">${data[0].address}</p>
    //                         <span class="shop-distance">${data[0].distance}</span>`;
    //         $('.shop-item').html(shopTemp);
    //     }
    // });

    // 前往详情页
    function goToDetail() {
        if (isApp) {
            goToPage({
                type: 1,
                url: detailUrl,
            });
        } else {
            window.location.href = detailUrl;
        }
    }
    $('header').on('tap', 'img', goToDetail);

    /**
     * 查看店铺
     */
    function goToShop() {
        if (isApp) {
            ready(() => {
                goToPage({
                    type: 1,
                    url: shoplistUrl,
                });
            });
        } else if (iswechat) {
            window.location.href = shoplistUrl;
        } else {
            window.location.href = 'http://dl.ddyc.com';
        }
    }
    $('.shop-btn').on('tap', goToShop);
});

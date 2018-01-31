const Loading = require('@ui/loading/wloading');
const queryString = require('@util/string-util/query-string');
const common = require('./module/common')();

const queryStringParse = queryString.parse(window.location.search);
const activeId = queryStringParse.activeId || '';
const lat = queryStringParse.lat;
const lng = queryStringParse.lng;

Loading.show();
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


$(() => {
    // 先加小的载模糊图片，再加载清晰图片
    const $headerimg = $('.header-img');
    const $imgList = $('.img-list img');
    $headerimg.attr('src', getWebpSrc($headerimg.attr('data-large'), $headerimg.attr('data-webplarge')));
    $imgList.each(function () {
        const src = getWebpSrc($(this).attr('data-large'), $(this).attr('data-webplarge'));
        $(this).attr('src', src);
    });
    Loading.hide();
    common.share();

    const url = `${window.location.origin}/nactive/superupkeep/index?activeId=${activeId}`;

    $('#fixLink').attr('href', url);

    if (lat && lng) {
        // localStorage.setItem('lat',lat);
        // localStorage.setItem('lng',lng);
    }
});

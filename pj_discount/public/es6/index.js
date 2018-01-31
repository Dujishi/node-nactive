const queryString = require('@util/string-util/query-string');


const params = queryString.parse(window.location.search);
const commodityCodes = params.commodityCodes;
const activityId = params.activityId || 'default';
const config = require('./module/config')[activityId];
const loading = require('@ui/loading/wloading');
const Common = require('@util/common-page');

Common.create();

/**
 * 获取优惠商品列表
 */
function getList() {
    loading.show();
    $.post('/nactive/discount/list', {
        commodityCodes,
    }).then((res) => {
        if (res.success) {
            let data = res.data;
            if (config.hasReducePrice) {
                data = calcReducePrice(data);
            }
            const html = template('product-tpl', {
                data,
                config,
            });
            $('.goods-list').html(html);
        }
        loading.hide();
    });
}

function bindEvent() {
    $('.rules-btn').on('tap', () => {
        $('.rules').addClass('animated zoomIn').css('display', 'block');
    });

    $('.rules__close').on('tap', () => {
        $('.rules').removeClass('animated zoomIn').css('display', 'none');
    });
}

function calcReducePrice(data) {
    data = data.map((v) => {
        let sum = 0;
        v.childItemList.forEach((v1) => {
            sum += v1.number * v1.price;
        });
        v.reduceMoney = (sum - v.price).toFixed(0);
        return v;
    });
    return data;
}

function init() {
    const html = template('page-tpl', config);
    $('body').append(html).css('background-color', config.backgroundColor);
    if (config.rules) {
        $('.rules__bd').html(config.rules);
    }
}

$(() => {
    init();
    getList();
    bindEvent();
});

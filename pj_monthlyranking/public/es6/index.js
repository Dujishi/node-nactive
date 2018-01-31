const FastClick = require('fastclick');
const ready = require('@util/native-bridge/lib/ready');
const compareVersion = require('@util/string-util/compare-version');
const closeView = require('@util/native-bridge/lib/closeView');
const queryString = require('@util/string-util/query-string');

$(() => {

    FastClick.attach(document.body);

    if (window.CONF.shopId) {
        init(window.CONF.shopId);
    } else {
        ready((info) => {
            init(info.shopId);
        });
    }

    $('body').on('tap', '.all-production', function () {
        $('.gifts-all').show(500);
        $(this).hide();
    });

    $('body').on('tap', '.rank-btn', function () {
        closeView();
    });

    function init(shopId) {
        $.ajax({
            type: 'post', url: '/nactive/monthlyranking/index', data: {shopId}, success: function (res) {
                console.log(res);
                res.data.today = nowDate();
                res.data.thisMonthAmountSum = res.data.thisMonthAmountSum / 100;
                const html = template('gifts-tpl', res.data);
                $('.gifts-page').html(html);
            }
        })
    }

    function nowDate() {
        let now = new Date();
        let year = now.getFullYear();
        let month = now.getMonth() + 1;
        let day = now.getDate();
        var clock = year + "-";
        if (month < 10) {
            clock += "0";
        }
        clock += month + "-";
        if (day < 10) {
            clock += "0";
        }
        clock += day + " ";
        return clock;
    };

    //轮播
    setInterval(function () {
        var liFirst = $('.msg-box>ul li')[0];
        $('.msg-box>ul').animate({top: '-0.6rem'}, function () {
            $(this).css('top', 0).append(liFirst);
        })
    }, 4000);

});

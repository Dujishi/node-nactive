require('./module/jquery.parallax');
require('@ui/lazyload');
let pageInfoData = require('./module/preData');
const nativeReady = require('@util/native-bridge/lib/ready');
const nativeGoToPage = require('@util/native-bridge/lib/goToPage');

let util = require('./module/util');
const common = require('./module/common')();

const template = require('@ui/template');
template.config("openTag", "[[")
template.config("closeTag", "]]")

const URI = {
    'viewShop': 'http://active.yangchediandian.com/storelist160119/index.php'
}

//app登录
let appClient = {
    viewShop: function() {
        nativeReady(() => {
            nativeGoToPage({ type: 1, url: URI.viewShop, needLogin: false }).then(() => {})
        });
    }
}

//其他登录
let otherClient = {
    viewShop: function() {
        window.location.href = URI.viewShop;
    }
}

//统一
let client = (function() {
    if (window.CONF.isapp) {
        return appClient;
    } else {
        return otherClient;
    }
})();

$(function() {

    common.share();

    util.timeDown(function(timeObj) {
        var html = [];
        var days = util.splitStr(timeObj.nD);
        var hour = util.splitStr(timeObj.nH);
        var mini = util.splitStr(timeObj.nM);
        var second = util.splitStr(timeObj.nS);

        html = html.concat(util.combStr(days));
        html.push('<span class="num-txt">天</span>');
        html = html.concat(util.combStr(hour));
        html.push('<span class="num-txt">时</span>');
        html = html.concat(util.combStr(mini));
        html.push('<span class="num-txt">分</span>');
        html = html.concat(util.combStr(second));
        html.push('<span class="num-txt">秒</span>');

        $("#time_num").html(html.join(''));

        if (timeObj.type == 0) {
            window.location.reload(true);
        }
    }, window.CONF.nowTimeStamp, (new Date(window.CONF.startTimeStr.replace(/-/g, "/"))).getTime());

    let category1Data = {};
    let category2Data = [];
    let category3Data = [];

    for (let i = 0; i < pageInfoData.length; i++) {
        if (pageInfoData[i].category == 1) {
            category1Data = pageInfoData[i];
        } else if (pageInfoData[i].category == 2) {
            category2Data.push(pageInfoData[i]);
        } else {
            category3Data.push(pageInfoData[i]);
        }
    }

    $("#b_box_container").html(template('catgory1_tmp', category1Data));
    $("#p_list_box").html(template('catgory2_tmp', { data: category2Data }))
    $("#s_p_list_box").html(template('catgory3_tmp', { data: category3Data }))
    $('.lazyload').lazyload({
        effect: "fadeIn",
        event: "sporty"
    });
    var timeout = setTimeout(function() {
        $("img.lazyload").trigger("sporty")
    }, 500);

    $('#view_shops').on('tap', function() {
        client.viewShop();
    });

    $("#container").removeClass('hide');

    //parallax
    $("#scene").parallax();
});
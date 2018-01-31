const Fixtip = require('@ui/fixtip');
const goToPage = require('@util/native-bridge/lib/goToPage');


function toast(msg) {
    new Fixtip({ msg });
}

exports.toast = toast;

function isOk(ret) {
    if (ret.success) {
        return true;
    }
    new Fixtip({
        msg: ret.message || ret.msg || '网络错误',
    });
    return false;
}

exports.isOk = isOk;

exports.openUrl = (url) => {
    if (window.CONF.isapp) {
        goToPage({
            type: 1,
            url,
        });
    } else {
        window.location.href = url;
    }
};

/**
 * @description 图片延迟加载， 元素必须拥有 data-original 属性
 * @param selector {String}  元素选择起， 默认值为[data-original]
 */
function lazyload(selector = '[data-original]') {
    $(selector).each(function () {
        const that = $(this);
        const original = that.data('original');
        const isImg = (this.tagName === 'IMG');
        const img = new Image();
        img.onload = function () {
            that.removeAttr('data-original');
            if (isImg) {
                that.attr('src', original);
            } else {
                that.css('background-image', `url(${original})`);
            }
        };
        img.src = original;
    });
}
exports.lazyload = lazyload;

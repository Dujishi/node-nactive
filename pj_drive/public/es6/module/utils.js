const Fixtip       = require('@ui/fixtip');

function isOk (ret) {
    if (ret.success) {
        return true;
    }else{
        new Fixtip({
            msg: ret.message || ret.msg || '网络错误'
        });
        return false;
    }
}
exports.isOk = isOk;
/**
 * @description 图片延迟加载， 元素必须拥有 data-original 属性
 * @param selector {String}  元素选择起， 默认值为[data-original]
 */
function lazyload(selector = '[data-original]') {
    $(selector).each(function () {
        let that = $(this);
        let original = that.data('original');
        var isImg = (this.tagName == 'IMG');
        var img = new Image();
        img.onload = function () {
            that.removeAttr('data-original');
            if (isImg) {
                that.attr('src', original);
            }else{
                that.css('background-image', 'url('+original+')');
            }
        }
        img.src = original;
    })
}
exports.lazyload = lazyload;

function urlEncode(data){
    var ret = [];
    for (var i in data) {
        ret.push(i + '=' + encodeURIComponent(data[i]));
    }
    return ret.join('&');
}
function urlAppend(url, data){
    if(!data){
        return url;
    }
    return url + '?' + urlEncode(data);
}

exports.urlAppend = urlAppend;
/**
 * @description 检测用户有无默认车辆
 * @param  userId {Number}  用户ID
 * @return {Number} 默认车辆ID，没有则为0
 */
// 新版本不校验车辆信息
// function checkCarId(userId) {
//     return nativeBridge.request({
//         url : '/car/vehicle/check/service/3.4.3/',
//         type: 'GET',
//         data: {
//             userId : userId
//         }
//     }).then( ret => {
//         if (isOk(ret)) {
//             return ret.data.carId
//         }
//     })
// }
// exports.checkCarId = checkCarId;
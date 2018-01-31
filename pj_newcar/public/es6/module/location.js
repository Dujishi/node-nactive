const nativeReady = require('@util/native-bridge/lib/ready');
const common = require('./common')();
const config = window.CONF;
window.APPINFO = {};

/**
 * 处理地理位置
 */
const getLocation = function(fn) {
    // fn({
    //     lat: 30.288973,
    //     lng: 120.089225
    // });
    if (config.isapp) {
        //app获取经纬度
        nativeReady((ret) => {
            window.APPINFO = ret;
            if (ret.lat && ret.lng) {
                fn({ lat: ret.lat, lng: ret.lng });
            } else {
                fn();
            }
        })
    } else if (common.isWechat()) {
        //微信获取经纬度
        let flag = false,
            timer;
        common.getLocation((lat, lng) => {
            flag = true;
            if(timer){
                window.clearTimeout(timer);
            }
            fn({ lat: lat, lng: lng });
        });
        timer = window.setTimeout(function() {
            if (!flag) {
                fn();
            }
        }, 3000);
    } else {
        //第三方获取经纬度
        var options = {
            enableHighAccuracy: true,
            timeout: 3000,
            maximumAge: 0
        };

        function success(pos) {
            var crd = pos.coords;
            fn({ lat: crd.latitude, lng: crd.longitude });
        };

        function error(err) {
            console.warn('ERROR(' + err.code + '): ' + err.message);
            fn({ lat: '', lng: '' });
        };
        navigator.geolocation.getCurrentPosition(success, error, options);
    }
}

module.exports = getLocation;
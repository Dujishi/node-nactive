const nativeReady = require('@util/native-bridge/lib/ready');
const common = require('./common')();

const config = window.CONF;
window.APPINFO = {};

/**
 * 处理地理位置
 */
const getLocation = function (fn) {
    // fn({
    //     lat: 30.288973,
    //     lng: 120.089225
    // });
    if (config.isapp) {
        // app获取经纬度
        nativeReady((ret) => {
            window.APPINFO = ret;
            if (ret.lat && ret.lng) {
                fn({ lat: ret.lat, lng: ret.lng });
            } else {
                fn();
            }
        });
    } else if (config.iswechat) {
        // 微信获取经纬度
        let flag = false;
        let timer;
        common.getLocation((lat, lng) => {
            flag = true;
            if (timer) {
                window.clearTimeout(timer);
            }
            fn({ lat, lng });
        });
        timer = window.setTimeout(() => {
            if (!flag) {
                fn();
            }
        }, 5000);
    } else {
        // 第三方获取经纬度
        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        };

        navigator.geolocation.getCurrentPosition((pos) => {
            const crd = pos.coords;
            fn({ lat: crd.latitude, lng: crd.longitude });
        }, (err) => {
            console.warn(`ERROR(${err.code}):  ${err.message}`);
            fn();
        }, options);
    }
};

module.exports = getLocation;

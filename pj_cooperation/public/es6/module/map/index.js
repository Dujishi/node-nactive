/**
 * @description
 * @author  yinshi
 * @date 17/6/1.
 */
import './less.less';

export default function getLocation(shop) {
    if (window.wx) {
        wxLocation(shop);
    } else {
        if (!$('#map-box-page').length) {
            $('body').append('<section class="map-box-page" id="map-box-page"><header class="map-header-page"><i class="back">返回</i><h1>查看地理位置</h1></header>' +
                '<div class="map-box">' +
                '<div class="map-container" id="map-container" ' +
                'style="height: 100%;width: 100%"></div></div></section>');

            $('#map-box-page').find('.back').on('click', () => {
                $('#map-box-page').hide();
            });
        }
        ampLocation(shop);
    }
}
function wxLocation(shop) {
    const wx = window.wx;
    if (!wx) {
        return;
    }
    wx.ready(() => {
        wx.openLocation({
            latitude: shop.latitude, // 纬度，浮点数，范围为90 ~ -90
            longitude: shop.longitude, // 经度，浮点数，范围为180 ~ -180。
            name: shop.shopName || '', // 位置名
            address: shop.address || '', // 地址详情说明
            scale: 12,  // 地图缩放级别,整形值,范围从1~28。默认为最大
            infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
        });
    });
}
function ampLocation(shop) {
    const map = new window.AMap.Map('map-container', {
        resizeEnable: true,
        zoom: 16,
        center: [shop.longitude, shop.latitude]
    });
    map.plugin('AMap.Geolocation', () => {
        const geolocation = new window.AMap.Geolocation({
            enableHighAccuracy: true, // 是否使用高精度定位，默认:true
            timeout: 10000,          // 超过10秒后停止定位，默认：无穷大
            maximumAge: 0,           // 定位结果缓存0毫秒，默认：0
            convert: true,           // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
            showButton: true,        // 显示定位按钮，默认：true
            buttonPosition: 'LB',    // 定位按钮停靠位置，默认：'LB'，左下角
            buttonOffset: new window.AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            showMarker: true,        // 定位成功后在定位到的位置显示点标记，默认：true
            showCircle: true,        // 定位成功后用圆圈表示定位精度范围，默认：true
            panToLocation: true,     // 定位成功后将定位到的位置作为地图中心点，默认：true
            zoomToAccuracy: true      // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        });
        map.addControl(geolocation);
        window.AMap.event.addListener(geolocation, 'complete', (result) => {
            window.Store.location = result.position;
        });
        window.AMap.event.addListener(geolocation, 'error', (err) => {
            console.log(err);
        });
    });
    const marker = new window.AMap.Marker({
        position: [shop.longitude, shop.latitude],
        title: shop.shopName
    });
    marker.setMap(map);

    if (shop.slon && shop.slat) {
        window.AMap.plugin('AMap.Driving', () => { // 回调函数
            // 构造路线导航类
            const driving = new window.AMap.Driving({
                map
            });
            driving.search([shop.slon, shop.slat], [shop.longitude, shop.latitude]);
        });
    }

    $('#map-box-page').show();
}


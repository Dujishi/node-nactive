/**
 * @description
 * @author  yinshi
 * @date 17/6/1.
 */


import map from './module/map'
import {create} from '@util/common-page'

$(function () {
    const common = create();
    const wx = window.wx || null;
    if(wx){
        // 隐藏所有的分享入口
        wx.ready(function () {
            wx.hideAllNonBaseMenuItem();
            wx.hideOptionMenu();
        });
    }
    $('#shopNav').on('click', '.icon-address', function () {
        console.log(this)
        const $this = $(this)
        map({
            latitude: $this.data('lat'), // 纬度，浮点数，范围为90 ~ -90
            longitude: $this.data('lng'), // 经度，浮点数，范围为180 ~ -180。
            shopName:  $this.data('name'), // 位置名
            address: $this.data('address'), // 地址详情说明
        })
    });
});

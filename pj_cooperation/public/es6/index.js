import 'es5-shim';
import loginModal from './module/login'
import Loading from '@ui/loading/wloading'
import CouponModal from './module/coupon'
import {create} from '@util/common-page'
import {confirm} from '@ui/modal'
const Fixtip = require('@ui/fixtip')
/**
 * 获取用户的状态
 * @param $btn
 * @param cb
 * @return {*|Promise.<TResult>}
 */
const getUserStatus = function ($btn, cb) {
    Loading.show()
   return $.post('/nactive/cooperation/index').then(res=>{
       Loading.hide()
       if(res.success){
           const data = res.data;
           $btn.attr('class', 'btn '+ data.cls).html(data.txt).data('key', data.key);
           cb && cb(data);
       }
   }, err=> Loading.hide())
}
/**
 *
 */
const loginAction = (()=>{
    let modal = null;
        return function ($btn) {
        if(!modal){
            modal = new loginModal({
                success(){
                    $btn.html('登录成功');
                    getUserStatus($btn, function (data) {
                        if(data.key === 'noCoupon'){
                            couponAction($btn);
                        }
                        if(!$("#loginBox").length){
                            $("#footerLink").after(` <div class="login-out" id="loginBox">
                               <span>${data.phone}</span>
                            ${window.CONF.iswechat? '': '<a href="javascript:void(0)" id="loginOut">退出登录</a>'}
                            </div>`);
                            loginOutAction();
                        }
                    });
                    modal = null;
                }
            });
        }
        modal.show();
        return modal
    }
})();

const couponAction = (() => {
    let action = null;
    return function ($btn) {
        if(!action){
            action = new CouponModal({
                success(){ // 领取成功了
                    new Fixtip({
                        msg: '领取成功'
                    });
                    // 领取成功，处理下按钮事件
                    getUserStatus($btn, function () {
                        location.href = '/feopen/user_center/index#coupon/tianjin'
                    });
                }
            });
        }
        action.doAction();
    }
})();


function btnAction($btn) {
    $btn.on('click', function () {
        const key = $btn.data('key');
        switch (key){
            case 'unlogin': //未登录的时候
                loginAction($btn);
                return;
            case 'noCoupon': // 没有领取的时候
                couponAction($btn);
                return;
            case 'isNotWhite': // 不是白名单的用户
                // 什么都不干
                // alert('还没有不是白名单的行动点')
                return
            case 'hasCoupon': // 已经领取了的时候
                location.href = '/feopen/user_center/index#coupon/tianjin'
                return

        }

    });
}
function loginOutAction() {
    $("#loginOut").on('click', function () {
        confirm({
            msg: '确定退出登录么？',
            ok(){
                $.post('/feopen/login/loginout').then(function () {
                    location.reload();
                }, err=>{
                    console.log(err)
                })
            }
        })

    });
}
$(()=>{
    const common = create()
    common.getLocation().then( location => {
        $.post('/feopen/base/location', {
            lat: location.latitude,
            lng: location.longitude
        });
    }, err=>{
        console.log(err)
    });
    const $loginBtn = $("#button");
    btnAction($loginBtn);
    loginOutAction();
});
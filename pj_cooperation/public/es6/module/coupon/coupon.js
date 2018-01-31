/**
 * @description
 * @author  yinshi
 * @date 17/6/1.
 */
import html from './index.html'
import Popup from '../popup'
import loading from '@ui/loading/wloading'
export default class Coupon extends Popup{
    constructor(options = {}){
        super({
            cls: 'coupon-box',
            html,
            mksure: options.mksure,
            cancel: options.cancel
        });
        this.options = options;
        this.init();
    }
    init(){
        this.$modal = this.$popup.find('.coupon-box');
        this.$button = this.$modal.find('.popup-btn')
        this.getCouponList();
        this.addEvent();
    }
    addEvent(){
        const coupon = this;
        this.$modal.on('click', '.coupon-item', function () {
           $(this).addClass('selected').siblings().removeClass('selected')
            coupon.$button.removeClass('disabled')
        });
        this.$button.on('click',  () => {
            coupon.receive();
        });
    }
    getCouponList(){
        loading.show();
        $.get('/nactive/cooperation/coupon').then(res =>{
            loading.hide();
            if(res.success){
                const txt = res.data.map(list => {
                    return `<div class="coupon-item" data-id="${list.id}">
        <div class="coupon-item-logo">
            <img src="${list.logo}" alt="">
            <!--<span class="angle">${list.discount}</span>-->
        </div>
        <div class="coupon-center">
            <h2>${list.title}</h2>
            <p class="light">原价：￥${list.originPrice}</p>
            <!--<p>到店支付：￥<strong>${list.price}</strong></p>-->
        </div>
        <div class="select-radio">
            <i></i>
        </div>
    </div>`}).join('');
                this.$modal.find('.coupon-list').html(txt);
                this.$button.addClass('disabled')
            }else {
                this.showErr(res.message)
            }
        })
    }
    receive(){
        if(this.$button.hasClass('disabled')){
            return
        }

        const id  = this.$modal.find('.selected').data('id');
        if(!id){
            this.showErr('请选择需要的机油');
            return
        }
        this.mksure(id);

    }
}
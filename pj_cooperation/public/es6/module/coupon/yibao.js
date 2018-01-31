/**
 * @description
 * @author  yinshi
 * @date 17/6/28.
 */
import Popup from '../popup'
import html from './yibao.html'
export default class Yibao extends Popup {
    constructor(options = {mksure(){},cancel(){}}){
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
        this.addEvent();

    }
    addEvent(){
        const popup = this;
        this.$modal.on('click', '.yibao-item', function () {
            $(this).addClass('selected').siblings().removeClass('selected');
            popup.$button.removeClass('disabled');
        });
        this.$button.on('click',  ()=> {
            if(!this.$modal.find('.selected').length){
                this.showErr('请选择是否需要医疗保险');
                return
            }
            const result = this.$modal.find('.selected').data('value');
            this.mksure(result);
        });

    }
}
/**
 * @description
 * @author  yinshi
 * @date 17/6/1.
 */
import html from './index.html'
import './index.less'
const Fixtip = require('@ui/fixtip')
export default class popup{
    constructor(options = {}){
        const content = options.html;
        this.options = options;
        this.$popup = $(html);
        this.$popup.find('.model-inner')
            .addClass(options.cls).append(content || '');
        this.$popup.appendTo('body');
        this.$cancelBtn = this.$popup.find('.close');
        this.popupEvent();
    }
    popupEvent(){
        const popup = this;
        // 设置隐藏
        this.$popup.on('click', function (e) {
            if(e.target == this || e.target == popup.$cancelBtn[0]){
                popup.hide();
            }
        });
    }
    show(){
        this.$popup.show();
    }
    mksure(result){
        this.$popup.hide();
        this.options.mksure && this.options.mksure(result)
    }
    hide(){
        this.$popup.hide();
        this.options.cancel && this.options.cancel()
    }
    showErr(err){
        new Fixtip({
            msg: err
        })
    }
}
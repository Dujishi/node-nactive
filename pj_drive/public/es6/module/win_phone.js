const Fixtip = require('@ui/fixtip');

let template = `
<div class="win-tips win-hide">
    <div class="win-tips-box">
        <div class="phone-wrap">
            <div class="phone-header">留下手机号，下回提早通知你哦~</div>
            <div class="phone-input-wrap">
                <input type="number" id="phone-input" class="phone-input" maxlength="11" placeholder="点击输入手机号">
                <div class="phone-clean">
                    <div class="phone-icon-close"></div>
                </div>   
            </div>
            <div class="phone-btn-wrap">
                <div class="phone-btn-cancel">取消</div>
                <div class="phone-btn-ok">确认</div>
            </div>
        </div>
    </div>
</div>
`;

function toast (msg) {
    new Fixtip({msg: msg})
}

class WinPhone{
    constructor(){
        this.$win = $(template);
        this.$win.appendTo(document.body);
        this.$input = this.$win.find('#phone-input');
        this.eventOk = function () {};
        this.bindEvent();
    }
    bindEvent(){
        let me = this;
        let $win = me.$win;
        const phoneReg = /^1[0-9]\d{9}$/ ;
        
        $win.find('.phone-clean').on('tap', () => {
            me.$input.val('');
        })
        $win.find('.phone-btn-cancel').on('tap', () => {
            this.close();
        });
        $win.on('tap', function (e) {
            if ($(e.target).hasClass('win-tips-box')) {
                me.close();
            }
        });
        $win.find('.phone-btn-ok').on('tap', function () {
            let phoneVal = me.$input.val().trim();
            if (phoneVal == '') {
                toast('手机号码不能为空');
                return ;
            } 
            if (!phoneReg.test(phoneVal)) {
                toast('手机号码格式错误');
                return ;
            }
            me.eventOk(phoneVal);
            me.close();
        });
    }
    show(){
        this.$win.removeClass('win-hide');
        return this;
    }
    close(){
        this.$win.addClass('win-hide');
        return this;
    }
    onOk(fn){
        this.eventOk = fn;
        return this;
    }
}

let winPhone ;

module.exports = function () {
    if (!winPhone) {
        winPhone = new WinPhone();
    }
    return winPhone;
};
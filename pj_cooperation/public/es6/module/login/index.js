/**
 * @description
 * @author  yinshi
 * @date 17/5/31.
 */

const html = require('./index.html')

import popup from '../popup'

export default class loginModal extends popup{
    constructor(options = {}){
        super({
            cls: 'login-box',
            html
        });
        const _opts = {
            success: $.noop,
            error: $.noop,
            loginUrl: '/feopen/login/index', //登录的url地址
            codeUrl: '/feopen/login/code', // 获取验证码的地址
            code:{
                time: 30,
                disableCls: 'codeSending',
                waitSend: '发送中',
                sending: '{S}s后重新获取',
                sended: '获取验证码',
            },
            button: {
                disableCls: 'disabled',
                waitSend: '登录中',
                sended: '登录'
            }
        }
        this.options = $.extend(true, _opts, options);
        this.init();
    }

    init(){
        this.$modal = this.$popup.find('.login-box');
        this.$iptPhone = this.$modal.find('.phone-ipt');
        this.$iptCode = this.$modal.find('.code-ipt');
        this.$codeButton = this.$modal.find('.btn-code');
        this.$button = this.$modal.find('.popup-btn');
        this.$cancelBtn = this.$modal.find('.close')
        this.addEvent();
    }
    addEvent(){
        const loginModal = this;
        this.$iptPhone.on('input', function () {

        });
        this.$codeButton.on('tap', () => {
            if(loginModal.$codeButton.hasClass(this.options.code.disableCls)){
                return false
            }
            loginModal.sendCode()

        });
        this.$button.on('tap', ()=>{
            if(loginModal.$button.hasClass(this.options.button.disableCls)){
                return
            }
            loginModal.login();
        })
    }
    validate(filed){
        switch (filed){
            case 'phone':
                return this.phoneValidate()
            case 'code':
                return this.codeValidate()
            default:
                return this.codeValidate() && this.phoneValidate()
        }
    }
    phoneValidate(){
        this.phone = this.$iptPhone.val();
        const res = /^1[034578]\d{9}$/.test(this.phone);
        if(!res){
            this.showErr('手机号格式不正确')
        }
        return res
    }
    codeValidate(){
        this.code = this.$iptCode.val();
        const res = /^\d{4,6}$/.test(this.code);
        if(!res){
            this.showErr('验证码格式不正确')
        }
        return res;
    }
    sendCode(){
        if(!this.validate('phone')){
            return
        }
        this.$codeButton.addClass(this.options.code.disableCls).html(this.options.code.waitSend);
        $.post(this.options.codeUrl, {
            phone: this.phone
        }).then((res) =>{
            if(res.success){
                this.showErr(res.data)
                this.countdown();
            }else {
                this.showErr(res.message)
            }
        }, err=>{
            this.countdown();
        });
    }
    countdown(){
        this.time = 30;
        this.countdownItem()
        const d = setInterval(()=>{
            this.countdownItem()
            if(!this.time){
              clearInterval(d)
              this.$codeButton.html(this.options.code.sended).removeClass(this.options.code.disableCls);
            }
        }, 1000);
    }
    countdownItem(){
        this.time --
        const txt = this.options.code.sending.replace('{S}', this.time)
        this.$codeButton.html(txt);
    }
    login(){
        if(!this.validate()){
            return
        }
        const buttonOpt = this.options.button
        this.$button.addClass(buttonOpt.disableCls).html(buttonOpt.waitSend);
        $.post(this.options.loginUrl, {
            phone: this.phone,
            code: this.code
        }).then(res =>{
            this.$button.removeClass(buttonOpt.disableCls).html(buttonOpt.sended);
            if(res.success){
                this.options.success(res);
                this.hide();
            } else {
                this.showErr(res.message)
            }
        }, err =>{
            this.$button.removeClass(buttonOpt.disableCls).html('登录失败');
            this.options.error();
        })
    }


}
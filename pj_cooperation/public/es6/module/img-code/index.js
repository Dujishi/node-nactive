/**
 * @description
 * @author  yinshi
 * @date 17/5/31.
 */
import popup from '../popup';

const html = require('./index.html');

export default class ImageCodeModal extends popup {
    constructor(options = {}) {
        super({
            cls: 'code-box',
            html
        });
        const _opts = {
            success: $.noop,
            error: $.noop,
            loginUrl: '', // 登录的url地址
            codeUrl: '/feopen/login/code', // 获取验证码的地址
            button: {
                disableCls: 'disabled',
                waitSend: '领取中',
                sended: '领取'
            }
        };
        this.options = $.extend(true, _opts, options);
        this.init();
    }

    init() {
        this.$modal = this.$popup.find('.code-box');
        this.$iptCode = this.$modal.find('.code-ipt');
        this.$button = this.$modal.find('.popup-btn');
        this.$cancelBtn = this.$modal.find('.close');
        this.$imgCode = this.$modal.find('.img-code');
        this.addEvent();
    }
    addEvent() {
        const imageCodeModal = this;
        this.$imgCode.on('tap', () => {
            let src = this.$imgCode.attr('src');
            src = src.split('?')[0];
            src = `${src}?_=${(new Date()).getTime()}`;
            this.$imgCode.attr('src', src);
        });
        this.$button.on('tap', () => {
            if (imageCodeModal.$button.hasClass(this.options.button.disableCls)) {
                return;
            }
            const imgCode = this.$iptCode.val();
            if (!imageCodeModal.codeValidate()) {
                return;
            }
            imageCodeModal.options.receive(imageCodeModal.$button, imgCode.trim(), imageCodeModal.$imgCode, imageCodeModal);
        });
    }
    codeValidate() {
        this.code = this.$iptCode.val();
        const res = this.code.trim().length === 4 || this.code.trim().length === 3;
        if (!res) {
            this.showErr('验证码格式不正确');
        }
        return res;
    }
}

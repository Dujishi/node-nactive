/**
 * @description
 * @author  yinshi
 * @date 17/6/10.
 */
import ImageCodeModal from './module/img-code';

const Fixtip = require('@ui/fixtip');

/**
 * 图形验证码
 */
const imageCodeAction = (() => {
    let modal = null;
    return function (card) {
        if (!modal) {
            modal = new ImageCodeModal({
                receive($btn, imgCode, $imgCodeBtn, imageCodeModal) {
                    $btn.addClass('disabled');
                    $.post('pay', {
                        card,
                        imgCode
                    }).then((res) => {
                        $btn.removeClass('disabled');
                        if (res.success) {
                            imageCodeModal.hide();
                            location.href = `third?orderId=${res.data || ''}&card=${card}`;
                        } else {
                            new Fixtip({
                                msg: res.message
                            });
                        }
                        $imgCodeBtn.trigger('tap');
                    });
                    modal = null;
                }
            });
        }
        modal.show();
        return modal;
    };
})();

$(() => {
    const wx = window.wx || null;
    if (wx) {
        // 隐藏所有的分享入口
        wx.ready(() => {
            wx.hideAllNonBaseMenuItem();
            wx.hideOptionMenu();
        });
    }
    $('#nextButton').on('click', () => {
        const card = $('#cardBank').val();
        if (card.length < 13 || card.length > 19) {
            new Fixtip({
                msg: '请输入正确的卡号'
            });
            return;
        }
        imageCodeAction(card);
    });
});

class Win {
    constructor() {
        this.$modal = $('#modal-win');
        this.$title = this.$modal.find('.modal-new-title');
        this.$text = this.$modal.find('.modal-new-text');
        this.$btn = this.$modal.find('.modal-new-btn-text3');
        this.$btnsWrap = this.$modal.find('.modal-new-btns');
        this.$btnWrap = this.$modal.find('.modal-new-btn');
        this.$close = this.$modal.find('.modal-new-close');

        this.btnEvent = null;
        this.bindEvent();
    }
    setClose(state) {
        if (state) {
            this.$close.removeClass('hide');
        } else {
            this.$close.addClass('hide');
        }
        return this;
    }
    setTitle(title) {
        this.$title.html(title);
        return this;
    }
    setText(str, sub1, sub2, sub3) {
        if (!str) {
            // <span>10</span><span>元</span>
            let ct3 = '';
            if (sub3) {
                ct3 = `<p class="tips">${sub3}</p>`;
            }
            const ct = `<div class="packet-content">
                            <div class="packet">
                                <p>${sub1}</p>
                                <p>${sub2}</p>
                            </div>
                            ${ct3}
                        </div>`;
            str = ct;
        }
        this.$text.html(str);
        return this;
    }
    btnCtrl(number) {
        if (number === 1) {
            this.$btnsWrap.css({ display: 'none' });
            this.$btnWrap.css({ display: 'flex' });
        } else {
            this.$btnsWrap.css({ display: 'flex' });
            this.$btnWrap.css({ display: 'none' });
        }
    }
    setBtnText(btnTxt) {
        if (!btnTxt) {
            this.$btn.css({ display: 'none' });
            this.$btnsWrap.css({ display: 'none' });
            return this;
        }
        const btnTxtArr = [];
        if (btnTxt instanceof Array) {
            btnTxt.forEach((it) => {
                btnTxtArr.push(`<a href="javascript:;">${it}</a>`);
            });
            this.$btnsWrap.html(btnTxtArr.join(''));
            this.btnCtrl(2);
        } else {
            this.btnCtrl(1);
            this.$btn.css({ display: 'flex' });
            this.$btn.html(btnTxt);
        }
        return this;
    }
    bindEvent() {
        this.$btn.on('touchend', (e) => {
            e.preventDefault();
            if (this.btnEvent && this.btnEvent() !== false) {
                this.hide();
            }
            return false;
        });
        this.$close.on('touchend', (e) => {
            e.preventDefault();
            this.hide();
        });
        this.$btnsWrap.on('touchend', 'a', (e) => {
            e.preventDefault();
            const $this = $(e.target);
            const index = $this.index();
            if (this.btnEvent && this.btnEvent instanceof Array) {
                if (this.btnEvent[index]() !== false) {
                    this.hide();
                }
            }
            return false;
        });
        return this;
    }
    hide() {
        this.btnEvent = null;
        this.$modal.addClass('hide');
        return this;
    }
    show(fn) {
        if (fn) {
            this.btnEvent = fn;
        }
        this.$modal.removeClass('hide');
        return this;
    }
}

module.exports = new Win();

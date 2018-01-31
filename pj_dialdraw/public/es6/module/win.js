class Win {
    constructor() {
        this.$modal = $('#modal-win');
        this.$titleImg = this.$modal.find('.modal-new-title img');
        this.$text = this.$modal.find('.modal-new-text');
        this.$btn = this.$modal.find('.modal-new-btn-text3');
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
    setTitle(state) {
        if (state) {
            this.$titleImg.removeClass('hide');
        } else {
            this.$titleImg.addClass('hide');
        }
        return this;
    }
    setText(str, sub) {
        if (sub) {
            str += `<br /><span>${sub}<span>`;
        }
        this.$text.html(str);
        return this;
    }
    setBtnText(str) {
        this.$btn.html(str);
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

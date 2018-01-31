class Waves {
    constructor($btn, pageX, pageY) {  
        this.$btn = $btn;
        this.$waves = null;
        this.dura = 1000;
        this.create(pageX, pageY);
        this.show();

        setTimeout(() => {
            this.hide(() => this.destroy());
        }, this.dura);
    }
    create(pageX, pageY) {
        const $btn = this.$btn;
        const offset = $btn.offset();
        const $anim = $('<div class="waves-animation"></div>');
        $anim.css({
            top: pageY - offset.top - ($btn.height() / 2),
            left: pageX - offset.left - ($btn.width() / 2),
        });
        this.$btn.append($anim);
        this.$anim = $anim;
        return this;
    }
    show() {
        setTimeout(() => {
            this.$anim.css({
                opacity: 1,
                '-webkit-transform': 'scale(2.5)',
            });
        }, 50);
        return this;
    }
    hide(fn) {
        this.$anim.css({ opacity: 0 });
        setTimeout(() => {
            if (fn) { fn(); }
        }, 750);
        return this;
    }
    destroy() {
        this.$anim.remove();
    }
}


module.exports = ($btn) => {
    $btn.addClass('waves').on('click', (e) => {
        const pageX = e.pageX;
        const pageY = e.pageY;
        new Waves($btn, pageX, pageY);
    });
};

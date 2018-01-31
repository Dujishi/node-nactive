class Win {
    constructor($win) {
        this.$win = $win;
        this.$box = $win.find('.win-box');

        const me = this;
        this.$win.find('[win-close]').on('click', () => {
            me.hide();
        });
    }
    show() {
        this.$win.removeClass('hide');
        setTimeout(() => {
            this.$box.removeClass('win-null');
        }, 10);
    }
    hide() {
        this.$box.addClass('win-null');
        setTimeout(() => {
            this.$win.addClass('hide');
        }, 300);
    }
}

module.exports = Win;

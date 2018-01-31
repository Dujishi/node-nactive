class IntervalCode {
    constructor($el) {
        this.$el = $el;
        this.maxCount = 30;
        this.currCount = this.maxCount;
        this.tapEvent = null;
        this.enable = true;
        this.template = '';
        this.innerHTML = $el.html();
        this.bindEvent();
    }
    onTap(fn) {
        this.tapEvent = fn;
    }
    setTemplate(str) {
        this.template = str;
    }
    startTask() {
        this.enable = false;
        this.$el.addClass('disable');
        this.task();
    }
    taskEndEvent() {
        this.currCount = this.maxCount;
        this.enable = true;
        this.$el.removeClass('disable');
        this.$el.html(this.innerHTML);
    }
    task() {
        this.currCount --;
        const str = this.template.replace('{time}', this.currCount);
        this.$el.html(str);
        if (this.currCount > 0) {
            setTimeout(() => {
                this.task();
            }, 1000);
        } else {
            this.taskEndEvent();
        }
    }
    bindEvent() {
        this.$el.on('tap', () => {
            if (!this.enable) {
                return;
            }
            this.tapEvent();
        });
    }
}

module.exports = IntervalCode;

require('@ui/preload/src/loader');

class Preload extends mo.Loader {
    constructor(res, opts) {
        super();
        this.res = res;
        this.opts = opts;
        this.init();
    }
    init() {
        const defaults = {
            loadType : 0,
            minTime : 0,
            onLoading : (count, total) => {
                const percent = parseInt(count/total*100, 10);
                $('.ui-preload-percent').html(percent + '%');
                this.rolling(percent);
            }
        };

        this.settings = $.extend({}, defaults, this.opts);
        mo.Loader.call(this, this.res, this.settings);
        // this.render();
    }
    rolling(percent) {
        if (percent <= 50) {
            $('.ui-preload-left').css({
                '-webkit-transform': 'rotate(' + 3.6 * percent + 'deg)'
            })

            $('.ui-preload-right').css({
                'display': 'none'
            });
        } else {
            $('.ui-preload-left').css({
                '-webkit-transform': 'rotate(180deg)'
            });

            $('.ui-preload-right').css({
                'display': 'block',
                '-webkit-transform': 'rotate(' + 3.6 * (percent - 50) + 'deg)'
            });
        }
    }
    render() {
        var template = [
            '<div class="ui-preload">',
                '<div class="ui-preload-main">',
                    '<div class="ui-preload-ring"></div>',
                    '<div class="ui-preload-left"></div>',
                    '<div class="ui-preload-cover"></div>',
                    '<div class="ui-preload-right"></div>',
                '</div>',
                '<div class="ui-preload-percent">0%</div>',
            '</div>'
        ];
        $('body').append(template.join(''));
    }

}

module.exports = Preload;

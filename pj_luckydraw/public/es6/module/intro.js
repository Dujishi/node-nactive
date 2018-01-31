/**
 * @description 加载动画效果
 * @author  yinshi
 * @date 16/11/24.
 */


const Time = {
    delayShow: 2000, // 第一次进来加载延迟
    shakeTime: 1000, // 车震时间
    secEnterDelay: 0, // 第二屏展示延迟
    fightTime: 2100,  // 打架时间
};

exports.start = (cb) => {
    const $loading = $('#loading');
    const $enterFirst = $('#enterFirst');
    const $enterSecond = $('#enterSecond');
    let isEnd = false
    $loading.remove();
    $enterFirst.removeClass('hidden').addClass('animation');

    let timeend=null
    $enterSecond.on('webkitAnimationEnd animationEnd', () => {
        // $enterFirst.addClass('hidden').hide()
        $enterSecond.removeClass('get-in').addClass('animation');

        timeend=setTimeout(() => {
            end()
        }, Time.fightTime);
    });

    function end() {
        $enterSecond.removeClass('get-in animation');
        if(isEnd){
            return
        }
        isEnd = true

        if (cb) {
            cb();
        }
    }

    $enterFirst.on('click',function (e) {
        if(e.target === this){
            return
        }
        $enterFirst.addClass('get-bigger');
        setTimeout(() => {
            $enterFirst.removeClass('animation');
            $enterSecond.addClass('get-in').removeClass('hidden');
        }, Time.secEnterDelay);
    })
    $enterSecond.on('click','.intro-fight',function () {
        clearTimeout(timeend);
        end();
    })
};

exports.destroy = () => {
    $('.intro-animation').remove();
};


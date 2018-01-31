const createFullpageAnimate = require('@ui/fullpage-animate');

const defaultOption = {
    container : '.page-inner',
    animationTime : 1000,
    loop      : false,
    beforeMove: function (index, count, $pages) {
        // if (index == 0) {
        //     $('section').eq(index + 2).css('display', 'block');
        //     // $pages[1].css('display', 'block');
        // }
        // console.log(index)
        // console.log(count)
        // console.log($pages.eq(0).text())
    },
    afterMove : function (index, count, $pages) {

    }
}
// defaultOption 可以为空
const fullpageAnimate = createFullpageAnimate(defaultOption);

$('button').click(function() {
    $.post('/nactive/valentine170207/test', {}, function(res) {
        console.log(res);
    });
    // $('section').eq(2).css('display', 'block');
    // fullpageAnimate.next();
})
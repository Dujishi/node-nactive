/**
 * 合并图片的任务
 * Created by 银时 on 2016/9/1.
 */
const gulp = require('gulp');
const spritesmith = require('gulp.spritesmith');


const SpritesMap = [
    // ['loading', 'loading-*.png', ''],
    // ['intro-car', 'intro-car-*.png', ''],
    // ['intro-fight', 'intro-fight-*.png', ''],
    ['icon-kouqi', 'kouqi-*.PNG', ''],
];

SpritesMap.forEach((arr) => { spriteImg(...arr); });
// let watchImgPath= ['./pj_luckydraw/public/images-tiny/**/*.@(png|jpg)'];
// let watchJpegPath= ['./pj_luckydraw/public/images-src/**/*.jpg'];
(function () {
    const tasks = SpritesMap.map(arr => `Sprite:${arr[0]}`);
    // 第二页图片合并
    gulp.task('Sprite-illegal', gulp.series(tasks));
    // gulp.task('jpegMin',function () {
    //     return gulp.src(watchJpegPath)
    //         .pipe(imagemin([imagemin.jpegtran({progressive:true})]))
    //         .pipe(gulp.dest('./pj_illegal160826/public/images'));
    // });
    // gulp.task('imagemin',function () {
    //     return gulp.src(watchImgPath)
    //         .pipe(imageResize({
    //             imageMagick:true,
    //             width: '80%'
    //         }))
    //         .pipe(imagemin())
    //         .pipe(gulp.dest('./pj_illegal160826/assets/images'));
    // });
}());

/**
 * 合并图片文件
 * @param name
 * @param imgs
 * @param destUrl
 * @constructor
 */
function spriteImg(name, imgs, destUrl) {
    const ImgPath = './pj_luckydraw/public/images/';
    let SpriteImgPath = [];
    if (Array.isArray(imgs)) {
        SpriteImgPath = imgs.map(img => ImgPath + img);
    } else if (typeof imgs === 'string') {
        SpriteImgPath.push(ImgPath + imgs);
    } else {
        // gutil.log('Imgs Url\'s type need to be Array or String')
    }
    gulp.task(`Sprite:${name}`, () =>
         gulp.src(SpriteImgPath)
        // .pipe(imageResize({
        //     width:'80%'
        // }))
            .pipe(spritesmith({
                imgName: `${name}.png`,
                cssName: `${name}-sprite.less`,
                padding: 5,
                imgOpts: {
                    quality: 80,
                },
            }))
            .pipe(gulp.dest(`${ImgPath}merge/${destUrl}`))
    );
}

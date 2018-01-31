const gulp   = require('gulp');
const fs     = require('fs');
const path   = require('path');
const gutil  = require("gulp-util");
const less   = require('gulp-less');
const cssmin = require('gulp-cssmin');
const plumber = require('gulp-plumber');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const del    = require('del');
const rev    = require('gulp-rev');
const revReplace = require('gulp-rev-replace');
const replace = require('gulp-replace');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const base64 = require('gulp-base64'); //base64处理

const pj_prefix = 'pj_';
let config = {
    'int' : 'https://test-store.ddyc.com/res/nactive',
    prod  : 'https://store.ddyc.com/res/nactive'
}
let suffix = '.@(jpeg|png|webp|gif|svg|jpg|JPG|JPEG|mp3|mp4|eot|woff|ttf)';

var env = require('minimist')(process.argv.slice(2));
env.project = env.project || 'cooperation';
if(!env.project){
    gutil.log('请指定运行项目名称的参数 例如：--project=xxx');
    return ;
}

function getProject(){
    return pj_prefix + env.project;
}

// require('./pj_luckydraw/task/sprite')
/****************************************
 *  开发环境 : gulp dev --project=xxx
 ****************************************/
let watchJsPath = ['./' + getProject() + '/public/es6/**/*.js'];
let watchCssPath= ['./' + getProject() + '/public/less/**/*.less'];

//本地图片合并任务
// require('./pj_illegal160826/tasks/sprite');

function taskLess() {
    return gulp.src(watchCssPath)
        .pipe(plumber())
        .pipe(less({
            paths: [ path.join(__dirname, './node_modules')]
        })).on('error', gutil.log)
        .pipe(postcss([autoprefixer(['iOS >= 7', 'Android >= 4.1'])]))
        .pipe(base64({
            maxImageSize: 15*1024, // bytes
        }))
        .pipe(gulp.dest('./'+ getProject() +'/public/css'));
}

function taskWebpack(callback){
    let conf = webpackConfig({
        project : env.project
    });
    if(env._[0] != 'dev'){
        conf.devtool = null;
    }
    webpack(conf, function (err, stats) {
        if(err) throw new gutil.PluginError('webpack', err);
        gutil.log('[webpack]', stats.toString({}));
        callback();
    });
}

gulp.task('dev', gulp.series(taskLess , taskWebpack ,function () {
    gulp.watch(watchCssPath, taskLess);
    gulp.watch(watchJsPath, taskWebpack);
}));

/******************************************
 *   生产环境 gulp build --env=last/prod --project=xxx
 ******************************************/

/**
 * 获取img / link / script / background 表达式
 * @return object 返回正则表达式
 */
function getRegExp(){
    return {
        common:/(<(?:(?:img)|(?:link)|(?:script)){1}[^>]+(?:(?:src)|(?:href)){1}\s*=\s*['"])(\/)pj_([^'"]+)public\/([^'"]+)(['"])/gim,
        backgroundUrl:/((?:(?:url)|(?:src)){1}\s*\(\s*['"]?)(\/)pj_([^)]+)public\/([^)]+)(['"]?)/gim,
        publicPath:new RegExp('/'+getProject()+'/public/','gim')
    };
}

function taskCleanBuild(callback) {
    del([
        `./build/${getProject()}`
    ]).then(function (paths) {
        gutil.log('Deleted file and folders:\n', paths.join('\n'));
        callback();
    });
}

function taskCleanEnd(callback) {
    del([
        './build1',
        './build/views'
    ]).then(function (paths) {
        gutil.log('Deleted file and folders:\n', paths.join('\n'));
        callback();
    });
}

function taskCleanViews(callback){
    del([
        './'+ getProject() +'/views'
    ],{ force: true}).then(function (paths) {
        gutil.log('Deleted file and folders:\n', paths.join('\n'));
        callback();
    });
}

function taskRevJs(){ // 依赖taskWebpack
    return gulp.src([
        './'+ getProject() +'/public/js/**/*.js'
    ])
        .pipe(uglify())
        .pipe(rev())
        .pipe(replace(getRegExp().publicPath,config[env.env]+"/"+env.project+'/'))
        .pipe(gulp.dest('./build1/'+ env.project +'/js'))
        .pipe(rev.manifest('./build/manifest.json',{
            base : './build',
            merge : true
        }))
        .pipe(gulp.dest('build'));
}

function taskRevRes() {
    return gulp.src(['./'+getProject()+'/public/**/*'+suffix])
        .pipe(rev())
        .pipe(gulp.dest('./build/'+env.project))
        .pipe(rev.manifest('./build/manifest.json',{
            base : './build',
            merge: true
        }))
        .pipe(gulp.dest('build'));
}

function taskRevCss() { // 依赖less
    let manifest = gulp.src('./build/manifest.json');

    return gulp.src([
        './'+ getProject() + '/public/css/**/*.css'
    ])
        .pipe(replace(getRegExp().backgroundUrl,"$1"+config[env.env]+"$2$3$4$5"))
        .pipe(revReplace({manifest:manifest}))
        .pipe(cssmin())
        .pipe(rev())
        .pipe(gulp.dest('build/'+ env.project + '/css'))
        .pipe(rev.manifest('./build/manifest.json',{
            base : './build',
            merge : true
        }))
        .pipe(gulp.dest('build'));
}

function taskRevReplace() {
    let manifest = gulp.src('./build/manifest.json');

    return gulp.src([
        './'+ getProject() + '/views/**/*.html'
    ],{base: './'+ getProject() +'/views'})
        .pipe(revReplace({manifest:manifest}))
        .pipe(gulp.dest('./build/views'));
}

function taskRevReplaceJs() {
    let manifest = gulp.src('./build/manifest.json');

    return gulp.src([
        './build1/**/*.js'
    ])
        .pipe(revReplace({manifest:manifest}))
        .pipe(gulp.dest('./build/'));
}


function taskMoveViews() {
    return gulp.src('./build/views/**/*.html', {base: 'build/views'})
            .pipe(replace(getRegExp().common,"$1"+config[env.env]+"$2$3$4$5"))
            .pipe(replace(getRegExp().publicPath,config[env.env]+"/"+env.project+'/'))
            .pipe(gulp.dest('./'+ getProject() +'/views'));
}

function getCopyDir(){
    let retDirs = ['./*'];
    const dirs =  fs.readdirSync('./');
    dirs.forEach(function(dir){
        if(dir.indexOf(pj_prefix) === 0){
            if(dir === getProject()){
                retDirs.push(dir+"/**/*");
            }else{
                retDirs.push('!./'+dir);
            }
        }else{
            if(dir.indexOf('.')===-1 && dir != 'build'){
                retDirs.push(dir+"/**/*");
            }
        }
    });
    retDirs.push('!./build');
    retDirs.push('!./'+getProject()+'/public/**/*');
    return retDirs;
}


gulp.task('default',gulp.series(getCopyDir));

gulp.task('build', gulp.series(
    taskCleanBuild,
    taskRevRes,
    //taskRevLib,
    gulp.series(taskWebpack, taskRevJs),
    gulp.series(taskLess, taskRevCss),
    taskRevReplace,
    taskRevReplaceJs,
    taskCleanViews,
    taskMoveViews,
    taskCleanEnd)
);

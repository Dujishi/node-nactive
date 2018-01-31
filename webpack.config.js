const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

function extend(o, c, defaults) {
    // no "this" reference for friendly out of scope calls
    if (defaults) {
        apply(o, defaults);
    }
    if (o && c && typeof c == 'object') {
        for (var p in c) {
            o[p] = c[p];
        }
    }
    return o;
}
let getAllFiles = function (root) {
    var res = [], files = fs.readdirSync(root);
    files.forEach(function (file) {
        var pathname = root + '/' + file;
        var stat = fs.lstatSync(pathname);

        if (!stat.isDirectory()) {
            if (path.extname(pathname) === '.js') {
                res.push(pathname);
            }
        }
    });
    return res;
};

let generateEntrys = function (root) {
    var entrys = {};

    var paths = getAllFiles(root);
    for (var i = 0; i < paths.length; i++) {
        var item = paths[i];
        var name = path.basename(item, '.js');
        entrys[name] = './' + item;
    }
    return entrys;
};

function getFolder(pj) {
    return 'pj_' + pj;
}

module.exports = function (conf) {
    let inputDir = path.join(getFolder(conf.project), 'public', 'es6');
    let outputDir = path.join(getFolder(conf.project), 'public', 'js');
    return {
        devtool: 'source-map', // 正式环境需要关闭
        entry: extend(generateEntrys(inputDir), {

        }),

        output: {
            path: outputDir,
            publicPath: outputDir,
            filename: "[name].js"
        },
        module: {
            loaders: [
                {test: /\.css$/, loader: "style-loader!css-loader!postcss-loader"},
                {test: /\.less$/, loader: "style-loader!css-loader!less-loader!postcss-loader"},
                {test: /\.jsx?$/, loader: "babel-loader", query: {presets: ['es2015']}},
                {test: /\.html?$/, loader: "html-loader"}
            ]
        },
        resolve: {
            modulesDirectories: ['node_modules', './' + getFolder(conf.project)]
        },
        babel: {
            presets: ['es2015'],
        }
    }
}

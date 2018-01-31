// require("babel-register")({
//     presets : ['stage-3'],
//     ignore  : function(filename){
//         if ( filename.indexOf('node_modules') >= 0 && filename.indexOf('@server') <0 ) {
//             return true;
//         }
//         return false;
//     }
// });

require('./app/app');

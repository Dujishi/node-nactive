/**
 * @description
 * @author  yinshi
 * @date 16/10/20.
 */

require("babel-core/register")({
    presets : ['stage-3']
});

const  addRedis=require('./addRedis');
const  key='seckill161016';


const list = require('./userids');


addRedis.addQualified(key,list.split('\n')).then(function (data) {
    console.log(data);
});


// addRedis.addWhitelist(key,['3694001']);
/**
 * @description
 * @author  yinshi
 * @date 16/12/12.
 */

require("babel-register")({
    presets : ['stage-3'],
    ignore  : function(filename){
        if ( filename.indexOf('node_modules') >= 0 && filename.indexOf('@server') <0 ) {
            return true;
        }
        return false;
    }
});
const  soaApi = require('@server/soa-api');
const  soa = require('../../config/soa');
const redisHost =require('../../config/redis')
const redis = require('@server/redis');
redis.init(redisHost('int'));
const soaModel = require('@server/model-soaapi')
soaModel.init(soa('int'),{
    xkzone:'newcar'
});

const listService = require('../service/listService')

listService(30012).then(function (data) {
    console.log(data);
});

//
// const orderService = require('../service/orderService')
// orderService(30012,'好孩子',13738171416,'杭州市','S520010').then(function (data) {
//     console.log(data)
// })
//
// const prepayService = require('../service/prepayService');
//
// prepayService(30012,'S520010','121.00','31.00').then(function (data) {
//     console.log(data);
// });
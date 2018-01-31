/**
 * @description
 * @author  yinshi
 * @date 17/6/1.
 */


const goods = require('../config').goods
const redis = require('@server/redis')
const response = require('@util/response-json')

exports.get = async function (ctx) {
    ctx.body = response.json_success([{
        id: '2014',
        title: '壳牌红壳',
        originPrice: '120',
        price: 48,
        logo: '//store.ddyc.com/res/xkcdn/icons/cooperations/k12140.jpg',
        discount: '4折'
    },{
        id: '2015',
        title: '壳牌黄壳',
        originPrice: 150,
        price: 75,
        logo: '//store.ddyc.com/res/xkcdn/icons/cooperations/k12141.jpg',
        discount: '5折'
    },{
        id: '2016',
        title: '嘉实多佳力',
        originPrice: 130,
        price: 52,
        logo: '//store.ddyc.com/res/xkcdn/icons/cooperations/k12142.jpg',
        discount: '4折'
    },{
        id: '2017',
        title: '嘉实多银嘉护',
        originPrice: 160,
        price: 80,
        logo: '//store.ddyc.com/res/xkcdn/icons/cooperations/k12143.jpg',
        discount: '5折'
    }]);
}
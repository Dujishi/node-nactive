/**
 * @description
 * @author  yinshi
 * @date 16/12/8.
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
const  config = require('../../../config/soa');
soaApi.init(config('inta'));

const listService = require('../../service/listService')

const  expect = require('chai').expect;

describe('获取商品列表',function () {
    it('用户未登录的时候',function (done) {
        listService().then(function (data) {
            console.log(data);
            done();
        })
    })
})
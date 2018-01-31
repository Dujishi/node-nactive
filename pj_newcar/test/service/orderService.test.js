/**
 * @description 预定信息接口
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
const  config = require('../../../config');
const redis = require('@server/redis');
soaApi.init(config.soaHost,{
    xkzone:'newcar'
});
redis.init(config.redis);

const orderService = require('../../service/orderService');
const  expect = require('chai').expect;
describe('预约购车信息',function () {
    it('未登录的时候，提示错误信息',function (done) {
        orderService().then(data=>{
            expect(data.code).to.be.equal(-1);
            done()
        });
    });
    it('姓名为空的时候，提示为空',function (done) {
        orderService(3212,'  ').then(data=>{
            expect(data.code).to.be.equal(40001);
            done()
        });
    });
    it('手机号格式错误，提示手机号错误',function (done) {
        orderService(3212,'梁庆荣','12312').then(data=>{
            expect(data.code).to.be.equal(40002);
            done()
        });
    });
    it('城市为空的时候，提示城市错误',function (done) {
        orderService(3212,'梁庆荣','13738171416').then(data=>{
            expect(data.code).to.be.equal(40003);
            done()
        });
    });
    it('商品code错误时候，提示商品错误',function (done) {
        orderService(3212,'梁庆荣','13738171416','杭州市','').then(data=>{
            expect(data.code).to.be.equal(40004);
            done()
        });
    });
    it('信息正确的时候，显示正确信息',function (done) {
        orderService(3212,'梁庆荣','13738171416','杭州市','S50010','长安马自达').then(data=>{
            expect(data.success).to.be.equal(true);
            done()
        });
    })
});
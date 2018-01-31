/**
 * @description
 * @author  yinshi
 * @date 16/12/13.
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
soaApi.init(config.soaHost);
redis.init(config.redis)
const wantedService = require('../../service/wantedService')

const  expect = require('chai').expect;


describe('选择想要的车型',function () {
    it('用户未登录',function (done) {
        wantedService({
            userId:undefined
        }).then(function (data) {
            expect(data.code).to.be.equal(-1);
            done();
        })
    });
    it('姓名未填写',function (done) {
        wantedService({
            userId:1212,
            userName:'  ',
        }).then(function (data) {
            expect(data.code).to.be.equal(40001);
            done();
        })
    })
    it('手机号格式错误',function (done) {
        wantedService({
            userId:1212,
            userName:'好人',
            phone:'123412'
        }).then(function (data) {
            expect(data.code).to.be.equal(40002);
            done();
        })
    })

    it('城市信息未填写',function (done) {
        wantedService({
            userId:1212,
            userName:'好人',
            phone:'13738171416',
            citys:'',
        }).then(function (data) {
            expect(data.code).to.be.equal(40003);
            done();
        })
    });

    it('车型未选择',function (done) {
        wantedService({
            userId:1212,
            userName:'好人',
            phone:'13738171416',
            city:'杭州市',
            modelName: '',
            modelId: ''
        }).then(function (data) {
            expect(data.code).to.be.equal(40005);
            done();
        })
    });

    it('信息填写完全正确',function (done) {
        wantedService({
            userId:1212,
            userName:'好人',
            phone:'13738171416',
            city:'杭州市',
            modelName: '别克',
            modelId: '1212'
        }).then(function (data) {
            expect(data.success).to.be.equal(true);
            done();
        })
    });
})
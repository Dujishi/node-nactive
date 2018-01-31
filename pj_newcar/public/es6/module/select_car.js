const Select = require('@ui/select');
const Fixtip = require('@ui/fixtip');
//const request = require('@util/native-bridge/lib/request');

function isOk(ret){
    if (ret.success && ret.data) {
        return true;
    }
    new Fixtip({
        msg : ret.message || ret.msg || '网络错误'
    });
    return false;
}

class SelectCar{
    constructor(){
        this.value = new Array(3);
        this.selectBrand = new Select({ title : '选择品牌'});
        this.selectBrand.setRenderMap({
            name : 'brandName',
            key  : 'alphaCode',
            icon : 'icon'
        });
        this.selectSeries= new Select({ title : '选择车系', stopRenderKey: true});
        this.selectSeries.setRenderMap({ name : 'seriesName'});
        this.selectModel = new Select({ title : '选择车型', stopRenderKey: true});
        this.selectModel.setRenderMap({ name :  'modelName'});
        this.bindEvent();
        this.onTapEvent = null;
    }
    setBrandData(){
        return $.ajax({
            url : '/feopen/illegal/brand',
            type: 'POST',
            data: {
                pageNumber : 1,
                pageSize   : 1000
            }
        }).then( ret => {
            if (isOk(ret)) {
                this.selectBrand.setData(ret.data);
            }
        });
    }
    setSeriesData(brandId){
        return $.ajax({
            url : '/feopen/illegal/series',
            type: 'POST',
            data: {
                pageNumber : 1,
                pageSize   : 1000,
                brandId    : brandId
            } 
        }).then( ret => {
            if (isOk(ret)) {
                this.selectSeries.setData(ret.data);
            }
        });
    }
    setModelData(seriesId){
        return $.ajax({
            url  : '/feopen/illegal/model',
            type :'POST',
            data : {
                pageNumber : 1,
                pageSize   : 1000,
                seriesId   : seriesId
            }
        }).then( ret => {
            if (isOk(ret)) {
                this.selectModel.setData(ret.data);
            }
        });
    }
    showModel(){
        this.selectModel.show();
        return this;
    }
    onTap(fn){
        this.onTapEvent = fn;
        return this;
    }
    show(){
        this.value = new Array(3);
        this.selectBrand.show();
        return this;
    }
    hide(){
        this.selectBrand.hide();
        this.selectSeries.hide();
        this.selectModel.hide();
        this.value = new Array(3);
        return this;
    }
    destroy(){
        this.selectBrand.destroy();
        this.selectSeries.destroy();
        this.selectModel.destroy();
    }
    bindEvent(){
        this.selectBrand.onTap( v => {
            this.value[0] = v;
            this.setSeriesData(v.brandId).then(() => {
                this.selectSeries.show();
            });
        });
        this.selectSeries.onTap( v => {
            this.value[1] = v;
            this.setModelData(v.seriesId).then(() => {
                this.selectModel.show();
            });
        });
        this.selectModel.onTap( v => {
            this.value[2] = v;
            if (this.onTapEvent) {
                this.onTapEvent.call(this,this.value);
            }

            this.hide();
        });
    }
}

let selectCar ;
module.exports = function(){
    if (!selectCar) {
        selectCar = new SelectCar();
    }
    return selectCar;
};
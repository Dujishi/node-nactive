/**
 * @description 获取商品信息
 * @author  yinshi
 * @date 16/12/14.
 */

const soaModel = require('@server/model-soaapi');
const keys = require('../config/key');
const redis = require('@server/redis');
const response = require('@util/response-json');
exports.get = async function (ctx) {
    const goodsCode = ctx.query.goodsCode;
    const cacheProduct = await redis.hget(keys.cacheProducts(),goodsCode);
    if(cacheProduct){
        ctx.body =response.json_success(JSON.parse(cacheProduct));
        return
    }
    const goodsRes = await soaModel.commodity.selectCommodityByCodes([goodsCode]);
    if(goodsRes.success === false){
        ctx.body= goodsRes
        return
    }
    const goodsData = goodsRes.data[0];
    if(!goodsData){
        ctx.body = response.json_err('获取不到该商品',40040);
        return
    }
    goodsData.commodityAttrs.forEach(attr=>{
        switch (attr.attrName){
            case '官方指导价':
                const zd =( attr.attrValue / 10000 ).toFixed(2);
                commodity.originPrice = zd+'万';
                break;
            case '典典售价':
                const dd =( attr.attrValue / 10000 ).toFixed(2);
                commodity.seckillPrice = dd+'万';
                commodity.ddPrice = attr.attrValue;
                break;
            case '配置':
                goodsData.props = attr.attrValue.split('|');
                break;
            case  '颜色':
                goodsData.color = attr.attrValue;
                break;
            case  '描述':
                goodsData.description = attr.attrValue;
                break
        }
    });
    goodsData.commodityAttrs && delete  goodsData.commodityAttrs;
    ctx.body = response.json_success(goodsData);
}

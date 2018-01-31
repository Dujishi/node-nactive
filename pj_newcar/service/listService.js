/**
 * @description
 * @author  yinshi
 * @date 16/12/8.
 */
const soaModel = require('@server/model-soaapi');
const keys = require('../config/key');
const redis = require('@server/redis');
const response = require('@util/response-json');
const env = require('../../config').env;
module.exports=async function (userId) {
    let goodsList;
    const cacheProduct = await redis.lrange(keys.cacheProductsList(),0,-1);
    const lvCode = env === 'prod'? 'SC1300002': 'SC1320003';
    // const cacheProduct = [];
    if(cacheProduct.length){
        goodsList = cacheProduct.map(pro=>JSON.parse(pro));
    }else{
        //获取商品列表
        const goodsListResult = await soaModel.commodity.selectCommodityByLv2Code(lvCode);

        //如果结果返回错误，则直接返回错误信息，说明服务挂了，挂了就显示错误信息；
        if(goodsListResult.success === false){
            return goodsListResult;
        }
        goodsList = goodsListResult.data;
        // 格式化商品数据
        goodsList = goodsList.map(commodity=>{
            commodity.commodityAttrs.forEach(attr=>{
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
                        commodity.props = attr.attrValue.split('|');
                        break;
                    case  '颜色':
                        commodity.color = attr.attrValue;
                        break;
                    case  '描述':
                        commodity.description = attr.attrValue;
                        break
                }
            });
            delete  commodity.commodityAttrs;
            return commodity;
        });
        //设置缓存内容
        await  redis.del(keys.cacheProductsList());
        await  redis.lpush(keys.cacheProductsList(),...goodsList.map(list=>{
            return JSON.stringify(list)
        }));
        redis.expire(keys.cacheProductsList(), 60 * 60 * 24);

        //缓存数据
        const obj = {};
        goodsList.forEach(list=>{
            obj[list.commodityCode]=JSON.stringify(list)
        });
        redis.hmset(keys.cacheProducts(),obj);
        redis.expire(keys.cacheProductsList(), 60 * 60 * 24);
    }




    //获取商品Codes
    const goodsCodes = goodsList.map(commodity=>commodity.commodityCode);

    // 服务不通 先注释了丫的 =====
    // 获取库存列表
    const stockResult = await soaModel.stock.getStockByCodes(1,goodsCodes);

    //如果库存出错，则返回库存错误信息
    if(stockResult.success === false){
        return stockResult
    }


    const  stock = stockResult.data;

    //如果库存不为空的时候
    if(stock){
        goodsList = goodsList.map(item=>{
            const stockObj = stock.filter(st=>st['commodityCode']===item['commodityCode'])[0]
            item.stock = stockObj?stockObj.useCount : 0
            item.lockedStock = stockObj?stockObj.employCount : 0
            return item
        });
    }


    //如果登录了则获取登录的信息
    if(userId){
        //获取用户预约的信息列表
        const orderCodes =  await redis.sinter(keys.orderUser(userId));
        if(orderCodes){

            //获取是否预约过
            goodsList = goodsList.map(item=>{
                item.isOrderd = orderCodes.indexOf(item.commodityCode) !== -1;
                return item
            });

            //    获取用户是否下过单
            const paidResult = await soaModel.morderSoa.userOrderByGoodscode(userId,orderCodes);

            //如果服务器报错，返回错误信息
            if(paidResult.success === false){
                return paidResult
            }

            //获取是否支付过，完成
            goodsList = goodsList.map(item=>{
                item.isPaid = paidResult.data[item.commodityCode] || false;
                return item
            })
        }

    }

    //获取推荐商品Codes
    const recommendCodes = await  redis.sinter(keys.recommend());

    //获取推荐列表
    const recommendList = goodsList.filter(commodity=>
    recommendCodes.indexOf(commodity.commodityCode) !== -1)
        .map(list=>{
            list.commodityImgs = list.commodityImgs.map(img=>{
                //通过又拍云API处理图片大小
                img.imgUrl = img.imgUrl+ '!'+ list.commodityCode+img.imgSeq+'/fw/480';
                return img
            })
            return list;
        });


    const goods = goodsList.filter(commodity=>
    recommendCodes.indexOf(commodity.commodityCode) === -1)
        .map(list=>{
            list.thumbImg = list.thumbImg + '!'+ list.commodityCode+'thumbImg/fw/240';
            list.commodityImgs = list.commodityImgs.map(img=>{
                img.imgUrl = img.imgUrl+ '!'+ list.commodityCode+img.imgSeq+'/fw/240';
                return img
            });
            return list;
        });
    //返回订单数据内容
    return response.json_success({
        recommend: recommendList,
        goods: goods
    })
}
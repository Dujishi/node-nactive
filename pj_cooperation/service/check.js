/**
 * @description
 * @author  yinshi
 * @date 17/6/12.
 */

const service = require('./index');
const response = require('@util/response-json');
const isstart = require('./isstart')
module.exports = async function (userId, cardNo, valid) {
    if(!isstart()){
        return  response.json_err('十点以后开抢，请稍后再来');
    }
    if(valid){
        const validCard = await service.checkCard(cardNo);
        if(!validCard){
            return response.json_err('您输入的卡号不是浦发银行信用卡，请检查后重新输入', 40001);
        }
    }
    const result = await service.check(userId, cardNo);
    if(!result.success){
        return result
    }

    const orderResult = await service.checkExistOrder(userId);
    if(!orderResult.success){
        return orderResult
    }
    if(orderResult.data){
        return response.json_success(orderResult.data)
    }


    if(!result.data){
        return response.json_err('您本月已经抢购了2次', 40002);
    }
    // if(result.data === 2){
    //     return response.json_err('当前卡号已经参与了两次，换张卡吧', 40003);
    // }
    return response.json_success(true)
}
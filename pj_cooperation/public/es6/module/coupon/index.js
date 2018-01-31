/**
 * @description
 * @author  yinshi
 * @date 17/6/1.
 */

// import Yibao from './yibao'
import Coupon from './coupon'

const yibao = 'YIBAO';
const coupon = 'COUPON';
import loading from '@ui/loading/wloading'
export default class {
    constructor(options = {}){
        this.options = options;
        this.isYb = 1;
        this.couponId = null;
    }
    // get first (){
    //   if(!this[yibao]){
    //       this[yibao] = new Yibao({
    //           mksure:(result)=>{
    //               console.log(result);
    //               this.isYb = result;
    //               this.second.show();
    //           }
    //       })
    //   }
    //   return this[yibao]
    // }
    get second(){
        if(!this[coupon]){
            this[coupon] = new Coupon({
                mksure:(id)=>{
                    this.couponId = id;
                    this.receive();
                }
            })
        }
        return this[coupon]
    }
    receive(){
        loading.show();
        $.post('/nactive/cooperation/receive', {
            couponId: this.couponId,
            yb: this.isYb
        }).then(res =>{
            loading.hide();
            if(res.success){
                this.options.success? this.options.success() : location.href = '/feopen/user_center/index#coupon/tianjin';
            }else {
                this.second.showErr(res.message);
                this.second.show();
            }

        }, err =>{
            loading.hide();
        });
    }
    doAction(){

       this.second.show();
    }
}
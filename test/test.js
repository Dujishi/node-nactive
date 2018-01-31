/**
 * @description
 * @author  yinshi
 * @date 17/6/13.
 */


const redis = require('@server/redis');
const config = require('../config');

// redis.init(config.redis);


redis.set('cooperation:spdbcard',
    `356474
356850
356851
356852
377185
377186
377187
404738
404739
418152
433645
456418
478060
498451
512451
515672
517650
525998
530975
550216
622176
622177
622228
622276
622277
622693
625831
625957
625958
625970
625971
625993
628222`).then(res=>{
    console.log(res)
})

redis.get('cooperation:spdbcard').then(res=>{
    console.log(res)
})
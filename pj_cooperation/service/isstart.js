/**
 * @description
 * @author  yinshi
 * @date 17/6/14.
 */


module.exports = function () {
    const now = new Date();
    // 十点之前不允许抢
    console.log(now.getHours());
    if (now.getHours() < 10) {
        return false;
    }
    return true;
}
;

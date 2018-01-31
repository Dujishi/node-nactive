/**
 * @description
 * @author  yinshi
 * @date 16/11/28.
 */


exports.hidePhone = function hidePhone(phone) {
    return `${phone.slice(0, 3)}****${phone.slice(7)}`;
};

exports.addZero = function addZero(num) {
    return num >= 10 ? num : `0${num}`;
};
exports.addZero1000 = function addZero1000(num) {
    return num >= 10 ? num >= 100 ? num : `0${num}` : `00${num}`;
};

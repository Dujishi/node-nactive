/**
 * 通过自定义属性，校验form表单数据
 * data-validtype  校验类型
 * data-errmsg     错误提示文案
 */
function isNotEmpty(v) {
    return !!v;
}
function isPhone(val) {
    return /^1\d{10}$/.test(val);
}
function isCode(val) {
    return /\d{4}/.test(val);
}
function checkItem($item) {
    const val = $item.val().trim();

    switch ($item.data('validtype')) {
    case 'empty': {
        if (!isNotEmpty(val)) {
            $item.addClass('error');
            return $item.data('emptymsg') || $item.data('errmsg');
        }
        break;
    }
    case 'phone': {
        if (!isPhone(val)) {
            $item.addClass('error');
            return $item.data('errmsg');
        }
        break;
    }
    case 'code': {
        if (!isCode(val)) {
            $item.addClass('error');
            return $item.data('errmsg');
        }
        break;
    }
    default:
        break;
    }
    $item.removeClass('error');
    return '';
}

class Valid {
    constructor($items) {
        this.$items = $items;
    }
    getErr() {
        for (let i = 0; i < this.$items.length; i++) {
            const $item = this.$items.eq(i);
            const err = checkItem($item);
            if (err) {
                return err;
            }
        }
        return '';
    }
    getFieldValue(fn) {
        const err = this.getErr();
        const ret = {};
        this.$items.each(function eachItem() {
            const $item = $(this);
            const key = $item.attr('name');
            const val = $item.val();
            ret[key] = val;
        });
        fn(err, ret);
    }
}

module.exports = Valid;

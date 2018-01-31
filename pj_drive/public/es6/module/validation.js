/**
 * 通过自定义属性，校验form表单数据
 * data-validtype  校验类型
 * data-errmsg     错误提示文案
 */
class Validation{
    constructor($items){
        this.$items = $items;
    }
    getErr(){
        for(let i=0; i< this.$items.length ; i++){
            let $item = this.$items.eq(i);
            let err = this.checkItem($item);
            if (err) {
                return err;
            }
        }
        return '';
    }
    checkItem($item){
        let val = $item.val().trim();

        switch( $item.data('validtype') ){
            case 'empty':
                if (!this.isNotEmpty(val)) {
                    $item.addClass('error');
                    return $item.data('emptymsg') || $item.data('errmsg');
                };
                break;
            case 'phone':
                if (!this.isPhone(val)) {
                    $item.addClass('error');
                    return $item.data('errmsg');
                };
                break;
            case 'id':
                if (!this.isID(val)) {
                    $item.addClass('error');
                    return $item.data('errmsg');
                };
                break;
        }
        if ($item.data('repeat')=='T') {
            let repeatErrMsg = this.checkRepeat($item);
            if (repeatErrMsg) {
                $item.addClass('error');
                return repeatErrMsg;
            }
        }
        $item.removeClass('error');
        return '';
    }
    isNotEmpty(v){
        return !!v;  
    }
    isPhone(val){
        return /^1\d{10}$/.test(val);
    }
    isID(val){
        return /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(val);
    }
    checkRepeat($item){
        let v = $item.val().trim();
        if (!this.isNotEmpty(v)) { return ''; }
        let group = $item.data('group');
        let $group = this.$items.filter('[data-group="'+group+'"]');
        let index = $group.index($item);
        let errMsg = '';
        $group.each(function(i) {
            if (i < index) {
                let that = $(this);
                let val = that.val().trim();
                if (v === val) {
                    errMsg = $item.data('repeat-errmsg') || $item.data('errmsg');
                }
            }
        });

        return errMsg;
    }
}

module.exports = Validation;
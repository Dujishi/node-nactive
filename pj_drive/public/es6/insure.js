const queryString = require('@util/string-util').queryString;
const Fixtip      = require('@ui/fixtip');
const utils       = require('./module/utils');
const getCommon   = require('./module/common');
const Validation  = require('./module/validation');
const ready       = require('@util/native-bridge/lib/ready');
const isLogin     = require('@util/native-bridge/lib/isLogin');

const proxyUrl  = CONF.uriProxy;
const detailUrl = CONF.uriDetail;

class FormMgr{
    constructor(count){
        if (count > 4) { count = 4;}
        let temp = $('#tpl_input').html();
        let htmlStr = '';
        for(let i = 0 ; i<count; i++){
            htmlStr += temp;
        }
        this.$wrap = $('.content');
        this.$wrap.append(htmlStr);

        this.$box = this.$wrap.find('.win-box');
        this.$valids = $('[data-validtype]');
        this.validation = new Validation(this.$valids);
        this.bindEvent();
        this.setLocalData();
    }
    initFormData(o){
        this.type = o.type;
        this.uuid = o.uuid;
    }
    setLocalData(arr){
        let $box = this.$box;
        try{
            let dataStr = localStorage.getItem('insure_data');
            if (dataStr) {
                let data = JSON.parse(dataStr);
                $box.each(function(i) {
                    let $item = $(this);
                    let dataItem = data[i];
                    if (dataItem) {
                        $item.find('[name="name"]').val(dataItem.name);
                        $item.find('[name="id"]').val(dataItem.id);
                    }
                });
            }
        }catch(e){
            console.log(e);
        }
        
    }
    save(){
        let data = this.serialize();
        try{
            localStorage.setItem('insure_data', JSON.stringify(data));
        }catch(e){
            console.log(e);
        }
        
    }
    serialize(){
        let ret = [];
        this.$box.each(function() {
            let $box = $(this);
            let obj = {};
            $box.find('[data-validtype]').each(function() {
                let that = $(this);
                let key  = that.attr('name');
                let value= that.val().trim();
                obj[key] = value;
            });
            ret.push(obj);
        });
        return ret;
    }
    bindEvent(){
        let $valids = this.$valids;
        let me = this;
        $valids.on('keydown',function() {
            $(this).removeClass('error');
            me.save();
        });
    }
    submit(){
        $.ajax({
            url : proxyUrl+'?k=insurance',
            type: 'POST',
            data : {
                type : this.type,
                uuid : this.uuid,
                ids  : JSON.stringify(this.serialize())
            }
        }).then(function(ret) {
            if (utils.isOk(ret)) {
                try{
                    localStorage.removeItem('insure_data');
                }catch(e){
                    console.log(e);
                }
                
                window.location.href = detailUrl;
            }
        });
    }
}

let opt = queryString.parse(window.location.search);
let common = getCommon().share();

$( () => {  
    let formMgr = new FormMgr(Number(opt.member));
    $('.container').removeClass('hide');

    $('.footer-btn').on('tap', function() {
        let err = formMgr.validation.getErr();
        if (err) {
            new Fixtip({msg : err});
        }else{
            formMgr.submit();
        }
    });

    if (CONF.isapp) {
        ready(info => {
            if(!isLogin()){ return ;}
            formMgr.initFormData({
                type: 'app',
                uuid: info.userId
            });

            _ax.push(['set', 'openid', info.userId]);
            _ax.push(['send']);
        });
    }else{
        formMgr.initFormData({
            type: 'wechat',
            uuid: CONF.openid
        });
    }
});
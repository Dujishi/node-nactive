const ready = require('@util/native-bridge/lib/ready');
const isLogin = require('@util/native-bridge/lib/isLogin');
const login = require('@util/native-bridge/lib/login');
const callShare = require('@util/native-bridge/lib/callShare');
const goToView = require('@util/native-bridge/lib/goToView');
const nativeBridge = require('@util/native-bridge');
const Fixtip = require('@ui/fixtip');
const Common = require('@util/common-page');
const CONF = window.CONF;

$(() => {
    const common = Common.create();
    const analytics = Common.analytics;
    let $messageBox = $('#messageBox');
    let AppInfo = nativeBridge.getAppInfoSync() || {};

    ready((info) => {
        AppInfo = info;
    });

    bindEvent();

    function sharePacket() {
        $.post('packet', {packet: 'oldcomer', phone: AppInfo.phone, userId: AppInfo.userId}, (res) => {
            if (res.success) {
                //红包发放成功！
                showSuccess();
                analytics.event('sharePacket', {isApp: true});
            } else {
                if (res.errCode == 'REPEAT_CODE') {
                    showAlready();
                } else {
                    new Fixtip({
                        msg: res.msg || res.message || '数据请求失败',
                    });
                }
            }
        });
    }

    function bindEvent() {

        $('#messageBox .tips-box-close').on('tap', () => {
            $messageBox.hide();
        });
        $('#tipsBtn').on('tap', () => {
            $('#tipsCon').fadeIn();
        });
        $('#tipsBoxClose').on('tap', () => {
            $('#tipsCon').hide();
        });
        $('#goBtn').on('tap', () => {
            if (CONF.isapp) {
                if (isLogin()) {
                    callShare({
                        url: CONF.shareUrl,
                        content: CONF.shareContent,
                        title: CONF.shareTitle,
                        subTitle: CONF.shareSubTitle,
                        image: CONF.shareImgUrl
                    }).then((ret) => {
                        if(ret.status==1){
                            sharePacket();
                        }else{
                            new Fixtip({msg: '分享未成功'});
                        }
                    })
                } else {
                    login().then((info) => {
                        AppInfo = info;
                        //bindEvent();
                    });
                }
            } else if (CONF.iswechat) {
                $('.share-mask').show().on({
                    'tap': () => {
                        $(this).hide();
                    }, 'touchstart': (e) => {
                        e.preventDefault();
                    }
                });
            }
        });
    }

    function showAlready() {
        $messageBox.find('.text').text('你已参加过该活动！');
        $messageBox.find('.btn').text('知道了').off('tap').on('tap', () => {
            $messageBox.hide();
        });
        $messageBox.fadeIn();
    }

    function showSuccess() {
        $messageBox.find('.btn').off('tap').on('tap', () => {
            goToView({
                id: 'ticketList',
            });
        });
        $messageBox.fadeIn();
    }

});

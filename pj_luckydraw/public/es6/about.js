const ready = require('@util/native-bridge/lib/ready');
const getCommon = require('./module/common');

const common = getCommon();
common.share();


ready((info) => {
    _ax.push(['set', 'openid', info.userId]);
    _ax.push(['send']);
});

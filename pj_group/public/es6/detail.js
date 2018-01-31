const Common = require('@util/common-page');
const common = Common.create();
require('@ui/lazyload');

$(() => {
    const analytics = Common.analytics;
    common.share(() => {});
    $('.lazy').lazyload();
});

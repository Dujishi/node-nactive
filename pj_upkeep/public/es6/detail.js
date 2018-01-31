const Common = require('@util/common-page');
require('@ui/lazyload');

$(() => {
    const common = Common.create();
    const analytics = Common.analytics;
    $('.lazy').lazyload();
});

const Common = require('@util/common-page');

$(() => {
    const common = Common.create();

    common.getLocation().then((res) => {
        alert(JSON.stringify(res));
    }).catch((error) => {
        alert('Error');
    });
});

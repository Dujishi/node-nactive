const Loading = require('@ui/loading/wloading');
const Fixtip = require('@ui/fixtip');
const Common = require('@util/common-page');

template.helper('imgSize', (url) => {
    return `${url.split('!')[0]}!/both/700x280/force/true`;
});

template.helper('dateFormat', (date) => {
    date = new Date(date);
    const toTen = (n) => {
        return (n >= 10) ? n : `0${n}`;
    };
    const map = {
        Y: date.getFullYear(),
        M: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        m: date.getMinutes(),
        s: date.getSeconds(),
    };
    return `${toTen(map.Y)}.${toTen(map.M)}.${toTen(map.d)} ${toTen(map.h)}:${toTen(map.m)}:${toTen(map.s)}`;
});

const getUserGroup = () => {
    Loading.show();
    $.post('/nactive/group/getTuanInfos', { status: 2 }, (res) => {
        Loading.hide();
        if (res.success) {
            if (res.data && res.data.length > 0) {
                const html = template('group-item-tpl', res.data);
                $('#groupWrap').append(html).show();
            } else {
                $('.no-data').show();
            }
        } else {
            new Fixtip({ msg: res.message || res.msg });
            if (res.code == -200) {
                window.location.href = `${window.location.origin}/feopen/login/index?url=${window.location.href}`;
            }
        }
    });
};

$(() => {
    const common = Common.create();
    const analytics = Common.analytics;
    common.share(() => {});
    getUserGroup();
});

const Fixtip = require('@ui/fixtip');
const Loading = require('@ui/loading/wloading');


function toast(msg) {
    new Fixtip({ msg });
}

function ajax({ url, type, data }) {
    Loading.show();
    return new Promise((reslove, reject) => {
        $.ajax({
            url,
            type,
            data
        }).then((res) => {
            Loading.hide();
            if (res.success) {
                reslove(res.data);
            } else {
                toast(res.message || '请求出错');
                reject();
                return;
            }
        });
    });
}

class Service {
    get(url, data) {
        return ajax({ url, type: 'get', data });
    }

    post(url, data) {
        return ajax({ url, type: 'post', data });
    }
}

module.exports = new Service();

const login = require('@util/native-bridge/lib/login');

const ready = require('@util/native-bridge/lib/ready');


/**
 * 登录
 * @param {Function} fn
 */
const loginAction = () => {
    if (window.CONF.isapp) {
        ready(() => {
            login().then((info) => {
                window.location.href = `${window.location.href}?userId=${info.userId}`;
            });
        });
    } else {
        window.location.href = `/feopen/login/index?url=${encodeURIComponent(window.location.href)}`;
    }
};

export default loginAction;

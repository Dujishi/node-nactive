module.exports = function (env) {
    const config = {
        prod: 'https://payaccount.ddyc.com',
        pre: 'https://payaccount.ddyc.com',
        int: 'http://int.xiaokakeji.com:8091',
        intc: 'http://intc.xiaokakeji.com:8091'
    };

    return config[env] || config.int;
};

const redis = require('@server/redis');
const crypto = require('crypto');

exports.get = async function (ctx, next) {
    const tmpArr = [
        // 'xiaoka',
        'qbtest',
        ctx.query.timestamp,
        ctx.query.nonce
    ];
    tmpArr.sort();
    const tmpStr = tmpArr.join('');
    const shasum = crypto.createHash('sha1');
    shasum.update(tmpStr);
    await ctx.render('/pj_demo/views/index');
};

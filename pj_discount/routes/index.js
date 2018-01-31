const soaApi = require('@server/soa-api');
const validation = require('@util/validation');

exports.get = async function (ctx) {
    await ctx.render('/pj_discount/views/index', {});
};


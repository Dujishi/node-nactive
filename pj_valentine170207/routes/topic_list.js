const redis = require('@server/redis');
const response = require('@util/response-json');
const utils = require('../utils');

exports.post = async function(ctx) {
    const body = ctx.request.body;
    const openid = body.openid;
    const matchList = utils.getMatchList(openid);
    const data = await matchList.getData(1);

    data.forEach((v, i) => {
        data[i].score = v[openid];
    });

    ctx.body = response.json_success(data);
};

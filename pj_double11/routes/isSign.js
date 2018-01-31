const response = require('@util/response-json');

exports.post = async (ctx) => {
    const userId = ctx.session.userId;
    if (!userId) {
        ctx.body = response.json_success(0);
        return;
    }


    ctx.body = response.json_success(1);
};

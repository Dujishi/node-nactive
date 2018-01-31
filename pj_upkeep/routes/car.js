const carModel = require('@server/model/carModel');

exports.post = async function(ctx) {
    const userId = ctx.request.body.userId;
    const defaultCar = await carModel.getDefaultCar(userId);
    ctx.body = defaultCar;
};

const soaApi = require('@server/soa-api');

exports.post = async function (ctx) {
    let body = ctx.request.body;
    //const lon = body.lon || '30.288973';
    //const lat = body.lat || '120.089225';
    // const pageNumber = 1;
    // const pageSize = 10;
    body.userId = ctx.session.userId || ctx.headers.userid;
    const shopResult = await soaApi('shop-car/shopSearchService/searchNearbyCareShop', body);
    console.log('searchNearbyCareShop: ',shopResult);
    ctx.body = shopResult;
};

const redis = require('@server/redis');


function getPrizeName(data) {
    const arr = data.split('|');
    return arr[0];
    // switch (arr[0]) {
    // case 'wash_0':
    //     return '0元洗车';
    // case 'wash_10':
    //     return '10元欧式精洗';
    // case 'gas_10':
    //     return '10元加油卡红包';
    // case 'ticket':
    //     return '电影票';
    // default:
    //     return '保险';
    // }
}

// 获取中奖列表数据的页面

exports.get = async function(ctx) {
    const list = await redis.lrange('node_dialdraw:prize', 0, 325);
    const data = {
        wash_0: 0,
        wash_10: 0,
        gas_10: 0,
        ticket: 0,
        insure: 0
    };
    list.forEach((item) => {
        data[getPrizeName(item)] ++;
    });
    // await ctx.render('/pj_dialdraw/views/scan', {
    //     data
    // });
};


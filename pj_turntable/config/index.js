module.exports = {
    statusMap: {
        0: '今日抽奖次数已用完，去获取更多资格吧~',
        1: '可以抽奖',
        '-1': '服务器繁忙，请稍候重试',
    },
    // 奖品兑换码
    prizeMap: {
        // 10元路飞燃油宝红包
        prize_1: {
            code: '912cj10rybhb',
            name: '10元路飞燃油宝红包'
        },
        // 20元德国清洗油红包
        prize_2: {
            code: '912cj20qxyhb',
            name: '20元德国清洗油红包'
        },
        // 20元德国轮胎红包
        prize_3: {
            code: '912cj20lthb',
            name: '20元德国轮胎红包'
        },
        // 20元机油保养红包
        prize_4: {
            code: '4ffj90pwwwd',
            name: '20元机油保养红包'
        },
        // 神秘红包
        prize_5: '',

        // 谢谢惠顾
        prize_6: ''
    },

    // 概率 全红包时
    chances: {
        prize_1: 10,
        prize_2: 20,
        prize_3: 30,
        prize_4: 40,
        // prize_5: 70,
        prize_6: 100
    },

    // 概率 有实物时
    chances2: {
        prize_1: 10,
        prize_2: 20,
        prize_3: 30,
        prize_4: 40,
        // prize_5: 70,
        prize_6: 95,
        sw: 100
    }

    // chances2: {
    //     sw: 100
    // }
};


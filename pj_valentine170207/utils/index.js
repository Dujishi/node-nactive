const RedisPage = require('@server/redis/page');

module.exports = {
    redisKey(key) {
        return `valentine170207:${key}`;
    },
    getMatchList(openid) {
        return new RedisPage({
            prefix: this.redisKey('openid'),
            key: `${openid}:matchlist`,
            pagesize: 30
        });
    },
    getMatchScore(topics1, topics2) {
        let matchArr = [];
        topics1 = topics1.split(',');
        topics2 = topics2.split(',');

        matchArr = topics1.filter((v, i) => {
            return v === topics2[i];
        });

        return parseInt((matchArr.length / topics1.length) * 100, 10);
    },
    getCountryRank() {
        return new RedisPage({
            prefix: this.redisKey('phone'),
            key: 'country',
            pagesize: 10
        });
    },
};

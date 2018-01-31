/**
 * @description
 * @author  yinshi
 * @date 16/11/23.
 */


module.exports = {
    /**
     * 活动的key
     * @param activeName
     * @param key
     * @return {string}
     */
    activeKey(activeName, key) {
        return `luckyDraw:${activeName}:${key}`;
    },
    /**
     * 活动黑名单
     * @param activeName
     * @return {*|string}
     */
    blackList(activeName) {
        return this.activeKey(activeName, 'blackList');
    },
    /**
     * 活动支付用户集合
     * @param activeName
     * @return {*|string}
     */
    payMemberList(activeName) {
        return this.activeKey(activeName, 'payMemberList');
    },
    /**
     * 支付用户信息表
     * @param activeName
     * @param userId
     * @return {string}
     */
    payMemberInfo(activeName, userId) {
        return `${this.activeKey(activeName, 'payMemberInfo')}:${userId}`;
    },
    /**
     * 冗余数据信息
     * @param activeName
     * @param currentNumber
     * @return {string}
     */
    participantsList(activeName, currentNumber) {
        return `${this.activeKey(activeName, 'participantsList')}:${currentNumber}`;
    },
    /**
     * 抽奖码池子
     * @param activeName
     * @param currentNumber
     * @return {string}
     */
    lotteryPool(activeName, currentNumber) {
        return `${this.activeKey(activeName, 'lotteryPool')}:${currentNumber}`;
    },
    /**
     * 抽中人员信息列表
     * @param activeName
     * @return {*|string}
     */
    lotteryWinnerInfo(activeName) {
        return this.activeKey(activeName, 'lotteryWinnerInfo');
    },
    /**
     * 活动总轮数
     * @param activeName
     * @return {*|string}
     */
    totalNumber(activeName) {
        return this.activeKey(activeName, 'totalNumber');
    },
    /**
     * 活动当前轮数
     * @param activeName
     * @return {*|string}
     */
    currentNumber(activeName) {
        return this.activeKey(activeName, 'currentNumber');
    },
    /**
     * 订单列表
     * @param activeName
     * @return {*|string}
     */
    orderMemberList(activeName) {
        return this.activeKey(activeName, 'orderMemberList');
    },

    codeBindUserid(activeName, current) {
        return this.activeKey(activeName, `codeBindUserid:${current}`);
    },
};

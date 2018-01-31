// 配置活动信息
const active = {
    title: 'iWatch 2 秒杀活动',
    banner: '//store.ddyc.com/res/xkcdn/seckill/161124/banner.jpg',
    start_time: '2016-12-16 10:00:00',

    notLoginText: '成功在线充值加油卡即可获得秒杀资格',
    noQualificationText: '在线充值加油卡即可获得资格',

    goto_text: '去充值',
    goto_url_app: 'ddyc://oilcard/oilCardRecharge', // app跳转地址，可以是SchemeUrl或者goToView桥接方法的id
    goto_url_wechat: 'http://dl.ddyc.com/',         // 微信跳转地址

    share_icon: 'http://store.ddyc.com/res/xkcdn/seckill/161124/share.jpg',
    share_title: '用典典养车加油卡充值，秒杀apple watch！',
    share_content: '用典典养车加油，从此无需带现金，VIP还享98折，即日起充值，还可赢取apple watch大奖！'
};

// 配置产品信息
const product = {
    title: 'Apple Watch Series 2',
    product: 'iWatch 2',
    origin_price: '2888',
    seckill_price: 0,
    stock: 1,
    logo: "//store.ddyc.com/res/xkcdn/seckill/161124/product.png"
};

// 配置秒杀规则
const rule = `
    <ol>
        <li><span>1.</span> 2016年12月12日0时至2016年12月16日10时在典典养车APP成功在线充值加油卡，且未主动发起退款的用户，即可参与秒杀；</li>
        <li><span>2.</span> 秒杀开始时间：2016年12月16日10时整；</li>
        <li><span>3.</span> 秒杀页面入口在典典养车APP首页；</li>
        <li><span>4.</span> 客服将于秒杀结果公布后的两个小时内联系秒杀成功的用户领取奖品，并在24小时内快递寄出；</li>
        <li><span>5.</span> 活动奖品由典典养车APP提供，与设备生产商公司无关；</li>
        <li><span>6.</span> 在法律允许的范围内，典典养车有最终解释权；</li>
    </ol>
`;

// 白名单的userId，找灿烂或者运营人员要
const whiteList = [2532773];

// 具有秒杀资格的userId测试数据，可以不用填
const qualitifyList = [];

module.exports = {
    active,
    product,
    rule,
    whiteList,
    qualitifyList
}
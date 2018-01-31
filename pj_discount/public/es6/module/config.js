// bannerImage banner图片
// backgroundColor 背景颜色
// rules 活动规则，不填默认不展示
// showUtit 是否显示单位
// hasReducePrice 是否显示“立省xxx元”文案
// isSingle 是否是单个商品，主要用来区分单个商品和套餐，套餐会有多个子商品，文案部分会有多列

const config = {
    default: {
        bannerImage: '/pj_discount/public/images/banner/default.jpg',
        backgroundColor: '#8b0000',
        rules: `
            <li>1.支付成功即送洗美红包，红包可全额抵扣。</li>
            <li>2.洗美红包使用期限1个月，限洗美类目下商品使用。</li>
            <li>3.洗美红包多买多送，上不封顶。</li>
        `,
        showUnit: true,
    },
    20171019: {
        bannerImage: '/pj_discount/public/images/banner/20171019.png',
        backgroundColor: '#f7dbc4',
        showUnit: false,
        hasReducePrice: true,
    },
    20171117: {
        bannerImage: '/pj_discount/public/images/banner/2017111701.png',
        backgroundColor: '#dd4245',
        showUnit: false,
        hasReducePrice: false,
        isSingle: true,
    },
};


module.exports = config;

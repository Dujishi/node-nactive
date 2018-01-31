export default function payment(type, lat, lon, commodityCode, careShopId, goodsItem) {
    let goodsItems = '';


    if (goodsItem) {
        goodsItem = goodsItem.split(',');

        goodsItems = goodsItem.map(item => `${item}|1`);
        goodsItems = goodsItems.join(',');
    }

    let source = '&source=1';

    if (window.CONF.isapp) {
        source = '&source=2';
    }

    let isSupportPreSale = '';
    if (type === 1) {
        isSupportPreSale = 1;
    }


    const params = `goodsCode=${commodityCode}&shopId=${careShopId}&lat=${lat}&lon=${lon}${source}&tradeOrderGoodsPartParam=${goodsItems}&isSupportPreSale=${isSupportPreSale}`;
    window.location.href = `/payment/prepay?${params}`;
}

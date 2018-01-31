const Fixtip = require('@ui/fixtip');
const Ajax = require('./module/service.js');
const FormatDate = require('./module/time');
import * as nativeBridge from '@util/native-bridge';

function Toast(msg) {
    new Fixtip({ msg });
}

let id;
const exchangeId = getQueryString('exchangeId');

const ajaxUrl = {
    getData: '/nactive/storePacket/getData',
    getMoney: '/nactive/storePacket/getMoney',
};


const getBgImg = (i) => {
    switch (i % 4) {
    case 0:
        return 'http://img01.active.xiaokakeji.com/yyzc/201710/59e723475c463.jpg';
    case 1:
        return 'http://img01.active.xiaokakeji.com/yyzc/201710/59e7235e08c16.jpg';
    case 2:
        return 'http://img01.active.xiaokakeji.com/yyzc/201710/59e7259594273.jpg';
    case 3:
        return 'http://img01.active.xiaokakeji.com/yyzc/201710/59e725d0b3d73.jpg';
    default:
        return 'http://img01.active.xiaokakeji.com/yyzc/201710/59e725d0b3d73.jpg';
    }
};

const setData = (datas) => {
    let liStr = '';
    let bgImg = '';
    let validTime = '';
    for (let i = 0, len = datas.length; i < len; i++) {
        const btnText = datas[i].isCard === 1 ? '已领取' : '立即领取';
        bgImg = getBgImg(i);
        validTime = datas[i].validDays ? `领取后${datas[i].validDays}天内有效` : `${FormatDate(datas[i].startTime)} - ${FormatDate(datas[i].endTime)}`;
        liStr += `<li>
					<div class="card-content" style='background:url(${bgImg});background-size:100% 100%;'>
						<p class="card-price">
							<span>${datas[i].amount}</span>元
						</p>
						<p class="card-name">${datas[i].name}</p>
						<p class="card-time">可用时间：${validTime}</p>
					</div>
				</li>`;
    }
    $('#page-list').html(liStr);
};

// 获取红包数据
const getData = (shopId, exchangeId) => {
    Ajax.post(ajaxUrl.getData, { shopId, exchangeId }).then((data) => {
        if (data.got) {
            $('.get-all-btn').text('已领取');
        } else {
            $('.get-all-btn').text('一键领取');
        }
        setData(data.bonusList);
    });
};

// 领取红包
const getMoney = (id, exchangeId) => {
    if ($('.get-all-btn').text() == '已领取') {
        return;
    }
    Ajax.post(ajaxUrl.getMoney, { id, exchangeId }).then(() => {
        Toast('领取成功');
        $('.get-all-btn').text('已领取');
	  });
};


$('.get-all-btn').on('click', () => {
    getMoney(id, exchangeId);
});


(function () {
    nativeBridge.ready((info) => {
        id = info.shopId || 0;
        getData(id, exchangeId);
    });
}());

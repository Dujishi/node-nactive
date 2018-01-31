const wechatApi = require('@server/wechat');

async function main() {
    const auth = wechatApi.getOauth();
    const userInfo = await auth.getUserByCode('0216yxkp0ImBMs1ogljp0wBdkp06yxks');
    console.log(userInfo);
}

main();

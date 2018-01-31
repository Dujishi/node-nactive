/**
 * @description
 * @author yeyang
 * @date 17/8/7.
 */
const Captchapng = require('captchapng');


exports.get = async function (ctx) {
    const code = '0123456789';
    const length = 4;
    let randomcode = '';
    for (let i = 0; i < length; i++) {
        randomcode += code[parseInt(Math.random() * 1000) % code.length];
    }
    randomcode = parseInt(randomcode);

    ctx.session.spdbImageCode = `${randomcode}`;

   // 输出图片
    const p = new Captchapng(100, 36, randomcode); // width,height,numeric captcha
    p.color(245, 237, 238, 255);  // First color: background (red, green, blue, alpha)
    p.color(27, 56, 230, 255); // Second color: paint (red, green, blue, alpha)
    const img = p.getBase64();
    const imgbase64 = new Buffer(img, 'base64');

    ctx.type = 'image/png';
    ctx.body = imgbase64;
}
;

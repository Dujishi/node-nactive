const Koa = require('koa');
const logger = require('koa-logger');
const bodyparser = require('koa-bodyparser');
const router = require('@server/router');
const errHandler = require('@server/err-handler');
const koaSession = require('@server/middleware-session');
const statics = require('@server/static');
const render = require('@server/render');
const soaApi = require('@server/soa-api');
const config = require('../config');
const soaModel = require('@server/model-soaapi');

// open平台方法
const openModel = require('@server/model/open_api');
const loginInit = require('@server/service-login');

const app = new Koa();

app.proxy = (config.env !== 'dev'); // 如果是本地就设置代理
/**
 * common module init
 */
openModel.init(config.openPlatform);

/**
 * middleware config
 */
app.use(errHandler(async function(errCode, ctx) {
    await ctx.render('/views/error', { errCode });
}, {
    channel: 'node-nactive'
}));
app.use(koaSession({
    debug: config.env !== 'prod'
}));
if (config.env !== 'prod' && config.env !== 'pre') {
    const testPartition = require('@server/test-partition');
    // 测试环境特有配置
    app.use(statics(config.root)); // 静态文件服务器
    app.use(testPartition({
        soa: {
            host: require('@server/config/soa'),
            model: soaApi,
        },
        model: {
            host: require('@server/config/open'),
            model: openModel,
        },
        soaModel: {
            host: require('@server/config/soa'),
            model: soaModel,
        }
    }));
}
app.use(bodyparser());
app.use(logger()); // 日志

app.use(render(config.root, {
    autoescape: false,
    cache: config.env === 'prod' ? 'memory' : false,
}));

const dataSign = require('@server/datasign');
app.use(dataSign({
    secret: config.dataKey
}));
// 登录验证
app.use(loginInit({
    exclude: ['luckydraw', 'appinvite', 'hongbao20161031', 'drive',
        'cxxb160704', 'nationnactivity', 'seckill161016', 'storelist', 'valentine170207', 'actrbuessiness'
    ],
    debug: config.env === 'dev',
    pathPrefix: config.pathPrefix,
    rules: {
        '/nactive/sku/*': {
            needIntercept: true,
            loginUrl: '/feopen/login/index',
        },
        '/nactive/sku/index': {
            needIntercept: false
        },
        '/nactive/upkeep/shoplist': {
            needIntercept: true
        },
        '/nactive/avoidpolice/*': {
            needIntercept: false,
            wechat: {
                type: 'user'
            }
        },
        '/nactive/demo/presale': {
            needIntercept: true
        },
        '/nactive/luckpacket/*': {
            needIntercept: false,
            wechat: {
                type: 'user'
            }
        },
        '/nactive/mum/*': {
            needIntercept: config.env !== 'dev',
            wechat: {
                type: 'user'
            }
        }
    }
}));

router(app, { // 自定义路由
    root: config.root,
    project: config.project,
    pathPrefix: config.pathPrefix,
});

/**
 * server start
 */
app.listen(config.port, () => {
    const logInfo = `
/*****************************************
 * start listen port: ${config.port}
 * web root: ${config.root}
 * env: ${config.env}
 ****************************************/
    `;
    console.log(logInfo);
});

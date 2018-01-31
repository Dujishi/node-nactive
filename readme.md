## node-nactive

典典养车H5活动项目

### About

+ 服务端框架使用koa v2.0.0版本
+ 模板使用前后端通用的swig模板引擎[http://paularmstrong.github.io/swig/](http://paularmstrong.github.io/swig/)
+ 使用pm2管理进程 [https://github.com/Unitech/pm2](https://github.com/Unitech/pm2)
+ 通过pm2的扩展pm2-logrotate管理日志文件[https://github.com/pm2-hive/pm2-logrotate](https://github.com/pm2-hive/pm2-logrotate)
+ 为了兼容windows、mac和linux的文件系统，所有项目文件和文件夹命名，避免使用驼峰式命名法。名称全部字母小写，单词之间使用“_”连接。

### Install & UseAgent

需要安装nodejs，redis
```
git clone git@192.168.1.10:front/node-nactive.git
cd node-nactive
npm i

npm install pm2 -g          // 全局安装pm2
pm2 install pm2-logrotate   // 全局安装pm2-logrotate
pm2 set pm2-logrotate：retain 100   // 设置日志文件数量上限

/************************************************
 *   本地调试，需要启动gulp watch任务和nodejs服务
 ************************************************/
pm2 start pm2/dev.json
gulp dev --project=xxx


/**********************************************
 * prod 环境
 **********************************************/
gulp build --env=prod --project=xxx
pm2 start pm2/prod.json

```

### 目录结构介绍

+ app/         #应用入口文件
+ config/      #配置文件
+ lib/         #底层支持
+ pj_**/       #项目入口文件夹
+ |--public/      #项目css，js，images等静态资源
+ |----es6/
+ |----less/
+ |--routes/      #项目路由入口
+ |--views/       #项目html资源
+ |--service/     #项目服务层
+ |--util/        #项目独立使用的方法工具
+ views/       #全局html资源入口
+ |--layout    #全局公共模板,引入使用相对路径

#### 项目简介

### 注意事项

1. app端在GET请求时会在headers带入lat & lng参数，但是在POST请求时不会带入这两个参数
2. 手机号码校验，需要通过类似10112345678的测试帐号
3. 微信重定向得到的code只能使用1次，刷新当前页面第2次使用相同的code会报错，需要做try catch错误处理
4. 页面分享的icon图片地址，android微信端不支持https，需要将icon图片上传到[res-cdn](http://192.168.1.10/front/res-cdn)项目
5. 所有的路由规则使用小写规范
6. 由于微信域名的限制， 本项目和其他项目共用一个微信公众号配置， 统一的access_token由一个PHP进程管理

### 常用cdn

1. zepto-cus: //store.ddyc.com/res/xkcdn/zepto/v1.1.4/zepto.min.js
2. zepto-cus: //store.ddyc.com/res/xkcdn/zepto/v1.2.0/zepto.min.js (建议使用1.2.0版本)


### 参考文档

1. lodash 使用文档： [https://lodash.com/docs/4.16.4#ceil](https://lodash.com/docs/4.16.4)






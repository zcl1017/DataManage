const path = require('path');
module.exports = (app) => {
    // 配置静态根目录
    const koastatic = require('koa-static');
    app.use(koastatic(path.resolve(process.cwd(), './app/public')));
    // 模板渲染引擎
    const koaNunjucks = require('koa-nunjucks-2');
    app.use(koaNunjucks({
        ext: 'tpl',
        path: path.resolve(process.cwd(), './app/public'),
        nunjucksConfig: {
            noCache: true,
            trimBlocks: true
        }
    }));

    // 引入 ctx.body 解析中间件
    const bodyParser = require('koa-bodyparser');
    app.use(bodyParser({
        formList: '1000mb',
        enableType: ['form', 'json', 'text']
    }))

    // 引入异常捕获组件
    app.use(app.middlewares.errorHandler);

    // 签名合法性校验 （为设置请求有效期 判断签名是否在有效气内 无效则请求失效 避免恶意获取所有数据）
    app.use(app.middlewares.apiSignVerify);

    // 引入api参数校验
    app.use(app.middlewares.apiParamsVerify);
};
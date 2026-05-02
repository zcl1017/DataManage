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
};
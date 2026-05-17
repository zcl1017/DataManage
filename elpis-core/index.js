const Koa = require('koa');
const path = require('path');
const { sep } = path // 兼容不同系统的路径
const env = require('./env');

const middlewareLoader = require('./loader/middleware');
const configLoader = require('./loader/config');
const controllerLoader = require('./loader/controller');
const extendLoader = require('./loader/extend');
const routerLoader = require('./loader/router');
const serviceLoader = require('./loader/service');
const routerSchemaLoader = require('./loader/router-schema');


module.exports = {
    // 启动项目配置
    start(options = {}) {

        // koa实例
        const app = new Koa();
        // 应用配置
        app.options = options;
        console.log(app.options, 'app.options')
        // 基础路径
        app.baseDir = process.cwd();
        console.log(app.baseDir, 'baseurl')
        // 业务文件路径
        app.businessPath = path.resolve(app.baseDir, `.${sep}app`);
        console.log(app.businessPath, 'businessPath')
        app.env = env();
        console.log(`start-env ${app.env.get()}`)

        // 加载middleware 用于对文件路径的转换
        middlewareLoader(app);
        console.log(`-- [start] load middlewareLoader done --`);

        // 加载routerSchema
        routerSchemaLoader(app);
        console.log(`-- [start] load routerSchemaLoader done --`);


        // 加载controller
        controllerLoader(app);
        console.log(`-- [start] load controllerLoader done --`);


        // 加载service
        serviceLoader(app);
        console.log(`-- [start] load serviceLoader done --`);


        // 加载config
        configLoader(app);
        console.log(`-- [start] load configLoader done --`);


        // 加载extend
        extendLoader(app);
        console.log(`-- [start] load extendLoader done --`);


        // 注册全局中间件
        try {
            require(`${app.businessPath}${sep}middleware.js`)(app);
            console.log(`--[start] load appMiddleware done--`)
        } catch (error) {
            console.log('[excpetion] there is no global middleware.js file')
        }
        // 注册路由
        routerLoader(app);
        console.log(`-- [start] load routerLoader done --`);


        try {
            // 启动服务
            const port = process.env.PORT || 8081;
            const host = process.env.IP || '0.0.0.0';
            app.listen(port, host);
            console.log('77777', host, port)
        } catch (error) {
            console.error(error);
        }
        return app;
    }
}
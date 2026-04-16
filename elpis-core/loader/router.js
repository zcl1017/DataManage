
const KoaRouter = require('koa-router');
const glob = require('glob');
const path = require('path');
const { sep } = path;
/* 
* router loader
* @param {object} app koa 实例
* 解析所有app/router下的所有js文件 加载到loaRouter上
*/
module.exports = (app) => {
    // 获取路由文件地址
    const routerPath = path.resolve(app.baseDir, `.${sep}router`)

    // 实例化KoaRouter
    const router = new KoaRouter();

    // 注册所有路由
    const fileList = glob.sync(path.resolve(routerPath, `.${sep}**${sep}**.js`))
    fileList.forEach(file => {
        // 目的
        // module.exports = (app, router) => {
        // router.get('xxx/xx/xx/', xxxcontext);
        // }
        require(path.resolve(file))(app, router)
    });

    // 路由兜底
    router.get('*', async (cxt, next) => {
        cxt.status = 302; // 临时重定向
        cxt.redirect(`${app?.options?.homPage ?? '/'}`);
    })

    // ；路由注册到app上
    app.use(router.routes());
    app.use(router.allowedMethods());
}

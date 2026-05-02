const glob = require('glob');
const path = require('path');
const { sep } = path;
/* 
* middleware loader
* @param {object} app koa 实例
* 加载所有middleware ，可通过'app.middleware.${目录}.${文件}' 访问
* 
    例子：
    app/middleware
        |
        | -- custom-module
                |
                | -- custom-middleware.js
    => app.middlewares.customModule.customMiddleware
*
*/
module.exports = (app) => {
    // 读取 app/middleware/**/**.js 下所有的文件
    const middlewarePath = path.resolve(app.businessPath, `.${sep}middleware`)
    const fileList = glob.sync(path.resolve(middlewarePath, `.${sep}**${sep}**.js`));
    // 遍历所有文件 把内容加载到app.middlewares下
    const middlewares = {};
    fileList.forEach(file => {
        // 提取文件名称a
        let name = path.resolve(file);
        // 截取路径 eg:app/middlewares/custom-middleware.js=>custom-middleware-custom.js
        name = name.substring(name.lastIndexOf(`middleware${sep}`) + `middleware${sep}`.length, name.lastIndexOf('.'));
        // 把'-'统一改为驼峰，custom-module/custom-middleware.js => customModule.custom<iddleware
        name = name.replace(/[_-][a-z]/ig, (s) => s.substring(1).toUpperCase());
        // 挂载middleware到内容app对象中
        let tempMiddleware = middlewares;
        const names = name.split(sep);
        for (let i = 0, len = names.length; i < len; i++) {
            if (i === len - 1) {
                tempMiddleware[names[i]] = require(path.resolve(file))(app);
            } else {
                if (!tempMiddleware[names[i]]) {
                    tempMiddleware[names[i]] = {};
                }
                tempMiddleware = tempMiddleware[names[i]];
            }
        }
    });
    app.middlewares = middlewares;
}

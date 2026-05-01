const glob = require('glob');
const path = require('path');
const { sep } = path;
/* 
* controller loader
* @param {object} app koa 实例
* 加载所有controller ，可通过'app.controller.${目录}.${文件}' 访问
* 
    例子：
    app/controller
        |
        | -- custom-module
                |
                | -- custom-controller.js
    => app.controller.customModule.customController
*
*/
module.exports = (app) => {
    // 读取 app/controller/**/**.js 下所有的文件
    const controllerPath = path.resolve(app.businessPath, `.${sep}controller`)
    const fileList = glob.sync(path.resolve(controllerPath, `.${sep}**${sep}**.js`));
    // 遍历所有文件 把内容加载到app.controller下
    const controller = {};
    fileList.forEach(file => {
        // 提取文件名称a
        let name = path.resolve(file);
        // 截取路径 eg:app/controller/custom-controller.js=>custom-controller-custom.js
        name = name.substring(name.lastIndexOf(`controller${sep}`) + `controller${sep}`.length, name.lastIndexOf('.'));
        // 把'-'统一改为驼峰，custom-module/custom-controller.js => customModule.custom<iddleware
        name = name.replace(/[_-][a-z]/ig, (s) => s.substring(1).toUpperCase());
        // 挂载controller到内容app对象中
        let tempController = controller;
        const names = name.split(sep); // [customMudule(目录)， customController(文件)]
        for (let i = 0, len = names.length; i < len; i++) {
            if (i === len - 1) { // 文件
                // 之后每一个controller都是一个class 所以需要new
                const ControllerModule = require(path.resolve(file))(app);
                tempController[names[i]] = new ControllerModule();
            } else { // 文件夹
                if (!tempController[names[i]]) {
                    tempController[names[i]] = {};
                }
                tempController = tempController[names[i]];
            }
        }
    });
    app.controller = controller;
}

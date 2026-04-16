const glob = require('glob');
const path = require('path');
const { sep } = path;
/* 
* service loader
* @param {object} app koa 实例
* 加载所有service ，可通过'app.service.${目录}.${文件}' 访问
* 
    例子：
    app/service
        |
        | -- custom-module
                |
                | -- custom-service.js
    => app.service.customModule.customService
*
*/
module.exports = (app) => {
    // 读取 app/service/**/**.js 下所有的文件
    const servicePath = path.resolve(app.businessPath, `.${sep}service`)
    const fileList = glob.sync(path.resolve(servicePath, `.${sep}**${sep}**.js`));
    // 遍历所有文件 把内容加载到app.service下
    const service = {};
    fileList.forEach(file => {
        // 提取文件名称a
        let name = path.resolve(file);
        // 截取路径 eg:app/service/custom-service.js=>custom-service-custom.js
        name = name.substring(name.lastIndexOf(`service${sep}`) + `service${sep}`.length, name.lastIndexOf('.'));
        // 把'-'统一改为驼峰，custom-module/custom-service.js => customModule.custom<iddleware
        name = name.replace(/[_-][a-z]/ig, (s) => s.substring(1).toUpperCase());
        // 挂载service到内容app对象中
        let tempService = service;
        const names = name.split(sep); // [customMudule(目录)， customService(文件)]
        for (let i = 0, len = names.length; i < len; i++) {
            if (i === len - 1) { // 文件
                // 之后每一个service都是一个class 所以需要new
                const ServiceModule = require(path.resolve(file))(app);
                tempService[i] = new ServiceModule;
            } else { // 文件夹
                if (!tempService[name[i]]) {
                    tempService[i] = {};
                }
                tempService = tempService[name[i]];
            }
        }
    });
    app.service = service;
}

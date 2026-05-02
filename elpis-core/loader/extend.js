const glob = require('glob');
const path = require('path');
const { sep } = path;
/* 
* extend loader
* @param {object} app koa 实例
* 加载所有extend ，可通过'app.extend.${目录}.${文件}' 访问
* 
*    例子：
*   app/extend
*       |
*       | -- custom-extend.js
*   => app.extend.customExtend
*
*/
module.exports = (app) => {
    // 读取 app/extend/**js 下所有的文件
    const extendPath = path.resolve(app.businessPath, `.${sep}extend`)
    const fileList = glob.sync(path.resolve(extendPath, `.${sep}**${sep}**.js`));
    // 遍历所有文件 把内容加载到app.extend下
    fileList.forEach(file => {
        // 提取文件名称a
        let name = path.resolve(file);
        // 截取路径 eg:app/extend/custom-extend.js=>custom-extend
        name = name.substring(name.lastIndexOf(`extend${sep}`) + `extend${sep}`.length, name.lastIndexOf('.'));
        // 把'-'统一改为驼峰，custom-module/custom-extend.js => customModule.customExtend
        name = name.replace(/[_-][a-z]/ig, (s) => s.substring(1).toUpperCase());
        // 过滤app已经存在的key
        for (const key in app) {
            if (key === name) {
                console.log(`[extend load error] name:${name} is already in app`)
                return;
            }
        }

        // 挂载到extend 到 app
        app[name] = require(path.resolve(file))(app);
    });
}

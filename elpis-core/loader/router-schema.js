const glob = require('glob');
const path = require('path');
const { sep } = path;
/* 
* router-schema loader
* @params { object } app koa实例
* 通过 'josn-schema & ajv 对 API 规则进行约束，配合api-params-verify 中间件使用
*
* app/router-schema/**.js 
*
* 输出：
* app.rouSchema = {
*    '${api1}': ${jsonSchema},
*    '${api2}': ${jsonSchema}...
* } 
*/
module.exports = (app) => {
    // 读取 app/router-schema/**/**.js 下所有的文件
    const routerSchemaPath = path.resolve(app.businessPath, `.${sep}router-schema`)
    const fileList = glob.sync(path.resolve(routerSchemaPath, `.${sep}**${sep}**.js`));

    // 注册所有routerSchema 使得可以 ’app.routerSchema‘ 这样访问
    let routerSchema = {};
    fileList.forEach(file => {
        routerSchema = {
            ...routerSchema,
            ...require(path.resolve(file))
        }
    });
    app.routerSchema = routerSchema;
}

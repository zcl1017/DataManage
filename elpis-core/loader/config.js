const glob = require('glob');
const path = require('path');
const { sep } = path;
/* 
* @param {object} app koa实例
*
* 用于区分不同环境 测试/开发/正式 通过env读取不同环境文件配置 env.config
* 通过 env.config 去覆盖defult.config 加载到app.config
*
* 目录下对应的 config 配置
* 默认：config/config.default.js
* 本地配置：config/config.local.js
* 测试配置：config/config.beta.js
* 生产配置：config/config.prod.js
*
 */
module.exports = (app) => {
    // 找到config目录
    const configPath = path.resolve(app.baseDir, `.${sep}config`);

    // 获取default.config
    let defaultConfig = {};
    try {
        defaultConfig = require(path.resolve(configPath, `.${sep}config.default.js`))
    } catch (error) {
        console.log('[exception] there is no default.config.js file')
    }

    // 获取env.config
    let envConfig = {};
    try {
        if (app.env.isLocal()) {
            envConfig = require(path.resolve(configPath, `.${sep}config.local.js`));
        } else if (app.env.isBeta()) {
            envConfig = require(path.resolve(configPath, `.${sep}config.beta.js`));
        } else if (app.env.isProduction()) {
            envConfig = require(path.resolve(configPath, `.${sep}config.prod.js`));
            console.log('prod')
        }
    } catch (error) {
        console.log('[exception] there is no env.config.js file')
    }
    // 覆盖并加载config
    app.config = Object.assign({}, defaultConfig, envConfig);
}
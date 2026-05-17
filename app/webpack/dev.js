const express = require('express');
const path = require('path');
const consoler = require('consoler');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const webpack = require('webpack');

// 从webpack.dev.js获取webpack配置和devServer配置
const {
    webpackConfig,
    DEV_SERVER_CONFIG
} = require('./config/webpack.dev.js');

const app = express();

const compiler = webpack(webpackConfig);

// 指定静态文件目录
app.use(express.static(path.join(__dirname, '../public/dist')));

// 引用devmiddleware 中间件 （监控文件改动）
app.use(devMiddleware(compiler, {
    // 落地文件
    writeToDisk: (filePath) => filePath.endsWith('tpl'),
    // 资源路径
    publicPath: webpackConfig.output.publicPath,

    // headers配置
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    },

    // 打印日志颜色
    stats: true
}))
// 引用 hotmiddleware 中间件 (实现热更新通讯)
app.use(hotMiddleware(compiler, {
    path: `/${DEV_SERVER_CONFIG.HMR_PATH}`,
    log: () => { }
}))
consoler.info('请等待webpack初次构建完成提示。。。')

// 启动服务devserver
const port = DEV_SERVER_CONFIG.PORT;
app.listen(port, () => {
    console.log(`app listening on port ${port}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`端口 ${port} 已被占用，请先结束占用进程: netstat -ano | findstr :${port}`);
        process.exit(1);
    }
    throw err;
});
const path = require('path');
const merge = require('webpack-merge');
const HappyPack = require('happypack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const os = require('os');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CSSMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackInjectAttributesPlugin = require('html-webpack-inject-attributes-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
// 基类配置
const baseConfig = require('./webpack.base.js');
const webpack = require('webpack');

// devServer 配置
const DEV_SERVER_CONFIG = {
    HOST: '127.0.0.1',
    PORT: 9002,
    HMR_PATH: '__webpack_hmr', // 官方规定
    TIMEOUT: 20000
};

// 开发阶段的entry配置需要加入hmr
Object.keys(baseConfig.entry).forEach(v => {
    // 第三方包不作为hmr入口
    if (v !== 'vendor') {
        baseConfig.entry[v] = [
            // 主入口文件
            baseConfig.entry[v],
            // hmr 更新入口， 官方指定的hmr路径
            `webpack-hot-middleware/client?path=http://${DEV_SERVER_CONFIG.HOST}:${DEV_SERVER_CONFIG.PORT}/${DEV_SERVER_CONFIG.HMR_PATH}&timeout=${DEV_SERVER_CONFIG.TIMEOUT}&reload=true`
        ]
    }
})

const webpackConfig = merge.smart(baseConfig, {
    // 指定开发环境
    mode: 'development',
    // sourse-map 开发工具 呈现代码的映射关系， 便于开发中调试代码
    devtool: 'eval-cheap-module-source-map',
    output: {
        // 输出文件名
        filename: 'js/[name]_[chunkhash:8].bundle.js',
        // 输出路径存放位置
        path: path.join(process.cwd(), './app/public/dist/dev/'),
        // 公共文件存放位置
        publicPath: `http://${DEV_SERVER_CONFIG.HOST}:${DEV_SERVER_CONFIG.PORT}/public/dist/dev/`,
        globalObject: 'this'
    },
    // 开发阶段插件
    plugins: [
        // HotModuleReplacementPlugin 用于实现热模块替换
        // 模块热替换运行在项目运行时进行模块替换
        // 提升开发效率，让项目一直处于运行状态
        new webpack.HotModuleReplacementPlugin({
            multiStep: false,
        })
    ]
})

module.exports = {
    // webpack配置
    webpackConfig,
    // devservere配置， 暴露给dev.js使用
    DEV_SERVER_CONFIG
}
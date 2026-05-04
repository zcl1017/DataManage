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

// 多线程build设置
const happypackCommonConfig = {
    debug: false,
    threadPool: HappyPack.ThreadPool({ size: os.cpus().length })
}

// 生产环境 webpack配置
const webpackConfig = merge.smart(baseConfig, {
    // 指定生产环境
    mode: 'production',
    output: {
        // 输出文件名
        filename: 'js/[name]_[chunkhash:8].bundle.js',
        // 输出路径存放位置
        path: path.join(process.cwd(), './app/public/dist/prod'),
        // 公共文件存放位置
        publicPath: '/dist/prod',
        // 运行跨域
        crossOriginLoading: 'anonymous'
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: [
                MiniCssExtractPlugin.loader,
                'happypack/loader?id=css'
            ]
        }, {
            test: /\.js$/,
            // 仅对这些文件做解析编译 (业务代码 加快打包速度)
            include: [
                path.resolve(process.cwd(), './app/pages')
            ],
            use: {
                loader: 'happypack/loader?id=js'
            }
        }]
    },
    // webpack不会有大量hints信息
    performance: {
        hints: false,
    },
    plugins: [
        //每次 build前，清空 public/dist目录
        new CleanWebpackPlugin(['public/dist'], {
            root: path.resolve(process.cwd(), './app/public/dist/prod'),
            exclude: [],
            verbose: true,
            dry: false
        }),
        // 提取 css 的公共部分，有效利用缓存，(非公共部分使用 inline)
        new MiniCssExtractPlugin({
            chunkFilename: 'css/[name]_[contenthash:8].bundle.css',
        }),
        // 优化并压缩 css 资源
        new CSSMinimizerPlugin(),
        // 多线程打包JS，加快打包速度
        new HappyPack({
            id: 'js',
            loaders: [`babel-loader?${JSON.stringify({
                presets: ['@babel/preset-env'],
                plugins: [
                    '@babel/plugin-transform-runtime'
                ]
            })}`]
        }),
        // 多线程打包CSS，加快打包速度
        new HappyPack({
            id: 'css',
            loaders: [{
                path: 'css-loader',
                options: {
                    importLoaders: 1
                }
            }]
        }),
        // 浏览器在请求资源时不发送用户的身份凭证
        new HtmlWebpackInjectAttributesPlugin({
            crossorigin: 'anonymous'
        })
    ],
    optimization: {//清除 console.Log
        //使用 TerserWebpackPlugin 的并发和缓存，提升压缩阶段的性能
        // 清楚console.log
        minimize: true,
        minimizer: [
            new TerserWebpackPlugin({
                cache: true, // 启用缓存来加速构建速度
                parallel: true, // 利用多核cpu的优势来加速压缩速度
                terserOptions: {
                    compress: {
                        drop_console: true // 去除console打印
                    }
                }
            })
        ]
    }
});

module.exports = webpackConfig;
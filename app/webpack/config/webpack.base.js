const glob = require('glob');
const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const pageEntries = {};
const htmlWebpackPluginLst = [];

// 获取app/pages目录下所有的入口文件 （entry.xxx.js）
const entryList = path.resolve(process.cwd(), './app/pages/**/entry.*.js');
glob.sync(entryList).forEach(file => {
    const entryName = path.basename(file, '.js')
    // 构造entry
    pageEntries[entryName] = file;
    // 构造最终渲染的页面文件
    htmlWebpackPluginLst.push(
        // 辅助注入打包后的bundle文件到tpl文件中
        new HtmlWebpackPlugin({
            // 产物（最终模板）输出路径
            filename: path.resolve(process.cwd(), './app/public/dist', `${entryName}.tpl`),
            // 指定要使用的模板文件
            template: path.resolve(process.cwd(), './app/view/entry.tpl'),
            // 要注入的代码块
            chunks: [entryName]
        })
    );
});
/* 
* webpack配置
*/
module.exports = {
    // 入口配置
    entry: pageEntries,
    // 模块解析配置（决定了要加载解析哪些模块， 以及用什么方式去解析）
    module: {
        rules: [{
            test: /\.vue$/,
            use: {
                loader: 'vue-loader'
            }
        }, {
            test: /\.js$/,
            // 仅对这些文件做解析编译 (业务代码 加快打包速度)
            include: [
                path.resolve(process.cwd(), './app/pages'),
            ],
            use: {
                loader: 'babel-loader'
            }
        }, {
            test: /\.(png|jpe?g|gif)(\?.+)$/,
            use: {
                loader: 'url-loader',
                options: {       // ✅ 正确：放进 use 内部
                    limit: 300,
                    esModule: false
                }
            }
        }, {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'] // ✅ 先 style，后 css
        },
        {
            test: /\.less$/,
            use: ['style-loader', 'css-loader', 'less-loader'] // ✅ 从右往左执行
        }, {
            test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
            use: 'file-loader'
        },]
    },
    // 产物输出路径
    output: {

    },
    // 配置模块解析的具体行为（定义 webpack在打包后，如何找到并解析具体模块的路径）
    resolve: {
        extensions: ['.js', '.vue', '.less', '.css'],
        // 别名
        alias: {
            $pages: path.resolve(process.cwd(), './app/pages'),
            $common: path.resolve(process.cwd(), './app/pages/common'),
            $widgets: path.resolve(process.cwd(), './app/widgets'),
            $store: path.resolve(process.cwd(), './app/pages/store'),

        }
    },
    // 配置webpack插件
    plugins: [
        // 处理.vue文件
        // 它的作用是将你定义过的其他规则复制到应应用到vue文件
        // 例如 /\。js的规则 它会应用到vue的<script>里
        new VueLoaderPlugin(),
        // 将第三方库暴露在window context下
        new webpack.ProvidePlugin({
            Vue: 'vue',
            axios: 'axios',
            _: 'loadsh'
        }),
        // 定义全局变量
        new webpack.DefinePlugin({
            __VUE_OPTIONS_API__: 'true', // 支持vue解析optionsAPI
            __VUE_PROD_DEVTOOLS__: 'false', // 禁用vue工具
            __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false', // 禁用生产环境显示“水合”的意思
        }),
        // 构造最终的页面模板
        ...htmlWebpackPluginLst
    ],
    // 配置打包输出优化（配置代码分割，模块合并，缓存， treeshaking， 压缩优化策略）
    optimization: {
        /* 
        * 把js文件打包成三种类型 
        * 1.wendor: 第三方lib库 基本不会进行改动
        * 2.common: 业务组建的公共部分进行抽取， 改动较少
        * 3.entry.{page}: 不用页面entry里的业务代码差异部分 经常会进行改动
        * 目的：把改动和引用频率不一样的js区分出来， 以达到更好的利用浏览器渲染效果
        */
        splitChunks: {
            chunks: 'all', // 对同步异步都会进行分割
            maxAsyncRequests: 10, // 每次异步最大并行请求数
            maxInitialRequests: 10, // 入口点的最大并行请求数
            cacheGroups: {
                vendor: { // 第三方依赖库
                    test: /[\\/]node_modules[\\/]/,  // 打包node_module中的文件
                    name: 'vendor', // 模块名称
                    priority: 20, // 优先级 数字越大 优先级越高
                    enforce: true, // 强制执行
                    reuseExistingChunk: true, // 服用已有的公共chunk
                },
                common: { // 公共模块
                    name: 'common',
                    minChunks: 2, // 被2处引用则被认为是公共模块
                    minSize: 1, // 最小分割文件大小 （1byte）
                    priority: 10, // 优先级
                    reuseExistingChunk: true, // 服用已有的公共chunk
                }
            }
        },
        // 将webpack运行时生成的代码打包到runtime。js
        runtimeChunk: true
    }
}
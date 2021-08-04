const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const glob = require('glob');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var vueLoaderConfig = require('./vue-loader.conf');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');

var utils = require('./utils')
/**
 * 执行环境
 */
var isProduction = function () {
    return process.env.NODE_ENV == 'production'
}
var isDevelopment = function () {
    return process.env.NODE_ENV == 'development'
}
var rules = [{
        test: /\.js$/,
        exclude: /(node_modules|static\/flash|createjs.min)/,
        loader: 'babel-loader'
    },
    {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
    },
    {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
            limit: 1000,
            name: 'images/[folder]/[folder]_[name].[ext]?[hash:10]'
        }
    },
    {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader?limit=10000&minetype=application/font-woff'
    }
]

var entry = [],
    cdnPrefix = '.',
    buildPath = '/../dist/',
    publishPath = cdnPrefix + '/dist/';
if (isProduction() || isDevelopment()) {
    rules = rules.concat(
        utils.styleLoaders({
            sourceMap: true,
            extract: true,
            usePostCSS: true
        })
    )
} else {
    (cdnPrefix = ''),
    (buildPath = '/../dist/'),
    (publishPath = cdnPrefix + '/dist/')
    rules = rules.concat(
        utils.styleLoaders({
            sourceMap: true,
            usePostCSS: true
        })
    )
}

function getEntry() {
    var entry = {}
    var fsRes = fs.readdirSync(path.resolve(__dirname, '../src/pages'))
    var dir = fsRes.join(',')

    if (fsRes.length == 1) {
        var reg = __dirname + '/../src/pages/*/' + dir + '.js';
    } else {
        var reg = __dirname + '/../src/pages/*/{' + dir + '}.js';
    }
    glob.sync(reg).forEach((name, index) => {
        // 获取到文件名称
        var n = name.match(/([^/]+?)\.js/)[1]
        // 检查是否  是本地server
        if (isProduction() || isDevelopment()) {
            if(isProduction()){
                var distHtml = path.resolve(__dirname, '../' + n + '.html');
                var template = path.resolve(__dirname, '../template/index.html');
            }else if(isDevelopment()){
                var distHtml = path.resolve(__dirname, '../' + n + '.html');
                var template = path.resolve(__dirname, '../template/index.html');
            }
            entry[n] = ['../src/pages/' + n + '/' + n + '.js'];
            plugins.push(
                new HtmlWebpackPlugin({
                    filename: distHtml, // 生成的html存放路径，相对于path
                    template: template, // html模板路径
                    inject: 'body', // js插入的位置，true/'head'/'body'/false
                    hash: true, // 为静态资源生成hash值
                    cache: true, //表示内容变化的时候生成一个新的文件
                    chunks: ['common', n], // 需要引入的chunk，不配置就会引入所有页面的资源
                    minify: {
                        // 压缩HTML文件
                        caseSensitive: false, //是否大小写敏感
                        removeComments: true, // 移除HTML中的注释
                        collapseWhitespace: false, // 删除空白符与换行符
                        removeAttributeQuotes: true, //// 去掉属性引用
                    },
                })
            )
        } else {
            entry[n] = ['./src/pages/' + n + '/' + n + '.js'];
            plugins.push(
                new HtmlWebpackPlugin({
                    filename: path.resolve(__dirname, '../' + n + '.html'), // 生成的html存放路径，相对于path
                    template: path.resolve(__dirname, '../template/index.html'), // html模板路径
                    inject: 'body', // js插入的位置，true/'head'/'body'/false
                    hash: true, // 为静态资源生成hash值
                    chunks: ['common', n], // 需要引入的chunk，不配置就会引入所有页面的资源
                    minify: {
                        // 压缩HTML文件
                        removeComments: true,
                        collapseWhitespace: true,
                        removeAttributeQuotes: true
                    },
                    chunksSortMode: 'dependency'
                })
            )
        }
    })
    return entry
}
var plugins = [
    // 把公共代码提取出来作为单独的js 可以服用 浏览器也可进行缓存
    new webpack.optimize.CommonsChunkPlugin('common'),
    // 将各个模块打包成闭包
    new webpack.optimize.ModuleConcatenationPlugin(),
    // debug
    new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false,
        options: {
            context: __dirname
        }
    }),
    // 抽离出css
    new ExtractTextPlugin({
        filename: 'css/[name].css',
        allChunks: true
    }),
    new OptimizeCSSPlugin({
        cssProcessorOptions: true ? {
            safe: true,
            map: {
                inline: false
            }
        } : {
            safe: true
        }
    }),
    // new MiniCssExtractPlugin({
    //     filename: '/css/[name].css',
    //     chunkFilename: '/css/[id].css',
    // }),
    // 使用 ProvidePlugin 加载使用率高的依赖库
    new webpack.ProvidePlugin({
        $: 'jquery',
        createjs: 'src/vendor/createjs/createjs.min.js',
        vueApp: 'src/app'
    })
]
entry = getEntry();

module.exports = {
    entry: entry,
    output: {
        path: __dirname + buildPath,
        filename: 'js/[name].js',
        publicPath: publishPath,
        chunkFilename: 'js/[id].build.js?[chunkhash]'
    },
    module: {
        rules: rules
    },
    resolve: {
        alias: {
            vue: 'vue/dist/vue.esm.js',
            src: path.resolve(__dirname, '../src'),
            assets: path.resolve(__dirname, '../src/assets'),
            '@': path.resolve(__dirname, '../'),
            static: path.resolve(__dirname, '../static'),
            vendor: path.resolve(__dirname, '../src/vendor')
        }
    },
    externals: ['.js', '.vue', '.json'],
    plugins: plugins,
    node: {
        // prevent webpack from injecting useless setImmediate polyfill because Vue
        // source contains it (although only uses it if it's native).
        setImmediate: false,
        // prevent webpack from injecting mocks to Node native modules
        // that does not make sense for the client
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty'
    }
}
if (!isProduction() || isDevelopment()) {
    module.exports.devtool = '#source-map'
}
/***
 * vue vue-loader vue-templater-compiler 必须保持版本一致，同时安装
 */
/**
 * amd?, bail?, cache?, context?, dependencies?,
 *  devServer?, devtool?, entry, externals?, loader?, 
 * module?, name?, node?, output?, parallelism?, performance?, 
 * plugins?, profile?, recordsInputPath?, recordsOutputPath?,
 *  recordsPath?, resolve?, 
 * resolveLoader?, stats?, target?, watch?, watchOptions? 
 */
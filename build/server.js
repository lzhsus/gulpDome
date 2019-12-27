var path = require('path');
var webpack = require('webpack');
var config = require('./webpack.config');

for (var i in config.entry) {
    config.entry[i].unshift(path.resolve(__dirname, './client'), "webpack/hot/dev-server");
    // config.entry[i].unshift('webpack-hot-middleware/client?noInfo=true&reload=true&name='+i,"webpack/hot/dev-server");
    // config.entry[i].unshift('webpack-dev-server/client?http://localhost:8080', "webpack/hot/dev-server");
};
config.plugins.push(new webpack.HotModuleReplacementPlugin());

/**
 * 文件监控
 */
var chokidar = require('chokidar');
var express = require('express');
var app = express();
// console.log(config)

var webpackDevMiddleware = require('webpack-dev-middleware');
var WebpackHotMiddleware = require('webpack-hot-middleware');

var compiler = webpack(config);
var webpackDevMiddlewareInstance = webpackDevMiddleware(compiler, {
    // 这里是对 webpackDevMiddleware 的一些配置，具体其他配置我们下面已经列出来了。
    //绑定中间件的公共路径,与webpack配置的路径相同
    publicPath: config.output.publicPath,
    quiet: true, //向控制台显示任何内容 
    hot: true,
    noInfo: true, //显示无信息到控制台（仅警告和错误） 
    stats: {
        colors: true
    }
});
var WebpackHotMiddlewareInstance = WebpackHotMiddleware(compiler, {
    log: false,
    heartbeat: 5000,
    timeout: 5000,
    reload: true,
});
var watcher = chokidar.watch([
    path.resolve(__dirname, '../*.html'),
    path.resolve(__dirname, '../static/css/*.css'),
]);
watcher.on('ready', function () {
    console.log('Initial scan complete. Ready for changes');
});
watcher.on('change', function (path) {
    console.log('File [' + path + '] changed !');
    WebpackHotMiddlewareInstance.publish({
        action: 'reload'
    });
});


webpackDevMiddlewareInstance.waitUntilValid(() => {
    console.log('Package is in a valid state');
});



app.use(webpackDevMiddlewareInstance);
app.use(WebpackHotMiddlewareInstance);
app.use(express.static(path.join(__dirname, '../')));


app.listen(3000, function (res) {
    console.log('Serve the files on port 3000.\n');
});
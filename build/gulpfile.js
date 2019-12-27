// const { series , parallel } = require('gulp')

// function build(cd){
//     console.log('build')
//     cd()
// }
// function clean(cd){
//     console.log('clean')
//     cd()
// }
// // default 违约
// function defaultTask(cd) {  
//     // 在这里放置默认任务的代码
//     // place code for your default task here
//     console.log('defaultTask')
//     cd()
// }
// function javascript(cb) {
//     // body omitted
//     console.log('javscript')
//     cb();
//   }

//   function css(cb) {
//     // body omitted
//     console.log('css')
//     cb();
//   }
/**
 * process 处理加工
 * process nodejs 的全局变量 存在属性env
 */
//   if(process.env.NODE_ENV === 'production'){

//         exports.build = series(css,javascript);
//   }else{
//         exports.build = series(defaultTask,clean);
//   }
// exports.default=series(clean,build,defaultTask,parallel(javascript,css))

/**
 * series 顺序执行  （异步加载）
 * parallel 最大并发运行 （同时运行同步加载）
 */
/**
 * 任何导出的函数都将注册到gulp的任务task系统中
 */
/**
 * 文件系统  命令行的操作
 * 当运行gulp命令时自动加载
 * 每个task 都是一个异步的JavaScript函数
 */
/**
 * 任务tasks
 * 可以是public公开的 （从gulpfile 中被导出export，可以通过gulp命令直接操作）
 * private私有的（被设计在内部使用 通常作为series()[系列]parallel(类似)[]）
 * private的任务在外观和行为和其他任务 一样，但是不能被用户直接调用
 * starting 开始人物 finished 结束任务
 */
/**
 * 允许在组合在进行改变，不需要在单个任务task中进行条件判断
 * 当一个组合操作时，这组合操作中的每一个任务被调用都会执行
 * （同一个任务可能被执行两个，将会导致不可预期的结果）
 * （重构 任务https://www.gulpjs.com.cn/docs/getting-started/creating-tasks/）
 */
/************************************************** */
/**
 * 异步执行 
 * task 
 * series（）组合任务 中有一个 任务错误，将导致整个组合任务结束，并且不会进一步执行其他任务
 * parakkel() 组合任务 中有一个 任务错误，将导致这个组合任务结束，但是其他任务继续执行结束或者错误
 */
// const { src,dest } =require('gulp');
/**
 * 返回 stream
 */
// function streamTask() {  
//     return src('*.js')
//         .pipe(dest('output'));
// }
// exports.default = streamTask;
/**
 * 返回 promise
 */
// function promiseTask() {
//     return Promise.resolve('the value is ignored');
//   }
//   exports.default = promiseTask;
// const { EventEmitter } = require('events');

/**
 * 返回 evern emitter
 */
// function eventEmitterTask() {
//     const emitter = new EventEmitter();
//     // Emit has to happen async otherwise gulp isn't listening yet
//     setTimeout(() => emitter.emit('finish'), 250);
//     return emitter;
//   }

//   exports.default = eventEmitterTask;
// const { exec } = require('child_process');
/**
 * 返回child process
 */
// function childProcessTask() {
//   return exec('date');
// }

// exports.default = childProcessTask;
// const { Observable } = require('rxjs');
/**
 * 返回observable
 */
// function observableTask() {
//   return Observable.of(1, 2, 3);
// }

// exports.default = observableTask;

/**
 * 
 * @param {*} cb
 * 如果任务不返回任何形式 
 */
// function callbackTask(cb) {
//     // `cb()` should be called by some async work
//     cb();
//   }
// //   返回错误
//   function callbackError(cb) {
//     // `cb()` should be called by some async work
//     cb(new Error('kaboom'));
//   }
//   exports.default = callbackTask;
/**
 * 通常将callback传递给另一个api
 */
// const fs = require('fs');

// function passingCallback(cb) {
//   fs.access('gulpfile.js', cb);
// }

// exports.default = passingCallback;
/***
 * gulp b不再支持同步任务
 * 因为同步任务常常会导致难一调试的细微错误 忘记任务中返回stream
 */
/***************************** */
/**
 * 处理文件
 * src() dest（）方法用于处理计算机上存放的文件
 * src() 接受gulp参数 并从文件系统中读取文件然后生成一个node流， stream 
 * 将所有匹配的文件读取到内存中并通过列进行处理
 * 由src() 产出的流应当从任务 中返回并发出异步完成的信号 就如创建人物 文档中描述
 * 流stream所提供的主要时api是 。pipe() 方法 用于连接转换流 transform streams
 * 或者 写流wirtable streams
 * 
 */
/**
 * dest('输出目录')  并且产生一个node流 stream 作为终止流
 */
// var gulp = require('gulp'),
const {
	src,
	dest,
	series,
	parallel,
	task
} = require('gulp');
const babel = require('gulp-babel');
// 插件并不改变文件名
const uglify = require('gulp-uglify');
// 插件用来修改文件的扩展名 
const rename = require('gulp-rename')
const del = require('del')
const cssmin = require('gulp-clean-css');
const config = require('./webpack.config')
const webpack = require('webpack')
/**
 * 清除dist目录
 */
function clean(cd) {
	return del(['/dist/**/*']).then(paths => {
		console.log('Deleted files and folders:\n', paths.join('\n'));
		cd()
	});
}
/**
 * 打包webpack
 */
function webpackTask(cd) {  
	// console.log(config)
	webpack(config,(err,start)=>{
		// console.log('err---',err)
		console.log('errors---',start.compilation.errors)
		cd()
	})
}
/**
 * 压缩css
 */
function testCssmin(cd){
	return  src('../dist/*.css',cd())
			.pipe(cssmin({
				advanced: true,//类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
				compatibility: 'ie7',//保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
				keepBreaks: true,//类型：Boolean 默认：false [是否保留换行]
				keepSpecialComments: '*'
				//保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
			}))
			.pipe(dest('../dist/css'));
}
/** 
 *  压缩js文件
 */
function testScript(cd) {  
	return	src('../dist/*.js',{
				sourcemaps: true
			})
			// .pipe(rename({suffix:'.min'}))
			.pipe(uglify())
			// 压缩文件 
			.pipe(rename({extname: '.min.js'}))
			.pipe(dest('../dist/js'));
};
if( process.env.NODE_END === "webpack"){
	exports.default = series(clean,webpackTask)
}else{
	exports.default = series(clean,webpackTask,parallel(testCssmin,testScript))
};
/**
 * 模式 流动 streaming 缓冲buffered 空empty模式
 * 这些模式 可以通过src() buffer read 参数进行设置
 * 缓冲 buffered 模式是默认模式  将文件内容加载内存中 插件
 * 通常运行在缓冲模式下 并且许多插件不支持流动streaming模式
 * 流动 streaming 模式的存在主要用于操纵无法放入内存的大文件
 * 例如图形 电影 文件内容从文件系统中以小块的方式流逝传输 而不是一次性全部加载
 * 流动 streaming模式支持此模式插件或者自己开发
 * 空 empty 模式不包含任内内容 仅在处理文件元数据是有用
 */
/*************************** */
/**
 * glob 是由普通字符和 或者通配字符组成的字符串，用于匹配文件路径
 * 可以利用一个或者多个glob在文件系统中定位文件
 * src（） 方法接受一个glob字符串 或者glob字符串组成的数组作为参数
 * 其中 字少匹配一项 否则src() 方法将会报错
 * glob为数组 将每个glob在数组中的位置一次匹配 
 * 对于取反 negative glob 有用
 */
/**
 * 字符串片段 是指两个分隔符字间的所有字符组成的字符串
 * glob中 分隔符永远是 / 字符 ，- 不区分操作系统 -即便是采用 \\作为分隔符
 * 的windows 操作系统 glob \\字符串被保留作为 转义符 使用
 * eg 'glob_with_uncommon_\\*_character.js' 通配符* 转为 普通字符串*
 * 避免使用node path 类方法创建glob __dirname __filename 全局变量 process.cew()
 */
/**
 * 特殊字符 * 
 * 在一个字符串片段中匹配任意数量的字符，包括零个匹配
 * 在匹配单机目录下的文件很有用
 * *.js   
 */
/**
 * 特殊字符 **
 * 在匹配嵌套目录下的文件很用用 （限制使用 避免匹配大量不必要目录）
 * `scripts`/`*`*`*.js`
 * 如果没有scripts 这个前缀做限制 node_modules 目录下的所有目录或其他目录都将配匹配
 */
/**
 * 特殊字符 ！取反
 * 取反 nagative 必须跟在非取反non-nagative的后面（）顺序执行
 * ['** *.js，！node_modules]
 */
/**
 * 匹配叠加 overlapping globs
 * 两个或者多个glob故意或者无意匹配了形同文件就会被认为匹配重叠overlapping
 * 如果在同一个src 中使用了会产生匹配重叠的glob  gulp将尽力除去重叠部分
 * 但是在多个src（）调用时产生的匹配重叠时不会被去重的
 */
/******************************* */
/**
 * gulp插件实质上 是 node转换流 transform streams 它封装了通过管道
 * pipeline 转换文件的常见功能 通常是使用 。pipe() 方法 并放在src（）和dest()
 * 之间 他们可以更改流stream的每个文件名 元数据 文件内容
 * 
 */
/**
 * 并非 gulp 中的一切都需要用插件来完成 
 * 应当通过使用独立的功能模块或者库来实现
 */
// const { rollup } = require('rollup');
// /**
//  * rollup 提供了基于promis 的api 在 async 任务中工作的很好
//  * 
//  */
// exports.default = async function() {
//     const bundle = await rollup.rollup({
//       input: 'src/index.js'
//     });

//     return bundle.write({
//         file: 'output/bundle.js',
//         format: 'iife'
//       });
// }
/**
 * 条件插件 
 * 插件不应该针对特定文件类型 使用gulp-if 之类的插件来完成转换某些文件操作
 * 
 */
// const { src, dest } = require('gulp');
// const gulpif = require('gulp-if');
// const uglify = require('gulp-uglify');

// function isJavaScript(file) {
//   // 判断文件的扩展名是否是 '.js'
//   return file.extname === '.js';
// }

// exports.default = function() {
//   // 在同一个管道（pipeline）上处理 JavaScript 和 CSS 文件
//   return src(['src/*.js', 'src/*.css'])
//     // 只对 JavaScript 文件应用 gulp-uglify 插件
//     .pipe(gulpif(isJavaScript, uglify()))
//     .pipe(dest('output/'));
// }
/***
 * 内敛插件 lnline plugins
 * 内敛插件是一次性的转换流 transfrom streams 你可以通过在gulpfile 文件之间书写需要的功能
 * 1.避免自己创建维护插件
 * 2.避免fork 一个已经存在的插件并添加自己所需要的功能
 */
// const { src, dest } = require('gulp');
// const uglify = require('uglify-js');
// const through2 = require('through2');

// exports.default = function() {
//   return src('src/*.js')
//     // 创建一个内联插件，从而避免使用 gulp-uglify 插件
//     .pipe(through2.obj(function(file, _, cb) {
//       if (file.isBuffer()) {
//         const code = uglify.minify(file.contents.toString())
//         file.contents = Buffer.from(code)
//       }
//       cb(null, file);
//     }))
//     .pipe(dest('output/'));
// }
/************************* */
/*** 
 * 文件监控
 * gulp api中的watch（） 方法利用文件系统的监控程序 file system watcher 
 * 将globs 与任务task 进行关联 
 * 他对匹配glob 的文件进行监控 如果有文件被修改就执行关联的任务task'
 * 如果被执行的任务task' 没有触发异步完场信号 他将永远不会在执
 */
// const { src, dest,series,watch } = require('gulp');
// const babel = require('gulp-babel');
// // 插件并不改变文件名
// const uglify = require('gulp-uglify');
// // 插件用来修改文件的扩展名 
// const rename = require('gulp-rename')
// const del = require('delete')

// function delTask(cd) { 
//     del(['output'],cd)
//  }
//  function buildTask() {

//     return src('src/*.js')
//       .pipe(babel())
//       .pipe(src('vendor/*.js'))
//       .pipe(uglify())
//       // 压缩文件 
//       .pipe(rename({extname:'.min.js'}))
//       .pipe(dest('output/'));
//   }

// // exports.default =series(delTask,buildTask)
// // watch('src/*.css',css);

// watch('src/*.js',series(delTask,buildTask))

// watch('vendor/*.js',series(delTask,buildTask))
/***
 * Vinyl 是描述文件的元数据对象 Vinyl实例的主要属性是文件系统中文件核心的 path contents核心方面。
 * Vinyl 对象是可以用来描述来自多个源文件（本地文件系统 远程存储选项）
 * 
 * 
 */
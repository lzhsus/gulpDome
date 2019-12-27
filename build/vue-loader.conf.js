'use strict'
const utils = require('./utils')
const isProduction = (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development')
const sourceMapEnabled = isProduction ?
	true :
	true

module.exports = {
	loaders: utils.cssLoaders({
		sourceMap: sourceMapEnabled,
		extract: isProduction,
	}),
	cssSourceMap: sourceMapEnabled,
	cacheBusting: true,
	transformToRequire: {
		video: ['src', 'poster'],
		source: 'src',
		img: 'src',
		image: 'xlink:href'
	}
}
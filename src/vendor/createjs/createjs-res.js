var createjs = require("./createjs.min.js");
var buzz = require("../plugins/buzz.min.js");

function Loader(cls, loaderNum, link = false) {
	var self = this;
	var canvas;
	var images = images || {};
	var ss = ss || {};
	var lib = lib || {};
	var AdobeAn = AdobeAn || {};
	var canvasCls = cls;
	var dtd;
	var progress = 0;
	var resArr = [];
	var preloadNum = loaderNum || 10;
	var totalStep = 0;
	var curStep = 0;
	var resLength;
	var curLoadNum = 0;
	var isComplete = false;
	var libMC;
	this.progress = function () {
		return progress;
	};
	this.init = function () {
		dtd = $.Deferred();
		canvas = require("static/flash/" + canvasCls + ".js");
		if (!link) {
			lib = require("src/flash/" + canvasCls + ".js");
		}
		lib["name"] = canvasCls;
		lib.getDisplay = getDisplay;
		canvas(lib, images, createjs, ss, AdobeAn);

		resArr = lib.properties.manifest.filter(function (obj) {
			var arr = obj.src.match(/[^\\?]*(png|jpg)/);
			var soundsArr = obj.src.split(".mp3");
			if (soundsArr.length > 1) {
				soundObj[obj.id] = new buzz.sound(
					"./static/flash/" + soundsArr[0],
					opt
				);
			} else if (arr && arr.length > 0) {
				obj.src = "static/flash/" + obj.src;
				return obj;
			}
		});
		loadInt();
		return dtd.promise();
	};

	function getDisplay() {
		if (!libMC) {
			libMC = new lib[canvasCls]();
			libMC.pageName = canvasCls;

			if (lib["construct"]) {
				lib.construct(libMC);
			}
		}

		return libMC;
	}

	function loadInt() {
		resLength = resArr.length;
		progressObj.totalNum += resLength;
		totalStep = Math.ceil(resLength / preloadNum);
		curStep = 1;
		curLoadNum = 0;
		if (resLength == 0) {
			handleComplete();
		} else {
			startLoad(0);
		}
	}

	function startLoad(id) {
		var loadStepCount = 0;
		for (let i = id; i < resLength && i < id + preloadNum; i++) {
			let imgObj = new Image();
			imgObj.crossOrigin = "Anonymous";
			imgObj.onload = function () {
				curLoadNum++;
				loadStepCount++;
				if (this.id != "json") {
					images[this.id] = this;
				}
				progress = parseInt(curLoadNum / resLength * 100);
				progressObj.loadNum += 1;
				dtd.notify(progress);

				if (curLoadNum >= resLength) {
					if (!isComplete) {
						handleComplete();
					}
				} else if (loadStepCount >= preloadNum) {
					startLoad(curLoadNum);
					// setTimeout(startLoad,400,curLoadNum);
				}
			};
			// console.log(resArr[i]['src'])
			imgObj.id = resArr[i]["id"];
			var tempURL = resArr[i]["src"].split("images/")[1];
			// console.log(tempURL,resArr[i]['src'])
			// imgObj.src=require("../../flash/images/"+tempURL);
			imgObj.src = resArr[i]["src"];
		}
	}

	function handleComplete() {
		for (var i = 0; i < lib.ssMetadata.length; i++) {
			var sName = lib.ssMetadata[i].name;
			ss[sName] = new createjs.SpriteSheet({
				images: [images[sName]],
				frames: lib.ssMetadata[i].frames
			});
		}
		isComplete = true;
		dtd.resolve(lib);
	}
}
var isArray = function (obj) {
	return Object.prototype.toString.call(obj) === "[object Array]";
};
////////////////////////////////////////////
var loadPromiseObj = [];
var progressObj = {
	loadNum: 0,
	totalNum: 0
};
var loadScene = function (scene) {
	if (!isArray(scene)) {
		var promise = getScenePromise(
			scene["name"],
			scene["preloadNum"],
			scene["link"]
		);
		return promise;
	}
	var tempArr = [];
	for (var i = 0; i < scene.length; i++) {
		var promise = getScenePromise(
			scene[i]["name"],
			scene[i]["preloadNum"],
			scene[i]["link"]
		);
		tempArr.push(promise);
	}
	return $.when.apply(this, tempArr);
};

function getScenePromise(scene, preloadNum, link) {
	let promise;
	if (!loadPromiseObj[scene]) {
		promise = new Loader(scene, preloadNum, link).init();
		loadPromiseObj[scene] = promise;
	} else {
		promise = loadPromiseObj[scene];
	}
	return promise;
}
/////////////////////////////////
function Flash(canvas) {
	var opt = {
		formats: ["mp3"],
		loop: false
	};

	var stage;
	var rootContainer = new createjs.Container();
	var middleContent = new createjs.Container();
	var topContent = new createjs.Container();
	var bottomContent = new createjs.Container();
	var loadingContent = new createjs.Container();
	var popMC = new createjs.Container();
	var loadedPage = {};
	var pageOpt = {};
	var curPage;
	popMC.addEventListener("click", function () {});

	stageInit();

	function stageInit() {
		stage = new createjs.Stage(canvas);
		createjs.Ticker.framerate = 25;
		createjs.Touch.enable(stage);
		createjs.Ticker.addEventListener("tick", stage);
		createjs.MotionGuidePlugin.install();
		rootContainer.addChild(bottomContent, middleContent, topContent, popMC);
		stage.addChild(rootContainer); //,loadingContent,popMC
	}
	this.stopTick = function () {
		createjs.Ticker.removeEventListener("tick", stage);
	};
	this.startTick = function () {
		createjs.Ticker.addEventListener("tick", stage);
	};
	this.updateTick = function () {
		stage.update();
	};
	this.getMiddleDisplay = function () {
		return middleContent;
	}
	this.getTopDisplay = function () {
		return topContent;
	}
	this.getRootDisplay = function () {
		return rootContainer;
	}
	this.loadInit = function (opt) {
		pageOpt = opt;
		let firstPreloadScenes = opt.firstload.map(function (value) {
			return opt["middleLayer"][value];
		});
		firstPreloadScenes = firstPreloadScenes.concat([opt["bottomLayer"], opt["topLayer"]]);
		return loadScene(opt["loading"])
			.then(function (loading) {
				loadedPage["loading"] = loading.getDisplay();
				middleContent.addChild(loadedPage["loading"]);
				return loadScene(firstPreloadScenes);
			})
			.progress(function () {
				var per = Math.floor(100 * progressObj.loadNum / progressObj.totalNum);
				if (loadedPage["loading"]) {
					loadedPage["loading"].progress(per);
				}
			})
			.done(function (...list) {
				list.forEach(function (lib) {
					loadedPage[lib.name] = lib.getDisplay();
				});
				curPage = opt.firstPage;

				middleContent.removeAllChildren();
				bottomContent.addChild(loadedPage[opt.bottomLayer.name]);
				topContent.addChild(loadedPage[opt.topLayer.name]);
				middleContent.addChild(loadedPage[opt.firstPage]);

				stage.update();
				setTimeout(preloadPage, 500, 0);
			});
	};

	function preloadPage(id) {
		let tempArr = pageOpt.preload.slice(id, id + pageOpt.preloadNum);
		let loadArr = tempArr.map(function (value) {
			return pageOpt["middleLayer"][value];
		});
		loadScene(loadArr).then(function (lib) {
			if (id + pageOpt.preloadNum < pageOpt.preload.length) {
				preloadPage(id + pageOpt.preloadNum);
			}
		});
	}
	this.goto = function (page, transition, progressCb, completeCb) {
		if (page == curPage) {
			return loadPromiseObj[curPage];
		}
		var tempPage = curPage;
		curPage = page;

		if (loadedPage[page]) {
			var promise = loadPromiseObj[page];
		} else {
			var promise = loadScene(pageOpt["middleLayer"][page]);
		}
		promise
			.progress(function () {
				var per = Math.floor(100 * progressObj.loadNum / progressObj.totalNum);
				if (loadedPage["loading"]) {
					loadedPage["loading"].progress(per);
				}
			})
			.then(function (lib) {
				var pageMC = loadedPage[page];
				if (!pageMC) {
					pageMC = lib.getDisplay();
					loadedPage[page] = pageMC;
				}

				pageMC.x = 0;
				pageMC.y = 0;
				pageMC.alpha = 1;
				pageMC.scaleX = 1;
				pageMC.scaleY = 1;
				switch (transition) {
					case "swipe":
						createjs.Tween.get(loadedPage[tempPage])
							.to({
								x: -640
							}, 500, createjs.Ease.sineOut)
							.call(function () {
								middleContent.removeChild(loadedPage[tempPage]);
							});
						pageMC.x = 640;
						pageMC.gotoAndStop(0);
						createjs.Tween.get(pageMC)
							.to({
								x: 0
							}, 500, createjs.Ease.sineOut)
							.call(function () {
								pageMC.play();
							});

						break;
					case "fade":
						createjs.Tween.get(loadedPage[tempPage]).to({
								alpha: 0
							},
							500,
							createjs.Ease.sineOut
						);
						pageMC.alpha = 0;
						// pageMC.gotoAndStop(0);
						createjs.Tween.get(pageMC).to({
								alpha: 1
							},
							500,
							createjs.Ease.sineOut
						);
						break;
					default:
						middleContent.removeAllChildren();
						break;
				}
				middleContent.addChild(pageMC);
				loadedPage[pageMC.pageName] = pageMC;
				stage.update();
				return pageMC;
			});
		return promise;
	};

	this.getAsset = function (page) {
		if (loadedPage[page]) {
			return loadPromiseObj[page];
		}
		return loadScene(pageOpt["asset"][page]).then(function (lib) {
			loadedPage[lib.name] = lib.getDisplay();
			return loadedPage[lib.name];
		});
	};
	this.pop = function (display) {
		popMC.removeAllChildren();
		popMC.alpha = 1;
		popMC.addChild(display);
	};
	this.closePOP = function () {
		// createjs.Tween.get(popMC).to({alpha:0},300).call(function(){
		popMC.removeAllChildren();
		// });
	};
}
var soundObj = {};
window.playSound = function (id) {
	if (soundObj[id]) {
		soundObj[id].play();
	}
};
window.stopSound = function (id) {
	if (soundObj[id]) {
		soundObj[id].stop();
	}
};
window.stopAllSound = function () {
	for (let i in soundObj) {
		soundObj[i].stop();
	}
};
module.exports.loadScene = loadScene;
module.exports.Flash = Flash;
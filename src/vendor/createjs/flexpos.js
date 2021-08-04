var displayArr = [];
var dynamicSizeMc = [];
/**
 *  pos:{top right bottom left center}
 *  lockAt:{}
 */
var cw = 0;
var ch = 0;

function addDisplay(mc, pos = {}, lockAtMC) {
    var obj = {display: mc, pos: pos, lockAtMC: lockAtMC};
    displayArr.push(obj);
    setDisplayPos(obj);
}

/***
 * 用法
 flexpos.addDynamicSizeMc(_self.bg)
 flexpos.addDisplay(_self.bg, {left: 0, top: 0})
 let stageRect = canvasAutoRotation.canvasResize($("#canvas")[0], $(window).width(), $(window).height());
 flexpos.update(stageRect.width, stageRect.height);
 */

function addDynamicSizeMc(mc, size = "fullscreen") {
    //目前只用于背景
    var obj = {display: mc, size: size};
    dynamicSizeMc.push(obj);
    // if(size=="fullscreen"){
    // 	changeSize(mc,size)
    // }
    // else{
    // 	changeSize(mc,size);
    // }
}


function changeSize(w, h) {
    console.log("changesizeeeeee", w, h, dynamicSizeMc)
    for (let i = 0; i < dynamicSizeMc.length; i++) {
        let shape = dynamicSizeMc[i].display;
        let bounds = shape.getBounds();
        console.log("ssssssssss", bounds)
        let nscaleX = w / bounds.width;
        let nscaleY = h / bounds.height;
        shape.scaleX = nscaleX;
        shape.scaleY = nscaleY;
    }
}

function removeDisplay(mc) {
    for (var i = 0; i < displayArr.length; i++) {
        if (displayArr[i] == mc) {
            displayArr.splice(i, 1);
        }
    }
    ;
}

function displayResetPos($cw, $ch) {
    cw = $cw ? $cw : cw;
    ch = $ch ? $ch : ch;
    var lookRect = {x: 0, y: 0, width: cw, height: ch};
    console.log(cw, ch)
    displayArr.forEach((obj) => {
        setDisplayPos(obj, lookRect);
    })
}

function setDisplayPos(obj, lookRect) {
    if (!lookRect) {
        lookRect = {x: 0, y: 0, width: cw, height: ch};
    }
    if (obj.lockAtMC) {
        lookRect = obj.lockAtMC.getBounds();
    }
    if(obj.pos.center){
		obj.display.x=lookRect.x+lookRect.width/2;
		obj.display.y=lookRect.y+lookRect.height/2;
	}else{
		if(typeof obj.pos.left=='number'){
			obj.display.x=lookRect.x+obj.pos.left;
		}else if(typeof obj.pos.perLeft=='number'){
			obj.display.y=lookRect.y+lookRect.width*obj.pos.perLeft/100;
		}else if(typeof obj.pos.right =='number'){
			obj.display.x=lookRect.x+lookRect.width-obj.pos.right;
		}else if(typeof obj.pos.perRight=='number'){
			obj.display.y=lookRect.y+lookRect.width-lookRect.width*obj.pos.perRight/100;
		}

		if(typeof obj.pos.top=='number'){
			obj.display.y=lookRect.y+obj.pos.top;
		}else if(typeof obj.pos.perTop=='number'){
			obj.display.y=lookRect.y+lookRect.height*obj.pos.perTop/100;
		}else if(typeof obj.pos.bottom =='number'){
			obj.display.y=lookRect.y+lookRect.height-obj.pos.bottom;
		}else if(typeof obj.pos.perBottom=='number'){
			obj.display.y=lookRect.y+lookRect.height-lookRect.height*obj.pos.perBottom/100;
		}
	}
}

function update(w, h) {

    changeSize(w, h);
    displayResetPos(w, h);
}

export default {
    update: update,
    addDynamicSizeMc: addDynamicSizeMc,
    addDisplay: addDisplay,
    removeDisplay: removeDisplay,
    displayResetPos: displayResetPos,
}
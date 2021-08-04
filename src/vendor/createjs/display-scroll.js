var momentum=require("../utils/momentum.js");
var AnimationTimer=require("../utils/animation-timer.js");

function DisplayScroll(mc,w,h,maskWidth,maskHeight){
	var maskW=maskWidth;
	var maskH=maskHeight;
	var displayW=w;
	var displayH=h;
	var disH=displayH-maskH;
	var maskShape=new createjs.Shape();
	maskShape.graphics.beginFill("#000").drawRect(0, 0, maskW, maskH);
	mc.mask=maskShape;
	mc.addEventListener("mousedown",mousedownHandler,true);
	mc.addEventListener("pressmove",mouseMoveHandler,true);
	mc.addEventListener("pressup",mouseUpHandler,true);
	mc.addEventListener("mouseout",mouseUpHandler,true);

	var lastMoveTime = 0;  
	var lastMoveStart = 0;  
	var stopInertiaMove = false; // 是否停止缓动  
	var orgY=mc.y;
	var lastY;
	var startY;  

	var animation;
	var elapsed;
	var scrollY;
	var fps;
	var isRunning=false;
	function mousedownHandler(e){

		if(animation){
			animation.stop();
    		animation=null;
		}
	    mc.removeEventListener("tick",tickHandler);
	    
		lastY = startY =e.stageY;
		/** 
	     * 缓动代码 
	     */  
	    lastMoveStart = mc.y;  
	    lastMoveTime = e.timeStamp || Date.now();  
	    stopInertiaMove = true;  
	}
	function mouseMoveHandler(e){
		var nowY = e.stageY;  
	    var dis = nowY - lastY; 
	    if(mc.y>=0&&dis>0){
	    	dis*=.4;
	    }else if(mc.y<=-disH&&dis<0){
	    	dis*=.4;
	    }  
	    mc.y+= dis;  
	    lastY = nowY;   
	    var nowTime = e.timeStamp || Date.now();  
	    stopInertiaMove = true;  
	    var duration=nowTime - lastMoveTime;

	    if(duration> 300) {
	        lastMoveTime = nowTime;  
	        lastMoveStart = mc.y;  
	    }  
	}
	function mouseUpHandler(e){
		// e.stopPropagation();
		// e.stopImmediatePropagation();
	    /** 
	     * 缓动代码 
	     */  
	    // e.stopPropagation();
	    // e.stopImmediatePropagation();
	    // e.preventDefault();
	    var nowTime = e.timeStamp || Date.now();  
	    var time=nowTime - lastMoveTime;
	    if(time<300&&!checkPos()){
	    	var momentumObj=momentum.get(mc.y, lastMoveStart, time,-disH, maskHeight,0.0012);
		    // console.log(momentumObj)
		    if (momentumObj.duration == Infinity || momentumObj.duration == 0) {
	            return;
	        }
	        // createjs.Tween.get(mc).to({y:momentumObj.destination},momentumObj.duration,function(t) {
         //    return (--t) * t * t + 1;
        	// }).addEventListener("change", function(){
        	// 	if(mc.y>=100||mc.y<-1490-100){
		       //  	clearMotion();
		       //  }
        	// }).call(function(){
        	// 	if(mc.y>=0||mc.y<-1490){
		       //  	clearMotion();
		       //  }
        	// });
	        var scrolltoY = momentumObj.destination - mc.y;
	        fps = scrolltoY / momentumObj.duration;

	        animation = new AnimationTimer(momentumObj.duration);

	        scrollY = mc.y;
	        animation.start();
	       	
	      	mc.addEventListener("tick",tickHandler);
	      }else{
	      	checkPos();
	      }
	    
	}
	function checkPos(){
		if(mc.y>0){
			isRunning=true;
	      	createjs.Tween.get(mc, {override:true}).to({y:0},300,createjs.Ease.sineOut)
	      	.call(function(){
	      		isRunning=false;
	      	});
	      	return true;
        }else if(mc.y<-disH){
        	isRunning=true;
			createjs.Tween.get(mc, {override:true}).to({y:-disH},300,createjs.Ease.sineOut)
			.call(function(){
	      		isRunning=false;
	      	});
			return true;
    	}
    	return false;
	}
	function tickHandler(e){
		 if (animation&&!animation.isOver()) {
                elapsed = animation.getElapsedTime();
                if (elapsed) {
                    update(elapsed);
                }
            } else {
                clearMotion();
            }
	}
	function clearMotion(){
		mc.dispatchEvent(new createjs.Event('SCROLL_COMPLETE'))
		if(animation){
			animation.stop();
    		animation=null;
		}
	    mc.removeEventListener("tick",tickHandler);
        checkPos();
	}
	function update(elapsed) {
		var y=-momentum.parseInt(scrollY + fps * elapsed)
        // var scrollTop = Math.min(-momentum.parseInt(scrollY + fps * elapsed), 1490);
        // var scrollTop = Math.max(scrollTop, 0);
        mc.y=-y;
        if(mc.y>=100||mc.y<-disH-100){
        	clearMotion();
        }
    }
    this.isRunning=function(){
    	return animation&&animation.isRunning()||isRunning;
    }
}

module.exports=DisplayScroll;
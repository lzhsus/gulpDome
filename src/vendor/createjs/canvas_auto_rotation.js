var designW=750;
var designH=1220;
var stageW;
var stageH;
var rootMC;
var orientation='portrait';//landscape

var dpr = window['devicePixelRatio']?window['devicePixelRatio']:1;

function setDesign(o='portrait',w,h){
  orientation=o;
  designW=w;
  designH=h;
}
function setRootDisplay(mc){
  rootMC=mc;
}
function getStageWH(){
  return {width:stageW,height:stageH};
}
function canvasResize(canvas,w,h,cb){
  if(!rootMC){
    console.error("没有设定旋转mc");
    return;
  }
  let canvasW=w*dpr;
  let canvasH=h*dpr;
  let tempProp=w/h;
  let scale=1;
  console.log(tempProp)
  console.log(canvas)
  canvas.style.width=w+"px";
  canvas.style.height=h+"px";
  canvas.setAttribute("width",canvasW);
  canvas.setAttribute("height",canvasH);

  if(orientation=='portrait'){
    if(w>h){
      var scaleW= w / designH * dpr;
      var scaleH=h / designW * dpr;
      scale=scaleH;
      
      rootMC.scaleX=rootMC.scaleY=scale;
      rootMC.rotation=-90;
      rootMC.x=0;
      rootMC.y=designW*scale;
      stageW=canvasH/scale;
      stageH=canvasW/scale;
      
    }else{
      var scaleW= w / designW * dpr;
      var scaleH=h / designH * dpr;
      scale=scaleW;
      rootMC.scaleX=rootMC.scaleY=scale;
      rootMC.rotation=0;
      rootMC.x=0;
      rootMC.y=0;
      stageW=canvasW/scale;
      stageH=canvasH/scale;
    }
  }else{
    if(w<h){
      var scaleW= w / designW * dpr;
      var scaleH=h / designH * dpr;
      scale=scaleW;
      
      rootMC.scaleX=rootMC.scaleY=scale;
      rootMC.rotation=90;
      rootMC.x=designW*scale;
      rootMC.y=0;
      stageW=canvasH/scale;
      stageH=canvasW/scale;
      
    }else{
      var scaleW= w / designH * dpr;
      var scaleH=h / designW * dpr;
      scale=scaleH;
      rootMC.scaleX=rootMC.scaleY=scale;
      rootMC.rotation=0;
      rootMC.x=0;
      rootMC.y=0;
      stageW=canvasW/scale;
      stageH=canvasH/scale;
      
    }
  }
  // displayResize(stageW,stageH);
  if(typeof cb=="function"){
    cb(stageW,stageH);
  }
  return {width:stageW,height:stageH};
}
export default {
  setDesign:setDesign,
  setRootDisplay:setRootDisplay,
  canvasResize:canvasResize,
  getStageWH:getStageWH,
}
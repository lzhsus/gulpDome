var buzz=require("../plugins/buzz.min.js");

var isReady=false;
var queueArr=[];
function queuePlay(){
	isReady=true;
	while(queueArr.length>0){
		let sound=queueArr.shift();
		sound.play();
	}
	
}
function addQueue(sound){
	queueArr.push(sound);
}
if(/MicroMessenger/i.test(navigator.userAgent)){
  if (typeof WeixinJSBridge == "undefined"){
      if( document.addEventListener ){
          document.addEventListener('WeixinJSBridgeReady', queuePlay, false);
      }else if (document.attachEvent){
          document.attachEvent('WeixinJSBridgeReady', queuePlay); 
          document.attachEvent('onWeixinJSBridgeReady', queuePlay);
      }
  }else{
      queuePlay();
  }
}else{
  queuePlay();
}

var defaultOpt={
  formats: [ "mp3"],
  loop: true,
};

export default class{
	constructor(url,opt={}){
		let tempOpt = JSON.parse(JSON.stringify(defaultOpt));
		this.opt = Object.assign(tempOpt, opt);
		this.sound=new buzz.sound(url,this.opt);
	}

	play(){
		if(!isReady){
			addQueue(this);
		}else{
			this.sound.play();
		}
	}
	stop(){
		this.sound.stop();
	}
	pause(){
		this.sound.pause();
	}
}

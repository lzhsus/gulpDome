var GlobalDispatcher=require("./global-dispatcher");
var buzz=require("../plugins/buzz.min.js");
var opt={
	formats: [ "mp3"],
	loop: false,
};
var curID;
var isDispatch=true;
var soundObj={
}
function addSound(id,tempOpt={}){
	tempOpt=Object.assign(tempOpt,opt);
	soundObj[id]=new buzz.sound("./sounds/sound_1",tempOpt);
}
function timeupdate(e){
	if(soundObj["sound_"+curID].isEnded()){
		var event=new createjs.Event("soundPlayComplete");
		GlobalDispatcher.dispatchEvent(event);
		soundObj["sound_"+curID].unbind("timeupdate");
	}
	console.log(soundObj["sound_"+curID].isEnded())
}
function soundEnd(e){
	
	
}

function playSound(id, loop){
	curID=id;
	soundObj["sound_"+id].bind("timeupdate",timeupdate);
	soundObj["sound_"+id].bindOnce("ended",soundEnd).play();
}
function stopSound(id){
	soundObj["sound_"+id].stop();
}
function stopAllSound(){
	for(var i in soundObj){
		soundObj[i].unbind("timeupdate");
		soundObj[i].stop();

	}
}
module.exports={
	playSound:playSound,
	stopSound:stopSound,
	stopAllSound:stopAllSound,
	addSound:addSound,
}
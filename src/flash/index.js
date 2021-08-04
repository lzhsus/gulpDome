var _self;
var libs=this;
function construct(display){
	_self=display;
	// _self.startBtn.addEventListener("click",startClickHandler);
}
function startClickHandler(e){
	vueApp.globalDispatcher.$emit("gotoPage",{page:"game"});
}
module.exports.construct=construct;
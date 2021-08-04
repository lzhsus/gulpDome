var _self;
var libs=this;
function construct(display){
	_self=display;
	_self.progress=progress;
}
function progress(per){
	// console.log(per);
}

module.exports.construct=construct;
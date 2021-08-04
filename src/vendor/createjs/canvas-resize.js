function resizeFun(){
	var h=$(window).height();
	var w=$(window).width();
	var tempProp=w/h;
	if(_fit=='w'){
		if(tempProp<_prop){
			el.width(_w);
			el.height(_w/_prop);
		}else{
			el.width(_h*_prop);
			el.height(_h);
		}
	}else{
		if(tempProp>_prop){
			el.width(_w);
			el.height(_w/_prop);
			
		}else{
			el.width(_h*_prop);
			el.height(_h);
		}
	}
	
}
var _el;
var _fit;
var _prop;
var _w;
var _h;
export default function(el='#canvas',w=640,h=1040,fit='w'){
	_fit=fit;
	_w=w;
	_h=h;
	_prop=_w/_h;
	_el=$(el);
	$(window).on("resize",resizeFun);
	resizeFun();
}
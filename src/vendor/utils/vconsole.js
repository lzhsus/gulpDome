var isShow=false;
var count = 0
document.addEventListener('touchstart', touchStartHandler);
function touchStartHandler(){
	if(isShow)return;
    if (event.targetTouches.length >= 3) {
        if (count == 0) {
            setTimeout(() => count = 0, 2000)
        }
        if (++count >= 3) {
            count = 0
            alert('vConsole');
            init();
        }
    }
}
function init(){
	document.removeEventListener('touchstart', touchStartHandler);
	isShow=true;
	require.ensure([], function(require) {
      let VConsole=require('vconsole');
      let vConsole = new VConsole();
   });
}
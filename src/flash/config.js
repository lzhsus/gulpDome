import canvasAutoRotation from "vendor/createjs/canvas_auto_rotation";
import flexpos from "vendor/createjs/flexpos";
const res = require('vendor/createjs/createjs-res');
import SoundManage from "vendor/sound/sound-manage";
// import AppData from "../common/AppData";
var indexSound = new SoundManage("./static/sounds/bg",{
    formats: [ "mp3"],
    loop: true,
});
vueApp.globalDispatcher.$on("musicPlay",musicPlayFunc);
function musicPlayFunc(obj){
    if(!obj.status){
        indexSound.stop();
    }else{
        indexSound.play();
    }
}
var flashObj={
  loading: {name: 'loading'},
  bottomLayer: {name: "bg"},
  topLayer: {name: "nav"},
  middleLayer: {
      index: {name: "index"},
  },
  asset: {
      
  },
  firstPage: 'index',
  firstload: ['index'],
  preload: [],
  preloadNum: 1,
};
var flash;
function resize(){
    console.log($('canvas')[0])
    let stageRect = canvasAutoRotation.canvasResize(
        $("canvas")[0],
        $(window).width(),
        $(window).height()
    );
    flexpos.displayResetPos(stageRect.width, stageRect.height);
}
function gotoPageHandler(e){
//   vueApp.Loading.open();
  flash.goto(e.page).done(()=>{
      setTimeout(()=>{
        //   vueApp.Loading.close();
      },50);
  });
}
export default function(){
//   vueApp.Loading.open() 
  flash = new res.Flash(document.getElementById('canvas'));
  flash.loadInit(flashObj)
  .done((lib) => {
      setTimeout(()=>{
        //   vueApp.Loading.close();
        //   if(AppData.musicStatus){
        //     indexSound.play();
        //   }
         
      },100);
  })
  vueApp.globalDispatcher.$on("gotoPage",gotoPageHandler);
  canvasAutoRotation.setRootDisplay(flash.getRootDisplay());
  $(window).on("resize",resize); 
  resize();
}
import QRCode from 'qrcode'
function getHaibao(data, cb){
    console.log('data',data)
    QRCode.toDataURL(data.qr_code,{
        margin: 1,
        width: 156,
        height: 156,
    })
    .then(codeurl => {
        console.log('codeurl',codeurl)
        // ||$('#haibaoCanvas')[0]
        var Ele = data.element;
        var haibaoStage = new createjs.Stage(Ele);
        var container=new createjs.Container();//绘制外部容器
            haibaoStage.addChild(container);
        
        // var imgArr = [ data.haibao_bg, data.qr_code, data.head, data.main_url ]
        var imgArr = [ data.haibao_bg, codeurl,data.head, data.main_url ]
        
        Promise.all(loadImg(imgArr)).then(function (res) {
            console.log(res,codeurl);
            var haibaoBgImg = res[0]; //背景
            var qrcodeImg = res[1];   //二维码
            // var qrcodeImg = codeurl;
            var qrcodeLogo = res[2];//头像
            
            var mainImg = res[3];  //主图
            
            // var headimgImg = res[2];
            var bitmap1 = new createjs.Bitmap(haibaoBgImg);
            // var bitmap2 = new createjs.Bitmap(headimgImg);
            var bitmap3 = new createjs.Bitmap(qrcodeImg);
            var bitmap4 = new createjs.Bitmap(qrcodeLogo);
            var bitmap5 = new createjs.Bitmap(mainImg);
            // 二维码
            console.log(bitmap3.image.width,bitmap3.image.height)
            bitmap3.scaleX=118/bitmap3.image.width
            bitmap3.scaleY=118/bitmap3.image.height
            // 头像
            
            bitmap4.scaleX=120/bitmap4.image.width
            bitmap4.scaleY=120/bitmap4.image.height

            var circle = new createjs.Shape();
            var txt = new createjs.Text(data.nickname,"26px Times","#000");
            circle.graphics.beginFill().drawCircle(129, 796, 52, 52); 
            // bitmap2.x = 48;
            // bitmap2.y = 843;
            bitmap3.x = 391;
            bitmap3.y = 733; //+63

            bitmap4.x = 66;
            bitmap4.y = 742; 

            bitmap5.x = 0;
            bitmap5.y = 166; //106

            txt.x = 86;
            txt.y = 863;

            bitmap4.mask = circle;
            container.addChild(bitmap1, bitmap3, bitmap4,txt,bitmap5);
            haibaoStage.update();
            // console.log('success',document.getElementById("haibaoCanvas"))
            // console.log('success',document.getElementsByTagName("canvas")[0])
            console.log('toDataURL',haibaoStage.toDataURL('image/png',1))
            var base64 = haibaoStage.toDataURL('image/png',1);
            // var base64 = (document.getElementsByTagName("canvas")[0]).toDataURL('image/jpeg');
            // var base64 = (document.getElementById("haibaoCanvas")).toDataURL('image/jpeg');
            cb&&cb({
                base64:base64,
                codeurl:codeurl
            });
        });
    })
    .catch(err => {
        console.error(err)
        vueApp.alert("生成失败！");
        // vueApp.Loading.close();
    });    
}
function loadImg(srcArr){
    var arr = [];
    srcArr.forEach(src=>{
        arr.push(new Promise(function (resolve, reject) {
            var image = new Image();
            image.onload = (e)=>{
                // console.log(e.path[0])
                console.log('image',image)
                resolve(image)
            };
            
            // image.crossOrigin = "Anonymous";

            // if( src.indexOf('?') == -1){
            //     image.src = src + "?timeStamp=" +Math.round(new Date() / 1000);
            // }else{
            //     image.src = src + "&timeStamp=" +Math.round(new Date() / 1000);
            // }
            console.log(image.src)
            image.src = src ;
            image.onerror = reject;
        }));
    });
    return arr;
}
function bimapRound(mBitmap,index){
    var  bitmap = Bitmap.createBitmap(mBitmap.getWidth(), mBitmap.getHeight(), Config.ARGB_4444);

    var canvas = new Canvas(bitmap);
    var paint = new Paint();
    paint.setAntiAlias(true);

    //设置矩形大小
    var rect = new Rect(0,0,mBitmap.getWidth(),mBitmap.getHeight());
    var rectf = new RectF(rect);

    // 相当于清屏
    canvas.drawARGB(0, 0, 0, 0);
    //画圆角
    canvas.drawRoundRect(rectf, index, index, paint);
    // 取两层绘制，显示上层
    paint.setXfermode(new PorterDuffXfermode(Mode.SRC_IN));

    // 把原生的图片放到这个画布上，使之带有画布的效果
    canvas.drawBitmap(mBitmap, rect, rect, paint);
    return bitmap;

}
export {
    getHaibao,
    loadImg,
}
var hex_sha1=require("./sha1.js");
var Weixin = {};
var ticket;
var shareOpt;
function createNonceStr() {
    var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var str = "";
    var length = 16;
    for (var i = 0; i < length; i++) {
      str +=chars.substr(Math.floor(Math.random()*(chars.length-1)), 1);
    }
    return str;
}
/**
 * @function 获取JSSDK
 */
Weixin.init = function (ticket,appID,shareObj,debug=false) {
    shareOpt=shareObj;
    var time=Math.floor(new Date().getTime()/1000);
    var nonceStr = createNonceStr();
    var url=window.location.href.split('#')[0];
    var string = "jsapi_ticket="+ticket+"&noncestr="+nonceStr+"&timestamp="+time+"&url="+url;
    var signature = hex_sha1(string);
    wx.config({
        debug: debug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: appID, // 必填，公众号的唯一标识
        timestamp: time, // 必填，生成签名的时间戳
        nonceStr: nonceStr, // 必填，生成签名的随机串
        signature: signature,// 必填，签名，见附录1
        jsApiList: [
            'checkJsApi',
            'addCard',
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'hideOptionMenu',
            'showOptionMenu',
            'startRecord',
            'stopRecord',
            'scanQRCode',
            'openAddress',
            'chooseWXPay'
        ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });
    Weixin.share(shareOpt);
}

/**
 *  微信支付
 */
Weixin.initPay = function(res, callback, failCallback) {
    wx.ready(function() {
        wx.chooseWXPay({
            timestamp: res.payRes.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
            nonceStr: res.payRes.nonceStr, // 支付签名随机串，不长于 32 位
            package: res.payRes.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
            signType: res.payRes.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
            paySign: res.payRes.paySign, // 支付签名
            success: function(data) {
                // 支付成功后的回调函数
                if(typeof callback == 'function') {
                    callback(data, res.orderID);
                }
            },
            cancel: function() {
                if(typeof failCallback == 'function') {
                    failCallback(res.orderID);
                }
            },
            fail: function() {
                if(typeof failCallback == 'function') {
                    failCallback(data, res.orderID);
                }
            }
        });
    });
};
/**
 * 读取地址
 */
Weixin.readAddress = function(callback) {
    wx.ready(function() {
        wx.openAddress({
            success: function(data) {
                if(typeof callback == 'function') {
                    callback(data);
                }
            },
            cancel: function() {}
        });
    });
};

/**
 * @function 老版API，调用微信JS接口
 * @param 方法名
 */
Weixin.call = function (method) {
    if ('WeixinJSBridge' in window) {
        WeixinJSBridge.call(method);
    } else {
        document.addEventListener('WeixinJSBridgeReady', function () {
            WeixinJSBridge.call(method);
        });
    }
};

/**
 * @function 老版API，显示分享按钮
 */
Weixin.showOptionMenu = function () {
    Weixin.call('showOptionMenu');
};

/**
 * @function 老版API，隐藏分享按钮
 */
Weixin.hideOptionMenu = function () {
    Weixin.call('hideOptionMenu');
};

/**
 * @function 微信分享
 */
Weixin.share= function (shareOpt) {
    Weixin.showOptionMenu();
    wx.ready(function () {
        wx.onMenuShareTimeline({
            title: shareOpt.desc, // 分享标题
            link: shareOpt.link, // 分享链接
            imgUrl: shareOpt.imgUrl, // 分享图标
            success: function(data){
                if(typeof shareOpt['success']=="function"){
                    shareOpt['success']('分享朋友圈');
                }
            }
        });

        wx.onMenuShareAppMessage({
            title: shareOpt.title||' ', // 分享标题
            desc: shareOpt.desc, //分享内容
            link: shareOpt.link, // 分享链接
            imgUrl: shareOpt.imgUrl, // 分享图标
            success: function(){
                if(typeof shareOpt['success']=="function"){
                    shareOpt['success']('分享给朋友');
                }
            }
        });
    })
};
/**
 * @function 添加卡券接口 （参数由后端给出）
 * @param cardId 
 * @param cardExt
 */
Weixin.addCard = function (cardId, cardExt) {
    var deferred = $.Deferred();

    wx.addCard({
        cardList: [{
            cardId: cardId,
            cardExt: cardExt
        }],
        success: deferred.resolve.bind(deferred),
        cancel: deferred.reject.bind(deferred)
    });

    return deferred.promise();
};

/**
 * @function 开始录音
 */
Weixin.startRecord = function () {
    wx.startRecord();
};

/**
 * @function 停止录音
 */
Weixin.stopRecord = function (success) {
    wx.stopRecord({
        success: success
    });
};
Weixin.qr=function(){
    wx.scanQRCode({
        needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
        success: function (res) {
            var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
        }
    });
}
Weixin.hideOptionMenu();
module.exports=Weixin;
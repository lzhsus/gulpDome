//获取字符串长度，新浪微博
exports.getStringLength=(function() {
    var trim = function(h) {
        try {
            return h.replace(/^\s+|\s+$/g, "");
        } catch (j) {
            return h;
        }
    };
    var byteLength = function(b) {
        if (typeof b == "undefined") {
            return 0;
        }
        var a = b.match(/[^\x00-\x80]/g);
        return (b.length + (!a ? 0 : a.length));
    };
    return function(q, g) {
        g = g || {};
        g.max = g.max || 140;
        g.min = g.min || 41;
        g.surl = g.surl || 20;
        var p = trim(q).length;
        if (p > 0) {
            var j = g.min, s = g.max, b = g.surl, n = q;
            var r = q.match(/(http|https):\/\/[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)+([-A-Z0-9a-z\$\.\+\!\_\*\(\)\/\,\:;@&=\?~#%]*)*/gi)|| [];
            var h = 0;
            for ( var m = 0, p = r.length; m < p; m++) {
                var o = byteLength(r[m]);
                if (/^(http:\/\/t.cn)/.test(r[m])) {
                    continue;
                } else {
                    if (/^(http:\/\/)+(weibo.com|weibo.cn)/.test(r[m])) {
                        h += o <= j ? o : (o <= s ? b : (o - s + b));
                    } else {
                        h += o <= s ? b : (o - s + b);
                    }
                }
                n = n.replace(r[m], "");
            }
            return Math.ceil((h + byteLength(n)) / 2);
        } else {
            return 0;
        }
    };
})
//截取字符长度
export.cutstr=function(str, len) {
  var temp;
  var icount = 0;
  var patrn = /[^\x00-\xff]/;
  var strre = "";
  for (var i = 0; i < str.length; i++) {
      if (icount < len - 1) {
          temp = str.substr(i, 1);
          if (patrn.exec(temp) == null) {
              icount = icount + 1
          } else {
              icount = icount + 2
          }
          strre += temp
      } else {
          break
      }
  }
  return strre + "...";
}
//转义html标签
export.htmlEncode= function(text) {
    return text.replace(/&/g, '&').replace(/\"/g, '"').replace(/</g, '<').replace(/>/g, '>');
}
//
export.htmlDecode=function(text) {
    return text.replace(/&/g, '&').replace(/"/g, '\"').replace(/</g, '<').replace(/>/g, '>')
}
//去掉左右空格
exports.trim=function(str){
    return str.replace(/(^\s*)|(\s*$)/g,"");
}
//去掉左边空格
exports.ltrim = function(str){
    return str.replace(/(^\s*)/g,"")
}
//去掉右边空格
exports.rtrim = function(str){
    return str.replace(/(\s*$)/g,"")
}
//判断是否是数字
exports.isNumber = function(s){
    return !isNaN(s);        
}
//判断输入的字符是否为中文
exports.isChinese = function(str){
        if(str.length!=0){
                reg=/^[\u0391-\uFFE5]+$/;
                if(!reg.test(str)){
                        // alert("对不起，您输入的字符串类型格式不正确!");
                        return false;
                }
        }
        return true;
}
//判断是否为空
exports.isEmpty = function(str){
        if(str==null||typeof str=="undefined"||exports.trim(str)==""){
                return true;
        }else{
                return false;
        }
} 
/**
 * @格式化金额 千位逗号分割  [1.支持负数  2.四舍五入两位小数]
 * @例如 123456789.456 => 123,456,789.46
 */
exports.formatCurrency = function(num) {
    num = num.toString().replace(/\$|\,/g, '');
    if (isNaN(num))
        num = "0";
    sign = (num == (num = Math.abs(num)));
    num = Math.floor(num * 100 + 0.50000000001);
    cents = num % 100;
    num = Math.floor(num / 100).toString();
    if (cents < 10)
        cents = "0" + cents;
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
        num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
    return (((sign) ? '' : '-') + num + '.' + cents);
}
exports.getQuery=function(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
//生成随机的字母数字字符串
exports.generateRandomAlphaNum=function(len) {
    var rdmString = "";
    for( ; rdmString.length < len; rdmString  += Math.random().toString(36).substr(2));
    return  rdmString.substr(0, len);
}


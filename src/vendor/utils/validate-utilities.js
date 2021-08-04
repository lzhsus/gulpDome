exports.checkEmail=function (str) {
    var reg = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    if (reg.test(str)) {
        return true;
    }
    return false;
}
exports.checkSampleEmail=function (str) {
    if (str.indexOf(".") != -1 && str.indexOf("@") != -1 && str.split(".").length >= 2 && str.split("@").length == 2) {
        return true;
    }
    return false;
}
exports.checkMobile=function (mobile) {
    var reg = /^((13|14|15|18|17)\d{9})$/;
    if (reg.test(mobile)) {
        return true;
    }
    return false;
}
exports.checkURL=function(url){
    var reg = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;
    if (reg.test(url)) {
        return true;
    }
    return false;
}
exports.checkNumber=function(url){
    var reg = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/;
    if (reg.test(url)) {
        return true;
    }
    return false;
}
exports.checkSpecialChars=function(url){
    var reg = /([\:\-\_]+(.))/g;
    if (reg.test(url)) {
        return true;
    }
    return false;
}

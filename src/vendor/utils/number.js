//14位
exports.ran16=function(){
    return Math.random().toString(16).substring(2);
}
//11位
exports.ran36=function(){
    Math.random().toString(36).substring(2); 
}
exports.isNumber=function(n){
    return !isNaN(parseFloat(n)) && isFinite(n);
}
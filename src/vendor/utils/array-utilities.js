exports.randomize=function (aArray) {
    var aCopy = aArray.concat();
    var aRandomized = new Array();
    var nRandom;
    for (var i = 0; i < aCopy.length; i++) {
        nRandom = Math.floor(Math.random() * aCopy.length);
        aRandomized.push(aCopy[nRandom]);
        aCopy.splice(nRandom, 1);
        i--;
    }
    return aRandomized;
}
//删除数组重复元素
exports.unique = function(data){  
    data = data || [];  
    var a = {};  
    for (var k=0; k<data.length; k++) {  
        var v = data[k];  
        if (typeof(a[v]) == 'undefined'){  
            a[v] = 1;  
        }  
    };  
    data.length=0;  
    for (var k in a){  
        data[data.length] = k;  
    }  
    return data;  
}

//快速取数组最大和最小值
exports.getMaxNumber=function(arr){
     Math.max.apply(Math, arr);
}
exports.getMinNumber=function(arr){
     Math.min.apply(Math, arr);
}

// 数组随机取不重复的几个元素
exports.getRandomCount = function(arr, count) {
    var randomArr = exports.randomize(arr);
    return randomArr.slice(0, count);
}
exports.isArray=function(obj){
    return Object.prototype.toString.call(obj) === '[object Array]' ;
}
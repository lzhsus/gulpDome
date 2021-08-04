var SHAKE_THRESHOLD = 2000;
var last_update;
var x, y, z, last_x, last_y, last_z;
var isYao;

init();

var exports = {};

function init() {
    isYao = false;
    last_update = x = y = z = last_x = last_y = last_z = 0;
    
    addListener();
}

exports.open = function () {
    isYao = true;
}

exports.close = function () {
    isYao = false;
}
exports.callback=function(){

}


function addListener() {
    if (window.DeviceMotionEvent) {
        window.addEventListener("devicemotion", deviceMotionHandler, false);
    }
}

function deviceMotionHandler(eventData) {
    var acceleration = eventData.accelerationIncludingGravity;
    var curTime = new Date().getTime();
    if (curTime - last_update > 100 && isYao) {
        var diffTime = curTime - last_update;
        last_update = curTime;
        x = acceleration.x;
        y = acceleration.y;
        z = acceleration.z;
        var speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000;
        if (speed > SHAKE_THRESHOLD) {
            if (typeof exports.callback === "function") {
                exports.callback(eventData);
            }
        }
        last_x = x;
        last_y = y;
        last_z = z;
    }
}

module.exports = exports;
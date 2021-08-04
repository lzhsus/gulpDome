// Stopwatch..................................................................
//
// You can start and stop a stopwatch and you can find out the elapsed
// time the stopwatch has been running. After you stop a stopwatch,
// its getElapsedTime() method returns the elapsed time
// between the start and stop.

var Stopwatch = function() {
    this.startTime = 0;
    this.running = false;
    this.elapsed = undefined;

    this.paused = false;
    this.startPause = 0;
    this.totalPausedTime = 0;
};

// You can get the elapsed time while the stopwatch is running, or after it's
// stopped.

Stopwatch.prototype = {
    start: function() {
        this.startTime = +new Date();
        this.running = true;
        this.totalPausedTime = 0;
        this.startPause = 0;
    },

    stop: function() {
        if (this.paused) {
            this.unpause();
        }

        this.elapsed = (+new Date()) - this.startTime - this.totalPausedTime;
        this.running = false;
    },

    pause: function() {
        this.startPause = +new Date();
        this.paused = true;
    },

    unpause: function() {
        if (!this.paused) {
            return;
        }

        this.totalPausedTime += (+new Date()) - this.startPause;
        this.startPause = 0;
        this.paused = false;
    },

    getElapsedTime: function() {
        if (this.running) {
            return (+new Date()) - this.startTime - this.totalPausedTime;
        } else {
            return this.elapsed;

        }
    },


    isPaused: function() {
        return this.paused;
    },

    isRunning: function() {
        return this.running;
    },

    reset: function() {
        this.elapsed = 0;
        this.startTime = +new Date();
        this.running = false;
        this.totalPausedTime = 0;
        this.startPause = 0;
    }
};

var AnimationTimer = function(duration, timeWarp) {
    // this.timeWarp = timeWarp || this.makeEaseOut(2);
    this.timeWarp = timeWarp || this.easing.easeOutCubic;
    if (duration !== undefined) this.duration = duration;
    this.stopwatch = new Stopwatch();
};

AnimationTimer.prototype = {
    start: function() {
        this.stopwatch.start();
    },
    stop: function() {
        this.stopwatch.stop();
    },
    getElapsedTime: function() {
        var elapsedTime = this.stopwatch.getElapsedTime();
        var percentComplete = elapsedTime / this.duration;
        if (!this.stopwatch.running) {
            return undefined;
        }
        if (this.timeWarp == undefined) {
            return elapsedTime;
        }
        return elapsedTime * (this.timeWarp(percentComplete) / percentComplete);
    },
    isRunning: function() {
        return this.stopwatch.isRunning();
    },
    isOver: function() {
        return this.stopwatch.getElapsedTime() > this.duration;
    },
    makeEaseInOut: function(percentComplete) {
        return percentComplete - Math.sin(percentComplete * 2 * Math.PI) / (2 * Math.PI)
    },
    makeEaseOut: function(strength) {
        return function(percentComplete) {
            return 1 - Math.pow(1 - percentComplete, strength * 2);
        }
    },
    easing: {

        linear: function(t) {
            return t;
        },

        easeInQuad: function(t) {
            return Math.pow(t, 2);
        },

        easeOutQuad: function(t) {
            return t * (2 - t);
        },

        easeInOutQuad: function(t) {
            return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        },

        easeInCubic: function(t) {
            return t * t * t;
        },

        easeOutCubic: function(t) {
            return (--t) * t * t + 1;
        },

        easeInOutCubic: function(t) {
            return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        }

    }
}
module.exports=AnimationTimer;
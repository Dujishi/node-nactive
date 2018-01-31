/**
 * 缓动动画
 * 可侦听的事件类型:
 *     update    需要计算的值发生变化的时候触发
 *     stop      动画停止的时候触发
 *     complate  动画完成的时候触发，该事件之前总会触发stop事件
 * @example
 *     Tween.create({
 *         easing    : 'InOut',
 *         frame     : 20,
 *         delay     : 0,
 *         time      : 2000
 *     }).from({x:0,y:0})
 *       .to({x:50,y:100})
 *       .on('update',function(obj){
 *           el.left = obj.x
 *           el.top  = obj.y
 *       }).start();
 */

function apply(o, c, defaults) {
    // no "this" reference for friendly out of scope calls
    if (defaults) {
        apply(o, defaults);
    }
    if (o && c && typeof c == 'object') {
        for (var p in c) {
            o[p] = c[p];
        }
    }
    return o;
}

var options = {
    easing    : 'linear', // 参考easingMap
    frame     : 40,  //帧数
    delay     : 0,
    time      : 300 //动画持续时间
};
var easingMap = {
    linear : function(t,b,c,d){
        return c*t/d+b;
    },
    easeIn: function(t,b,c,d){
        return c*(t/=d)*t + b;
    },
    easeOut: function(t,b,c,d){
        return -c *(t/=d)*(t-2) + b;
    },
    easeInOut: function(t,b,c,d){
        if ((t/=d/2) < 1) return c/2*t*t + b;
        return -c/2 * ((--t)*(t-2) - 1) + b;
    }
};

class Observe{
    constructor(){}
    on(key, func) {
        if (!this.__events__) {
            this.__events__ = {};
        }
        this.__events__[key] = func;
        return this
    }
    off (key) {
        if (!this.__events__) {
            return this;
        }
        if(key){
            delete this.__events__[key];
        }else{
            delete this.__events__ ;
        }
        return this;
    }
    trigger(key, args) {
        if (!this.__events__) {
            return null;
        }
        if (!this.__events__[key]) {
            return null;
        }
        return this.__events__[key].apply(this,args);
    }
}

class Tween extends Observe{
    constructor(obj){
        super(obj);
        this.options = apply({}, obj||{},options);
        this.loopTimer = null;
        this.delayTimer= null;
        this.startTime = 0;
        this.endTime   = 0;
        this.looping   = false;
        this.easingFunc= easingMap[this.options.easing];
    }
    from (obj){
        this._from = obj;
        return this;
    }
    to(obj){
        this._to = obj;
        return this;
    }
    start(){
        clearTimeout(this.delayTimer);
        this.delayTimer = setTimeout(() => {
            this.startTime = new Date().getTime();
            this.endTime   = this.time + this.startTime;
            if(!this.looping){
                this.looping = true;
                this.eventLoop();
            }
        },this.delay);
        return this;
    }
    stop (){
        this.looping = false;
        clearTimeout(this.loopTimer);
        clearTimeout(this.delayTimer);
        this.trigger('stop');
        return this;
    }
    complate (){
        this.stop();
        if(this._to){
            this.trigger('update',[this._to]);
            this.from(null);
            this.to(null);
            this.trigger('complate');
        }
        return this;
    }
    eventLoop (){
        var now = new Date().getTime();
        var posTime = now - this.startTime;
        var time = this.options.time;
        if(posTime>= time){ //end animate
            this.complate();
            return;
        }
        var animObj = {};
        for(var i in this._from){
            var f = this._from[i];
            var t = this._to[i];
            animObj[i] = this.easingFunc(posTime,f,t-f,time);
        }
        this.trigger('update',[animObj]);

        clearTimeout(this.loopTimer);
        this.loopTimer = setTimeout(()=>{
            this.eventLoop();
        },1000/this.options.frame);
    }
}


module.exports = Tween;
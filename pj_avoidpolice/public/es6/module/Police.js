var Police = Hilo.Class.create({
    Extends: Hilo.Container,
    constructor: function(properties) {
        Police.superclass.constructor.call(this, properties);

        this.screenHeight = this.height;

        this.landCols = 5;
        this.landRows = 4;
        this.landWidth = this.width / this.landCols;
        this.landHeight = this.height / this.landRows;

        this.policeOffScreenNum = this.landRows;
        this.policeNum = this.policeOffScreenNum * 2;
        this.policeOriginX = (this.landWidth - properties.image.width) / 2;
        this.policeOriginY = 0;
        this.policeHeight = properties.image.height;

        this.height = this.landHeight * this.policeNum;
        this.y = -this.height;

        this.createRoad(properties)
        this.createPolice(properties)
        this.moveTween = new Hilo.Tween(this, null, {
            onComplete: this.resetPolice.bind(this)
        });
    },

    startX: 0, //起始x轴坐标
    startTime: 0,
    passThrough: 0,
    duration: 0,

    createRoad: function(properties) {
        // this.road = new Hilo.Bitmap({
        //     image: properties.road,
        //     x: 0,
        //     y: 0
        // }).addTo(this);
    },

    createPolice: function(properties) {
        for (var i = 0; i < this.policeNum; i++) {
            var police = new Hilo.Bitmap({
                id: 'police' + i,
                image: properties.image
            }).addTo(this);

            this.placePolice(police, i);
        }
    },

    placePolice: function(police, i) {
        police.x = this.policeOriginX + Math.floor(Math.random() * this.landCols) * this.landWidth;
        police.y = this.landHeight * (this.policeNum - 1 - i);
    },

    onUpdate: function() {
        // this.touch.x = this.car.x - this.gap
        // this.car.x = this.touch.x + this.gap
    },

    resetPolice: function() {
        var total = this.children.length;

        //把已移出屏幕外的警察放到队列最后面，并重置它们的位置
        for(var i = 0; i < this.policeOffScreenNum; i++){
            var police = this.getChildAt(0);
            this.setChildIndex(police, total - 1);
            this.placePolice(police, this.policeOffScreenNum + i);
        }

        //重新确定队列中所有管子的y轴坐标
        for(var i = 0; i < this.policeOffScreenNum; i++){
            var police = this.getChildAt(i);
            police.y = this.landHeight * (this.policeNum - 1 - i);
        }

        //重新确定障碍的x轴坐标
        this.y = -this.height / 2;

        //更新穿过的管子数量
        this.passThrough += this.policeOffScreenNum;

        //继续移动
        this.startMove();
    },

    startMove: function() {
        //设置缓动的x轴坐标
        var targetY = 0;
        Hilo.Tween._tweens.push(this.moveTween);
        //设置缓动时间
        this.moveTween.duration = this.duration || (-this.y) * 3;
        
        //设置缓动的变换属性，即x从当前坐标变换到targetX
        this.moveTween.setProps({y:this.y}, {y:targetY});
        //启动缓动动画
        this.moveTween.start();
    },

    speedUp: function() {
        this.duration = parseInt(this.moveTween.duration * 0.9, 10);
    },

    stopMove: function(){
        if(this.moveTween) this.moveTween.pause();
        this.duration = 0;
    },

    checkCollision: function(car){
        for(var i = 0, len = this.children.length; i < len; i++){
            if(car.hitTestObject(this.children[i], true)){
                return true;
            }
        }
        return false;
    },

    calcPassThrough: function(scoreLine){

        // 最小移动多少距离才能得第1分
        var min = scoreLine - (this.screenHeight - this.landHeight);
        var moveHeight = this.y + this.screenHeight;
        var count = 0;

        if (moveHeight >= min) {
            count = Math.ceil((moveHeight - min) / this.landHeight)
        }
        count += this.passThrough;

        return count;
    },

    reset: function() {
        this.x = this.startX;
        this.passThrough = 0;
    }
})

module.exports = Police;

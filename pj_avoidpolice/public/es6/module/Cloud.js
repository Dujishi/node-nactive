var Cloud = Hilo.Class.create({
    Extends: Hilo.Container,
    constructor: function(properties){
        Cloud.superclass.constructor.call(this, properties);
        this.init(properties);
        this.height = this.height * 2;
        this.y = -this.height
    },

    init: function(properties){
        this.cloudLeft = new Hilo.Bitmap({
            image: properties.cloudLeft,
            x: 0,
            y: -properties.cloudLeft.height - 56
        });

        this.cloudRight = new Hilo.Bitmap({
            image: properties.cloudRight,
            x: this.width - properties.cloudRight.width,
            y: -this.height
        });

        this.addChild(this.cloudLeft, this.cloudRight);
    },

    startMove: function() {
        this.moveTween = Hilo.Tween.to(this, {y: this.height * 2}, {duration: 12000, loop: true})
    },

    stopMove: function(){
        if(this.moveTween) this.moveTween.pause();
    },
});

module.exports = Cloud;

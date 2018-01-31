var PlayingScene = Hilo.Class.create({
    Extends: Hilo.Container,
    constructor: function(properties){
        PlayingScene.superclass.constructor.call(this, properties);
        this.init(properties);
    },

    init: function(properties){
        this.scoreBg = new Hilo.Bitmap({
            image: properties.scoreBg,
            x: 28,
            y: 24
        });

        //当前分数
        this.currentScore = new Hilo.BitmapText({
            id: 'score',
            glyphs: properties.numberGlyphs,
            text: 0,
            x: 115,
            y: 58,
            scaleX: 0.3,
            scaleY: 0.3,
        });

        this.road = new Hilo.Bitmap({
            image: properties.road,
            x: 0,
            y: -properties.road.height / 3
        });
        
        this.addChild(this.road, this.scoreBg, this.currentScore);
    },

    startMove: function() {
        this.moveTween = Hilo.Tween.to(this.road, {y: 0}, {duration: 3000, loop: true})
    },

    stopMove: function(){
        if(this.moveTween) this.moveTween.pause();
    },
});

module.exports = PlayingScene;

var LoadingScene = Hilo.Class.create({
    Extends: Hilo.Container,
    constructor: function(properties){
        LoadingScene.superclass.constructor.call(this, properties);

        // 加载条底部间隔
        this.barBottomGap = 63;
        // 加载条宽度
        this.barWidth = 544 * properties.scale;
        // 加载条上的轮胎宽度
        this.tireWidth = 32;

        this.asset = properties.asset;

        this.init(properties);
        this.bindEvent();
    },

    loadedAsset: 0,

    init: function(properties){
        var topGap = properties.winHeight - this.barBottomGap;
        var barX = 50 * properties.winWidth / 375;

        var bg = this.bg = new Hilo.Bitmap({
            image: properties.bg,
            width: properties.width,
            height: properties.height
        });

        var rank = this.rank = new Hilo.Bitmap({
            image: properties.rank,
            x: 20,
            y: 40
        });

        var desc = this.desc = new Hilo.Bitmap({
            image: properties.desc,
            x:  properties.width - properties.desc.width - 20,
            y: 40
        });

        var outer = this.outer = new Hilo.DOMElement({
            element: Hilo.createElement('div', {
                style: {
                    backgroundColor: '#805900',
                    position: 'absolute',
                    borderRadius: '6px',
                    border: '2px solid #fff',
                }
            }),
            width: this.barWidth,
            height: 11,
            x: barX,
            y: topGap - 13
        });

        var inner = this.inner = new Hilo.DOMElement({
            element: Hilo.createElement('div', {
                style: {
                    backgroundColor: '#ffd400',
                    position: 'absolute',
                    borderRadius: '6px',
                }
            }),
            width: 0,
            height: 11,
            x: barX + 2,
            y: topGap - 11
        });

        var tire = this.tire = new Hilo.DOMElement({
            element: Hilo.createElement('img', {
                src: properties.tire.src,
                style: {
                    position: 'absolute',
                }
            }),
            x: barX,
            y: topGap - 13,
            width: this.tireWidth,
            height: this.tireWidth,
            pivotX: 16,
            pivotY: 16,
        });

        // var loading = this.loading = new Hilo.Bitmap({
        //     image: properties.loading,
        // });
        // loading.x = properties.width - loading.width >> 1;
        // loading.y = properties.height - loading.height - 78;

        var loading = this.loading = new Hilo.DOMElement({
            element: Hilo.createElement('img', {
                src: properties.loading.src,
                style: {
                    position: 'absolute',
                }
            }),
            y: topGap + 10,
            width: properties.loading.width / 2,
            height: properties.loading.height / 2,
        });

        loading.x = (properties.winWidth - loading.width) / 2;


        var start = this.start = new Hilo.Bitmap({
            image: properties.start,
            id: 'start',
            visible: false
        })

        start.x = properties.width - start.width >> 1
        start.y = properties.height - start.height - 84

        this.addChild(bg, rank, desc, outer, inner, tire, loading, start);
    },

    bindEvent: function() {
        this.rank.on(Hilo.event.POINTER_START, function(e){
            e._stopped = true;
            window.GLOBAL.showRank();
            // document.getElementById('rank').style.display = 'block';
        }.bind(this));

        this.desc.on(Hilo.event.POINTER_START, function(e){
            e._stopped = true;
            window.GLOBAL.showDesc();
        }.bind(this));
    },

    ready: function() {
        this.outer.visible = false;
        this.inner.visible = false;
        this.tire.visible =false;
        this.loading.visible =false;
        this.start.visible = true;
        Hilo.Tween.from(this.start, {y: this.height}, {duration: 200});
    },

    update: function(percentage) {
        var barWidth = this.barWidth;
        var width = barWidth * percentage;
        var loop = barWidth / (this.tireWidth * Math.PI);

        Hilo.Tween.to(this.inner, {width: width}, {duration:400, loop:false, reverse:false});
        Hilo.Tween.to(this.tire, {
            x: 50 + width, 
            rotation: 360 * loop * percentage
        }, {
            duration:400, 
            onComplete: function() {
                
            }
        });
        // this.tire.on('onComplete', function() {
        //     console.log(22)
        // })
    }
});

module.exports = LoadingScene;

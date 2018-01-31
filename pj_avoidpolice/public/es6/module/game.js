const Asset = require('./Asset');
const CarContainer = require('./Car');
const LoadingScene = require('./LoadingScene');
const PlayingScene = require('./PlayingScene');
const Police = require('./Police');

const WIN_WIDTH = window.innerWidth || document.documentElement.clientWidth || 375;
const WIN_HEIGHT = window.innerHeight || document.documentElement.clientHeight || 603;

var game = {
    // 程序入口
    init: function(){
        this.asset = new Asset();
        this.asset.on('loadingQueueComplete', function(e){
            this.asset.off('loadingQueueComplete');
            this.initStage();
        }.bind(this));
        this.asset.loadLoadingAssets();
    },

    // 初始化舞台
    initStage: function(){
        this.width = 750;
        this.height = 1206;
        this.scaleX = WIN_WIDTH / this.width;
        this.scaleY = WIN_HEIGHT / this.height;

        //舞台
        this.stage = new Hilo.Stage({
            // renderType:'webgl',
            renderType:'canvas',
            width: this.width,
            height: this.height,
            scaleX: this.scaleX,
            scaleY: this.scaleY,
            background: '#2f364f'
        });
        document.body.appendChild(this.stage.canvas);

        //启动计时器
        this.ticker = new Hilo.Ticker(60);
        this.ticker.addTick(Hilo.Tween);
        this.ticker.addTick(this.stage);
        this.ticker.start();

        //绑定交互事件
        this.stage.enableDOMEvent([Hilo.event.POINTER_START, Hilo.event.POINTER_MOVE, Hilo.event.POINTER_END]);
        // this.stage.on(Hilo.event.POINTER_START, this.onUserInput.bind(this));

        //初始化加载页面
        this.initLoadingScene();

        // 监听资源加载事件
        this.asset.on('load', function() {
            var loaded = this.asset.queue.getLoaded();
            var total = this.asset.queue.getTotal();
            this.loadingScene.update(loaded / total);
        }.bind(this));

        // 资源加载完成
        this.asset.on('complete', function() {
            setTimeout(function() {
                this.loadingScene.ready();
                if (!localStorage.getItem('avoidpolice_inited')) {
                    window.GLOBAL.showDesc();
                    localStorage.setItem('avoidpolice_inited', true);
                }
            }.bind(this), 600);
            this.stage.onUpdate = this.onUpdate.bind(this);
            this.initPlayingScene();
            this.initPolice();
            this.initCar();
            // this.initCloud();
            // this.initDialog();
        }.bind(this));

        // 开始加载资源
        this.asset.load();
    },

    // initDialog: function() {
    //     this.dialog = new Hilo.DOMElement({
    //         element: document.getElementById('dialog'),
    //     });

    //     Hilo.Tween.from(this.dialog, {top: -100}, {duration: 400})
    // },

    initLoadingScene: function() {
        this.loadingScene = new LoadingScene({
            width: this.width,
            height: this.height,
            winWidth: WIN_WIDTH,
            winHeight: WIN_HEIGHT,
            scale: this.scaleX,
            bg: this.asset.bg,
            rank: this.asset.rank,
            desc: this.asset.desc,
            loading: this.asset.loading,
            tire: this.asset.tire,
            start: this.asset.start,
            visible: true,
            asset: this.asset,
        }).addTo(this.stage, 10);

        this.loadingScene.getChildById('start').on(Hilo.event.POINTER_START, function(e){
            if (!window.GLOBAL.isLogin()) {
                window.GLOBAL.showLogin();
                return;
            }

            e._stopped = true;
            this.gameStart();
            // 禁止默认的touch行为
            document.ontouchstart = function(e){
                e.preventDefault();
            };
        }.bind(this));
    },

    initCar: function() {
        this.carContainer = new CarContainer({
            carImage: this.asset.car,
            touchImage: this.asset.touch,
            width: this.width,
            height: this.height,
            visible: false,
        }).addTo(this.stage, this.loadingScene.depth - 1);
        this.car = this.carContainer.car;
    },

    initPolice: function() {
        this.police = new Police({
            image: this.asset.police,
            road: this.asset.road,
            width: this.width,
            height: this.height,
            visible: false,
        }).addTo(this.stage, this.loadingScene.depth - 1);

    },

    initCloud: function() {
        this.cloud = new Cloud({
            cloudLeft: this.asset.cloudLeft,
            cloudRight: this.asset.cloudRight,
            width: this.width,
            height: this.height,
            visible: false,
        }).addTo(this.stage, this.loadingScene.depth - 1)
    },

    initPlayingScene: function() {
        this.playingScene = new PlayingScene({
            width: this.width,
            height: this.height,
            scoreBg: this.asset.scoreBg,
            numberGlyphs: this.asset.numberGlyphs,
            road: this.asset.road,
            visible: false,
        }).addTo(this.stage, this.loadingScene.depth - 1);
        this.currentScore = this.playingScene.currentScore;
    },

    speedLevel: 0,
    levelPoliceNum: 4,
    isSpeedUp: false,
    speedUp: function() {
        setInterval(function() {
            this.police.speedUp()
        }.bind(this), 3000);
    },

    onUpdate: function(delta){
        if (this.state !== 'playing') {
            return;
        }

        //碰撞检测
        if(this.police.checkCollision(this.car)){
            this.gameOver();
            return;
        }

        var score = this.calcScore();
        this.currentScore.setText(score);

        // 开启加速功能
        if (!this.isSpeedUp && score >= 40) {
            this.speedUp();
            this.isSpeedUp = true;
        }
        

        // if (Math.floor(score / this.levelPoliceNum) > this.speedLevel) {
        //     this.police.speedUp();
        //     this.speedLevel++;
        // }

        // if(this.police.checkCollision(this.car)){
        //     // alert('游戏结束')
        // }
        // if(this.state === 'ready'){
        //     return;
        // }

        // if(this.car.isDead){
        //     this.gameOver();
        // }else{
        //     // this.currentScore.setText(this.calcScore());
        //     //碰撞检测
        //     if(this.police.checkCollision(this.car)){
        //         this.gameOver();
        //     }
        // }
    },

    gameReady: function(){
        this.state = 'ready';
        this.score = 0;
        this.currentScore.visible = false;
        this.currentScore.setText(this.score);
        this.loadingScene.visible = true;
        this.police.reset();

        
        // this.bird.getReady();

        // Hilo.Tween.to(this.loadingScene, {x: 0}, {duration: 400, onComplete: function() {
        //     this.carContainer.visible = false;
        //     this.police.visible = false;
        //     this.cloud.visible = false;
        //     this.playingScene.visible = false;
        // }.bind(this)});
    },

    gameStart: function(){
        this.state = 'playing';
        this.carContainer.visible = true;
        this.police.visible = true;
        // this.cloud.visible = true;
        this.playingScene.visible = true;

        Hilo.Tween.to(this.loadingScene, {x: -this.width}, {duration: 400, onComplete: function() {
            this.gameStartMove();
        }.bind(this)});
    },

    gameStartMove: function() {
        this.police.startMove();
        // this.cloud.startMove();
        this.playingScene.startMove();
        this.loadingScene.visible = false;
    },

    gameOver: function(){
        if(this.state !== 'over'){
            //设置当前状态为结束over
            this.state = 'over';
            //停止障碍的移动
            this.police.stopMove();
            // this.cloud.stopMove();
            this.playingScene.stopMove();
            this.carContainer.stopDrag();

            window.GLOBAL.showResult();

            document.ontouchstart = null;
            // this.carContainer.touch.stopDrag();

            // //小鸟跳转到第一帧并暂停
            // this.bird.goto(0, true);
            // //隐藏屏幕中间显示的分数
            // this.currentScore.visible = false;
            // //显示结束场景
            // this.gameOverScene.show(this.calcScore(), this.saveBestScore());
        }
    },

    calcScore: function(){
        var count = this.police.calcPassThrough(this.carContainer.y + this.car.height);
        return this.score = count * 10;
    }


    
};

module.exports = game;

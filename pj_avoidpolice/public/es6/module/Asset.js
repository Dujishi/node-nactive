var Asset = Hilo.Class.create({
    Mixes: Hilo.EventMixin,

    initialQuene: null,
    queue: null,
    bg: null,
    ground: null,
    ready: null,
    over: null,
    numberGlyphs: null,
    holdback: null,

    loadLoadingAssets: function() {
        var resources = [
            {id:'bg', src:'/pj_avoidpolice/public/images/bg.jpg'},
            {id:'tire', src:'/pj_avoidpolice/public/images/tire.png'},
            {id:'start', src:'/pj_avoidpolice/public/images/start.png'},
            {id:'rank', src:'/pj_avoidpolice/public/images/rank.png'},
            {id:'desc', src:'/pj_avoidpolice/public/images/desc.png'},
            {id:'loading', src:'/pj_avoidpolice/public/images/loading.png'}
        ];

        this.loadingQuene = new Hilo.LoadQueue();
        this.loadingQuene.add(resources);
        this.loadingQuene.on('complete', function() {
            this.bg = this.loadingQuene.get('bg').content;
            this.rank = this.loadingQuene.get('rank').content;
            this.desc = this.loadingQuene.get('desc').content;
            this.tire = this.loadingQuene.get('tire').content;
            this.start = this.loadingQuene.get('start').content;
            this.loading = this.loadingQuene.get('loading').content;
            this.loadingQuene.off('complete');
            this.fire('loadingQueueComplete');
        }.bind(this));
        this.loadingQuene.start();
    },

    load: function(){
        var resources = [
            {id:'car', src:'/pj_avoidpolice/public/images/car.png'},
            {id:'cloudLeft', src:'/pj_avoidpolice/public/images/cloud_left.png'},
            {id:'cloudRight', src:'/pj_avoidpolice/public/images/cloud_right.png'},
            {id:'police', src:'/pj_avoidpolice/public/images/police.png'},
            {id:'scoreBg', src:'/pj_avoidpolice/public/images/score_bg.png'},
            {id:'start', src:'/pj_avoidpolice/public/images/start.png'},
            {id:'touch', src:'/pj_avoidpolice/public/images/touch.png'},
            {id:'number', src:'/pj_avoidpolice/public/images/number.png'},
            {id:'road', src:'/pj_avoidpolice/public/images/road.jpg'},
        ];

        this.queue = new Hilo.LoadQueue();
        this.queue.add(resources);
        this.queue.on('load', function() {
            this.fire('load');
        }.bind(this));
        this.queue.on('complete', this.onComplete.bind(this));
        this.queue.start();
    },

    onComplete: function(e){
        this.car = this.queue.get('car').content;
        this.cloudLeft = this.queue.get('cloudLeft').content;
        this.cloudRight = this.queue.get('cloudRight').content;
        this.police = this.queue.get('police').content;
        this.scoreBg = this.queue.get('scoreBg').content;
        this.start = this.queue.get('start').content;
        this.touch = this.queue.get('touch').content;
        this.road = this.queue.get('road').content;

        var number = this.queue.get('number').content;
        this.numberGlyphs = {
            0: {image:number, rect:[24,42,78,104]},
            1: {image:number, rect:[144,42,78,104]},
            2: {image:number, rect:[264,42,78,104]},
            3: {image:number, rect:[384,42,78,104]},
            4: {image:number, rect:[504,42,78,104]},
            5: {image:number, rect:[624,42,78,104]},
            6: {image:number, rect:[744,42,78,104]},
            7: {image:number, rect:[864,42,78,104]},
            8: {image:number, rect:[984,42,78,104]},
            9: {image:number, rect:[1104,42,78,104]},
            '+': {image:number, rect:[1344,42,78,104]},
        };

        this.queue.off('complete');
        this.fire('complete');
    }
});

module.exports = Asset;
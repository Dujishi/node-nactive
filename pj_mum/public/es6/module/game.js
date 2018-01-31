
const isDev = location.hostname.indexOf('localhost') > -1;
const GAME_TIME = isDev ? 1000 : 15 * 1000; // 毫秒
const MAX_SCORE = 6;
const $container = $('#game-container');

const game = {
    isGameStart: false,
    isGameOver: false,
    score: 0,
    init() {
        this.create();
        this.bindEvents();
    },
    create() {
        const arr = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6];
        const newArr = randomSort(arr, []);
        let html = '';
        this.score = 0;
        newArr.forEach((v) => {
            html += `<li><div data-id="${v}" class="mum mum${v}"></div></li>`;
        });
        $container.html(html);
        $container.find('.mum').animateCss('zoomIn');
        $('#game-time').text(this.calcTime(GAME_TIME));
    },

    removeItem($el) {
        $el.animateCss('rotateOut', function() {
            $el.remove();
        });
    },

    turnOverItem($el) {
        $el.removeClass('selected').animateCss('flipInY');
    },

    calcTime(ms) {
        const seconds = Math.floor(ms / 1000);
        let milliseconds = Math.floor((ms / 10) % 100);
        if (milliseconds < 10) {
            milliseconds = `0${milliseconds}`;
        }
        return ms > 0 ? `${seconds}:${milliseconds}` : '0:00';
    },

    countDown(callback) {
        const that = this;
        const $time = $('#game-time');
        const startTime = Date.now();

        const timer = setInterval(() => {
            const ms = GAME_TIME - (Date.now() - startTime);
            $time.text(this.calcTime(ms));
            if (ms <= 0 || that.score >= MAX_SCORE) {
                clearInterval(timer);
                if (typeof callback === 'function') {
                    callback();
                }
            }
        }, 10);
    },

    replay() {
        this.isGameStart = false;
        this.isGameOver = false;
        this.create();
    },

    gameOver() {
        const that = this;
        window.handleGameOver(that.score);
    },

    startCount() {
        const that = this;
        that.isGameStart = true;
        that.countDown(() => {
            that.isGameOver = true;
            setTimeout(() => {
                that.gameOver();
            }, 400);
        });
    },

    bindEvents() {
        const that = this;
        $container.on('click', '.mum', function() {
            const $this = $(this);
            const $selected = $container.find('.selected');

            if (that.isGameOver || $this.hasClass('selected')) {
                return false;
            }

            if (!that.isGameStart) {
                that.startCount();
            }

            if ($selected.length >= 2) {
                $selected.each(function () {
                    that.turnOverItem($(this));
                });
            }

            if ($selected.length === 1 && $selected.data('id') === $this.data('id')) {
                that.removeItem($selected);
                that.removeItem($this);
                that.score += 1;
            }

            $this.addClass('selected').animateCss('flipInY', function() {});

            // $this.addClass('selected').animateCss('flipInY', function() {
            //     if ($selected.length === 1 && $selected.data('id') === $this.data('id')) {
            //         that.removeItem($selected);
            //         that.removeItem($this);
            //     }
            // });
        });
    },
};

function randomSort(arr, newArr) {
    // 如果原数组arr的length值等于1时，原数组只有一个值，其键值为0
    // 同时将这个值push到新数组newArr中
    if (arr.length === 1) {
        newArr.push(arr[0]);
        return newArr; // 相当于递归退出
    }
    // 在原数组length基础上取出一个随机数
    const random = Math.ceil(Math.random() * arr.length) - 1;
    // 将原数组中的随机一个值push到新数组newArr中
    newArr.push(arr[random]);
    // 对应删除原数组arr的对应数组项
    arr.splice(random, 1);
    return randomSort(arr, newArr);
}

module.exports = game;

var CarContainer =  Hilo.Class.create({
    Extends: Hilo.Container,
    constructor: function(properties) {
        CarContainer.superclass.constructor.call(this, properties);
        this.width = properties.touchImage.width;
        this.height = properties.touchImage.height + properties.carImage.height + 16;
        this.x = properties.width - this.width >> 1;
        this.y = properties.height - this.height - 90 >> 0;

        this.init(properties);
    },

    isDead: false,

    init: function(properties) {
        var car = this.car = new Hilo.Bitmap({
            id: 'car',
            image: properties.carImage
        }).addTo(this);

        var touch = this.touch = new Hilo.Bitmap({
            id: 'touch',
            image: properties.touchImage
        }).addTo(this);

        car.x = this.width - car.width >> 1;
        car.y = 0;
        touch.x = this.width - touch.width >> 1;
        touch.y = this.height - touch.height >> 0;

        // car.x = properties.width - car.width >> 1;
        // car.y = properties.height - car.height - 180 >> 0;
        // touch.x = properties.width - touch.width >> 1;
        // touch.y = properties.height - touch.height - 90 >> 0;

        // this.gap = car.x - touch.x;

        // mix drag
        // Hilo.copy(touch, Hilo.drag);
        // touch.startDrag([this.x - this.gap, touch.y, properties.width - car.width, 0]);

        Hilo.copy(this, Hilo.drag);
        this.startDrag([-(this.width - car.width) / 2, this.y, properties.width - car.width, 0]);
    },

    // onUpdate: function() {
    //     // this.touch.x = this.car.x - this.gap
    //     this.car.x = this.touch.x + this.gap
    // }
})

module.exports = CarContainer;

/**
 * createBy Fiona
 * 2017/3/13
 */
const Util = function  () {
    return{
        /**
         * [手势监听]
         * @param  {[type]}   el [绑定的元素]
         * @param  {Function} fn [回调方法]
         * @return {[type]}      [description]
         */
        touchMove: function(event,fn){
            let tapObj = {};
            let touches = [];
            let el = $(event);

            let handler = (e) => {
                e.tapObj = tapObj;
                fn.call(this,e);
            }

            el.on('touchstart',function(event){
                touches = [];
                let _touchstart = event.touches[0];
                touches.push(touches);
                tapObj.pagX = _touchstart.pageX;
                tapObj.pagY = _touchstart.pageY;
                tapObj.clientX = _touchstart.clientX;
                tapObj.clientY = _touchstart.clientY;

            })

            let movehandler = function(event){
                touches.push(event.touches[0]);
                let objStar = touches[0];
                let objEnd = event.touches[0];
                if(Math.abs(objStar.clientX - objEnd.clientX) > Math.abs(objStar.clientY - objEnd.clientY)){
                    event.preventDefault();
                }
            }

            let isTap = function(tapObj){

                let isTap = Math.abs(tapObj.pagX-tapObj.endX) > 10 || Math.abs(tapObj.pagY-tapObj.endY) > 10;
                let _x = tapObj.pagX-tapObj.endX;
                let _y = tapObj.pagY-tapObj.endY;
                let ads = Math.abs(_x)-Math.abs(_y)
                if(_x > 10 && ads>0)
                    tapObj.direction = 'left'
                if(_x < -10 && ads>0)
                    tapObj.direction = 'right'
                if(tapObj.pagY-tapObj.endY > 10 && ads<0)
                    tapObj.direction = 'up'
                if(tapObj.pagY-tapObj.endY < -10 && ads<0)
                    tapObj.direction = 'down'
                return isTap;
            }

            el.on('touchmove',movehandler.bind(this))

            el.on('touchend',function(event){
            if(touches.length>1){
                let _touchend = touches.pop();
                tapObj.endX = _touchend.pageX;
                tapObj.endY = _touchend.pageY;
                tapObj.clientEndX = _touchend.clientEndX;
                tapObj.clientEndY = _touchend.clientEndY;
                    
                if (isTap(tapObj))
                    handler(event);
            }

            el.off('touchmove',movehandler)
            })
        }
    }
}

module.exports = Util();
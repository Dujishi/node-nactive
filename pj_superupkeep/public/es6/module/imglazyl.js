; (function (window) {
  'use strict';
  const imgDom = (dom, res) => {
    if (document.querySelectorAll) {
      res = document.querySelectorAll(dom)
    } else {
      let d = document,
        a = d.styleSheets[0] || d.createStyleSheet()
      a.addRule(dom, 'f:b')
      for (let l = d.all, b = 0, c = [], f = l.length; b < f; b++) {
        l[b].currentStyle.f && c.push(l[b])
      }
      a.removeRule(0)
      res = c
    }
    return res
  }

  const addEventListener = function(evt, fn) {
    window.addEventListener ? window.addEventListener(evt, fn, false) : (window.attachEvent) ? window.attachEvent('on' + evt, fn) : window['on' + evt] = fn
  }
  const _has = function (obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }

  function loadImage(el, fn) {
    var img = new Image(),
      src = el.getAttribute('data-src');
    img.onload = function () {
      if (!!el.parent) {
        el.parent.replaceChild(img, el);
      } else {
        el.src = src;
      }


      fn ? fn() : null;
    };
    img.src = src;
  }

  function elementInViewport(el) {
    var rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 && rect.left >= 0 && rect.top <= (window.innerHeight || document.documentElement.clientHeight)
    );
  }
  let images = [];
  const query = imgDom('.imglazy');
  const processScroll = function () {
      for (var i = 0; i < images.length; i++) {
        if (elementInViewport(images[i])) {
          loadImage(images[i], function () {
            images.splice(i, i);
          });
        }
      }
    };
  for (let i = 0; i < query.length; i++) {
    images.push(query[i]);
  }

  processScroll()
  addEventListener('scroll', processScroll)
})(this);
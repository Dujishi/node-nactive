/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "pj_newcar/public/js";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var ready = __webpack_require__(6);
	var isLogin = __webpack_require__(20);
	var login = __webpack_require__(36);
	var Fixtip = __webpack_require__(11);
	var template = __webpack_require__(14);
	var getSelectCar = __webpack_require__(37);
	var stringUtil = __webpack_require__(21);
	var getCommon = __webpack_require__(15);
	var callShare = __webpack_require__(38);
	var norepeat = __webpack_require__(25);
	var SelectCity = __webpack_require__(26);
	var loading = __webpack_require__(31);
	var selectCity = new SelectCity();
	var jumpNativePage = __webpack_require__(39);
	__webpack_require__(40);
	var formMgr = void 0;
	var userId = '';
	var bodyScrollTop = 0;
	
	$(function () {
	
	    var applyName = $('#applyName');
	    var applyTel = $('#applyTel');
	
	    // 分享
	    function share() {
	        if (CONF.isapp || CONF.iswechat) {
	            var common = getCommon();
	            common.share();
	        } else {
	            $('.share').hide();
	        }
	    }
	
	    function checkLogin(info, cb) {
	        // if (!isLogin()) {
	        //     return ;
	        // }         
	        formMgr = {
	            type: 'app',
	            uuid: info.userId,
	            lat: info.lat,
	            lng: info.lng,
	            phone: info.phone
	        };
	        userId = formMgr.uuid;
	        getCarList();
	        if (typeof cb === 'function') {
	            cb();
	        }
	    }
	
	    function bindEvent() {
	        $('body').on('tap', '.booking-btn', function () {
	            var href = $(this).data('href');
	            href = window.location.protocol + '//' + window.location.host + href;
	            if (CONF.isapp) {
	                if (!isLogin()) {
	                    login().then(function (info) {
	                        checkLogin(info, function () {
	                            // goToPage({
	                            //     type: 1,
	                            //     url: href
	                            // }).then(() => {
	                            // })
	                            window.location.href = href;
	                        });
	                    });
	                    return;
	                }
	                // goToPage({
	                //     type: 1,
	                //     url: href
	                // }).then(() => {
	                // });
	                window.location.href = href;
	                return;
	            }
	            window.location.href = href;
	        });
	        // show config
	        $('#carBox').on('touchend', '.show-config', function (e) {
	            $(this).find('i').toggleClass('arrow');
	            var config = $(this).parents('.car-item-text').find('.config');
	            var text = $(this).find('span');
	            if (config.hasClass('active')) {
	                config.removeClass('active');
	                text.text('展开配置');
	            } else {
	                config.addClass('active');
	                text.text('收起配置');
	            }
	            e.preventDefault();
	        });
	        // 购车流程展示事件
	        $('#flowBtn').on('touchend', function (e) {
	            $('.flow-mask').show().on('touchstart', function (e) {
	                e.preventDefault();
	            });
	            $(".flow-mask-img").addClass('animated zoomIn');
	            e.preventDefault();
	        });
	        $('#flowMaskBtn').on('touchend', function (e) {
	            $('.flow-mask').hide();
	            e.preventDefault();
	        });
	
	        //
	        $('body').on('touchend', '.item-text-btn-chance-icon', function (e) {
	            $('.sale-mask').show().on('touchstart', function (e) {
	                e.preventDefault();
	            });
	            $(".sale-mask-wrap").addClass('animated zoomIn');
	            e.stopPropagation();
	            e.preventDefault();
	        });
	        $('#saleMaskBtn').on('touchend', function (e) {
	            $('.sale-mask').hide();
	            e.preventDefault();
	        });
	        // 分享按钮事件
	        $('#shareBtn').on('tap', function () {
	            if (CONF.isapp) {
	                callShare({
	                    url: CONF.shareUrl,
	                    content: CONF.shareContent,
	                    title: CONF.shareTitle,
	                    subTitle: CONF.shareSubTitle,
	                    image: CONF.shareImgUrl
	                }).then(function (ret) {
	                    // {success: true}
	                });
	            } else if (CONF.iswechat) {
	                $('.share-mask').show().on({ 'tap': function tap() {
	                        $(this).hide();
	                    }, 'touchstart': function touchstart(e) {
	                        e.preventDefault();
	                    } });
	            }
	        });
	        // 城市地区选择
	        $('#applyDes').on('touchend', function (e) {
	            var that = $(this);
	            selectCity.onTap(function (v) {
	                $('#applyDes').val(v[1].n).attr('data-city', v[1].c);
	            }).show();
	            e.preventDefault();
	        });
	        // 车型选择
	        $('#applyCar').on('touchend', function (e) {
	            getSelectCar().onTap(function (v) {
	                var carName = v[0].brandName + ' ' + v[1].seriesName + ' ' + v[2].modelName;
	                $('#applyCar').val(carName).attr({
	                    'data-brand': v[0].brandId,
	                    'data-series': v[1].seriesId,
	                    'data-model': v[2].modelId,
	                    'data-brand-name': v[0].brandName,
	                    'data-series-name': v[1].seriesName,
	                    'data-model-name': v[2].modelName
	                });
	            }).show();
	            e.preventDefault();
	        });
	        // 填写没有想要的车辆
	        norepeat.auto('#applyBtn').on('tap', function () {
	            var name = $('#applyName');
	            var tel = $('#applyTel');
	            var des = $('#applyDes');
	            var car = $('#applyCar');
	            var $this = $(this);
	            if ($this.hasClass('disabled')) {
	                return;
	            }
	            loading.show();
	            $.ajax({
	                url: "/nactive/newcar/want",
	                type: "POST",
	                data: {
	                    userId: userId,
	                    userName: name.val(),
	                    phone: tel.val(),
	                    city: des.val(),
	                    brandId: car.attr("data-brand"),
	                    seriesId: car.attr("data-model"),
	                    modelId: car.attr("data-series"),
	                    brandName: car.attr("data-brand-name"),
	                    seriesName: car.attr("data-series-name"),
	                    modelName: car.attr("data-model-name")
	                }
	            }).then(function (ret) {
	                loading.hide();
	                if (ret.success) {
	                    name.val('');
	                    tel.val('');
	                    des.val('');
	                    car.val('');
	                    new Fixtip({ msg: ret.data });
	                } else {
	                    new Fixtip({ msg: ret.message });
	                }
	            }, function () {
	                new Fixtip({ msg: '网络错误' });
	            });
	        });
	    }
	
	    // 获取商品列表
	    function getCarList() {
	        $.ajax({
	            url: '/nactive/newcar/list',
	            type: 'GET',
	            data: { userId: userId }
	        }).then(function (ret) {
	            if (ret.success) {
	                loading.hide();
	                // console.log(ret);
	                $('#carBox').html(template($('#car_item').html(), { data: ret.data.recommend }));
	                $('#carMoreBox').html(template($('#car_more_item').html(), { data: ret.data.goods }));
	
	                countdown.init(2017, 1, 6, 20, 0, 0);
	
	                $('img.lazyload').lazyload({
	                    effect: 'fadeIn'
	                });
	                $('div.lazyimg').lazyload({
	                    effect: 'fadeIn'
	                });
	
	                $('body').append(template($('#swiper_item').html(), { data: ret.data.recommend }));
	
	                $('.swiper-container').each(function () {
	                    var swiper = new Swiper($(this), {
	                        zoom: true,
	                        zoomToggle: false,
	                        // Disable preloading of all images
	                        preloadImages: false,
	                        // Enable lazy loading
	                        lazyLoading: true,
	                        onSlideChangeEnd: function onSlideChangeEnd(swiper) {
	                            var elem = swiper.container.find('.pagination .pagination-num');
	                            elem.html(swiper.activeIndex + 1);
	                        }
	                    });
	                });
	
	                $('.car-item-mask').on('click', function (e) {
	                    var index = $(this).attr('data-index');
	                    var container = $(this).parent('.car-item-img').find('.swiper-container').find('.swiper-wrapper');
	                    var swiper = $('.swiper-mask').eq(index);
	                    swiper.css({ 'opacity': 1, 'z-index': 600 }).addClass('zoomIn');
	                    bodyScrollTop = $('body').scrollTop();
	                    console.log(bodyScrollTop);
	                    $('.big-wrap').css({ 'height': $(window).height(), 'overflow': 'hidden' });
	                    // let elemImg = swiper.find('img');
	                    // for (let i = 0; i < elemImg.length; i++) {
	                    //     elemImg[i].setAttribute('src', elemImg[i].getAttribute('data-swiper'));
	                    // }
	                    e.preventDefault();
	                });
	
	                $('.swiper-mask').on('click', function () {
	                    $('.swiper-mask').css({ 'opacity': 0, 'z-index': '-600' }).removeClass('zoomIn');
	                    $('.big-wrap').css({ 'height': 'auto', 'overflow': 'auto' });
	                    $('body').scrollTop(bodyScrollTop);
	                    console.log(bodyScrollTop);
	                });
	            } else {
	                new Fixtip({ msg: ret.message || ret.msg });
	            }
	        }, function () {
	            new Fixtip({ msg: '网络错误' });
	        });
	    }
	
	    // 倒计时
	    var countdown = {
	        init: function init(year, month, day, hour, minute, second) {
	            var me = this;
	            var ts = new Date(year, month - 1, day, hour, minute, second) - new Date(); //计算剩余的毫秒数
	            if (ts > 0) {
	                setInterval(function () {
	                    me.count(year, month, day, hour, minute, second);
	                }, 1000);
	            } else {
	                $('.countdown').html('活动已结束');
	                $('.time-btn').html('<p class="item-text-btn-out">免费预约</p>');
	                $('.time-btn-2').html('<p class="item-text-btn item-text-btn-out">免费预约</p>');
	            }
	        },
	        count: function count(year, month, day, hour, minute, second) {
	            // 2018, 11, 11, 9, 0, 0
	            var ts = new Date(year, month - 1, day, hour, minute, second) - new Date(); //计算剩余的毫秒数
	            var dd = parseInt(ts / 1000 / 60 / 60 / 24, 10); //计算剩余的天数
	            var hh = parseInt(ts / 1000 / 60 / 60 % 24, 10); //计算剩余的小时数
	            var mm = parseInt(ts / 1000 / 60 % 60, 10); //计算剩余的分钟数
	            var ss = parseInt(ts / 1000 % 60, 10); //计算剩余的秒数
	            $("#countdownTime .time-d").text(this.checkTime(dd));
	            $("#countdownTime .time-h").text(this.checkTime(hh));
	            $("#countdownTime .time-m").text(this.checkTime(mm));
	            $("#countdownTime .time-s").text(this.checkTime(ss));
	        },
	        checkTime: function checkTime(i) {
	            if (i < 10) {
	                i = "0" + i;
	            }
	            return i;
	        }
	    };
	
	    var checkValWarn = function checkValWarn() {
	        var name = $('#applyName');
	        var tel = $('#applyTel');
	        name.on('keyup', function () {
	            console.log(name.val());
	            if (!/^[\u4e00-\u9fa5|a-zA-Z]{2,7}$/.test(name.val())) {
	                $('.item-warn-name').show();
	            } else {
	                $('.item-warn-name').hide();
	            }
	        });
	        tel.on('keyup', function () {
	            if (!/1[34578]\d{9}/.test(tel.val())) {
	                $('.item-warn-tel').show();
	            } else {
	                $('.item-warn-tel').hide();
	            }
	        });
	    };
	
	    var timeHandler = window.setInterval(function () {
	        function checkVal() {
	            var name = $('#applyName').val();
	            var tel = $('#applyTel').val();
	            var des = $('#applyDes').text();
	            var car = $('#applyCar').text();
	            if (des == '请选择地区') {
	                return false;
	            }
	            if (car == '请选择意向车型') {
	                return false;
	            }
	            if (!/^[\u4e00-\u9fa5|a-zA-Z]{2,7}$/.test(name)) {
	                return false;
	            }
	            if (!/1[34578]\d{9}/.test(tel)) {
	                return false;
	            }
	            return true;
	        }
	
	        if (checkVal()) {
	            $('.item-warn-name').hide();
	            $('.item-warn-tel').hide();
	            $('#applyBtn').removeClass('disabled');
	        } else {
	            $('#applyBtn').addClass('disabled');
	        }
	    }, 50);
	
	    if (CONF.isapp) {
	        ready(function (info) {
	            checkLogin(info);
	        });
	    } else {
	        getCarList();
	    }
	
	    loading.show();
	    share();
	    bindEvent();
	    getSelectCar().setBrandData();
	    checkValWarn();
	});

/***/ }),
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */
/***/ (function(module, exports) {

	"use strict";
	
	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function () {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for (var i = 0; i < this.length; i++) {
				var item = this[i];
				if (item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function (modules, mediaQuery) {
			if (typeof modules === "string") modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for (var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if (typeof id === "number") alreadyImportedModules[id] = true;
			}
			for (i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if (mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if (mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];
	
	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}
	
	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}
	
	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}
	
	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	var replaceText = (function () {
		var textStore = [];
	
		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}
	
	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}
	
		var blob = new Blob([css], { type: "text/css" });
	
		var oldSrc = linkElement.href;
	
		linkElement.href = URL.createObjectURL(blob);
	
		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(7);
	var getAppInfo = __webpack_require__(10);
	
	window.bridge = null;
	
	function nativeReady(callback) {
	    // 本地桥接接口ready
	    if (bridge) {
	        callback(bridge);
	    } else {
	        document.addEventListener('AppJsBridgeReady', function () {
	            callback(bridge);
	        }, false);
	    }
	}
	
	function toJson(ret) {
	    if (typeof ret === 'string') {
	        ret = JSON.parse(ret);
	    }
	    return ret;
	}
	
	function dispatchReady() {
	    // 事件触发
	    bridge = window.WebViewJavascriptBridge;
	    if (typeof bridge.init == "function") {
	        bridge.init(function (response) {});
	    }
	    bridge.toJson = toJson;
	    var event = document.createEvent('Event');
	    event.initEvent('AppJsBridgeReady', true, true);
	    document.dispatchEvent(event, window.WebViewJavascriptBridge);
	}
	
	if (!window.WebViewJavascriptBridge) {
	    document.addEventListener('WebViewJavascriptBridgeReady', dispatchReady, false);
	} else {
	    dispatchReady();
	}
	
	function ready(callback) {
	    // getAppInfo ready
	    if (bridge && bridge.appInfo) {
	        callback(bridge.appInfo);
	    } else {
	        nativeReady(function () {
	            getAppInfo().then(function (info) {
	                return callback(info);
	            });
	        });
	    }
	}
	
	module.exports = ready;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;var require;/* WEBPACK VAR INJECTION */(function(process, global) {'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	/*!
	 * @overview es6-promise - a tiny implementation of Promises/A+.
	 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
	 * @license   Licensed under MIT license
	 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
	 * @version   3.3.1
	 */
	
	(function (global, factory) {
	  ( false ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : global.ES6Promise = factory();
	})(undefined, function () {
	  'use strict';
	
	  function objectOrFunction(x) {
	    return typeof x === 'function' || (typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object' && x !== null;
	  }
	
	  function isFunction(x) {
	    return typeof x === 'function';
	  }
	
	  var _isArray = undefined;
	  if (!Array.isArray) {
	    _isArray = function _isArray(x) {
	      return Object.prototype.toString.call(x) === '[object Array]';
	    };
	  } else {
	    _isArray = Array.isArray;
	  }
	
	  var isArray = _isArray;
	
	  var len = 0;
	  var vertxNext = undefined;
	  var customSchedulerFn = undefined;
	
	  var asap = function asap(callback, arg) {
	    queue[len] = callback;
	    queue[len + 1] = arg;
	    len += 2;
	    if (len === 2) {
	      // If len is 2, that means that we need to schedule an async flush.
	      // If additional callbacks are queued before the queue is flushed, they
	      // will be processed by this flush that we are scheduling.
	      if (customSchedulerFn) {
	        customSchedulerFn(flush);
	      } else {
	        scheduleFlush();
	      }
	    }
	  };
	
	  function setScheduler(scheduleFn) {
	    customSchedulerFn = scheduleFn;
	  }
	
	  function setAsap(asapFn) {
	    asap = asapFn;
	  }
	
	  var browserWindow = typeof window !== 'undefined' ? window : undefined;
	  var browserGlobal = browserWindow || {};
	  var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
	  var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';
	
	  // test for web worker but not in IE10
	  var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';
	
	  // node
	  function useNextTick() {
	    // node version 0.10.x displays a deprecation warning when nextTick is used recursively
	    // see https://github.com/cujojs/when/issues/410 for details
	    return function () {
	      return process.nextTick(flush);
	    };
	  }
	
	  // vertx
	  function useVertxTimer() {
	    return function () {
	      vertxNext(flush);
	    };
	  }
	
	  function useMutationObserver() {
	    var iterations = 0;
	    var observer = new BrowserMutationObserver(flush);
	    var node = document.createTextNode('');
	    observer.observe(node, { characterData: true });
	
	    return function () {
	      node.data = iterations = ++iterations % 2;
	    };
	  }
	
	  // web worker
	  function useMessageChannel() {
	    var channel = new MessageChannel();
	    channel.port1.onmessage = flush;
	    return function () {
	      return channel.port2.postMessage(0);
	    };
	  }
	
	  function useSetTimeout() {
	    // Store setTimeout reference so es6-promise will be unaffected by
	    // other code modifying setTimeout (like sinon.useFakeTimers())
	    var globalSetTimeout = setTimeout;
	    return function () {
	      return globalSetTimeout(flush, 1);
	    };
	  }
	
	  var queue = new Array(1000);
	  function flush() {
	    for (var i = 0; i < len; i += 2) {
	      var callback = queue[i];
	      var arg = queue[i + 1];
	
	      callback(arg);
	
	      queue[i] = undefined;
	      queue[i + 1] = undefined;
	    }
	
	    len = 0;
	  }
	
	  function attemptVertx() {
	    try {
	      var r = require;
	      var vertx = __webpack_require__(9);
	      vertxNext = vertx.runOnLoop || vertx.runOnContext;
	      return useVertxTimer();
	    } catch (e) {
	      return useSetTimeout();
	    }
	  }
	
	  var scheduleFlush = undefined;
	  // Decide what async method to use to triggering processing of queued callbacks:
	  if (isNode) {
	    scheduleFlush = useNextTick();
	  } else if (BrowserMutationObserver) {
	    scheduleFlush = useMutationObserver();
	  } else if (isWorker) {
	    scheduleFlush = useMessageChannel();
	  } else if (browserWindow === undefined && "function" === 'function') {
	    scheduleFlush = attemptVertx();
	  } else {
	    scheduleFlush = useSetTimeout();
	  }
	
	  function then(onFulfillment, onRejection) {
	    var _arguments = arguments;
	
	    var parent = this;
	
	    var child = new this.constructor(noop);
	
	    if (child[PROMISE_ID] === undefined) {
	      makePromise(child);
	    }
	
	    var _state = parent._state;
	
	    if (_state) {
	      (function () {
	        var callback = _arguments[_state - 1];
	        asap(function () {
	          return invokeCallback(_state, child, callback, parent._result);
	        });
	      })();
	    } else {
	      subscribe(parent, child, onFulfillment, onRejection);
	    }
	
	    return child;
	  }
	
	  /**
	    `Promise.resolve` returns a promise that will become resolved with the
	    passed `value`. It is shorthand for the following:
	  
	    ```javascript
	    let promise = new Promise(function(resolve, reject){
	      resolve(1);
	    });
	  
	    promise.then(function(value){
	      // value === 1
	    });
	    ```
	  
	    Instead of writing the above, your code now simply becomes the following:
	  
	    ```javascript
	    let promise = Promise.resolve(1);
	  
	    promise.then(function(value){
	      // value === 1
	    });
	    ```
	  
	    @method resolve
	    @static
	    @param {Any} value value that the returned promise will be resolved with
	    Useful for tooling.
	    @return {Promise} a promise that will become fulfilled with the given
	    `value`
	  */
	  function resolve(object) {
	    /*jshint validthis:true */
	    var Constructor = this;
	
	    if (object && (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object' && object.constructor === Constructor) {
	      return object;
	    }
	
	    var promise = new Constructor(noop);
	    _resolve(promise, object);
	    return promise;
	  }
	
	  var PROMISE_ID = Math.random().toString(36).substring(16);
	
	  function noop() {}
	
	  var PENDING = void 0;
	  var FULFILLED = 1;
	  var REJECTED = 2;
	
	  var GET_THEN_ERROR = new ErrorObject();
	
	  function selfFulfillment() {
	    return new TypeError("You cannot resolve a promise with itself");
	  }
	
	  function cannotReturnOwn() {
	    return new TypeError('A promises callback cannot return that same promise.');
	  }
	
	  function getThen(promise) {
	    try {
	      return promise.then;
	    } catch (error) {
	      GET_THEN_ERROR.error = error;
	      return GET_THEN_ERROR;
	    }
	  }
	
	  function tryThen(then, value, fulfillmentHandler, rejectionHandler) {
	    try {
	      then.call(value, fulfillmentHandler, rejectionHandler);
	    } catch (e) {
	      return e;
	    }
	  }
	
	  function handleForeignThenable(promise, thenable, then) {
	    asap(function (promise) {
	      var sealed = false;
	      var error = tryThen(then, thenable, function (value) {
	        if (sealed) {
	          return;
	        }
	        sealed = true;
	        if (thenable !== value) {
	          _resolve(promise, value);
	        } else {
	          fulfill(promise, value);
	        }
	      }, function (reason) {
	        if (sealed) {
	          return;
	        }
	        sealed = true;
	
	        _reject(promise, reason);
	      }, 'Settle: ' + (promise._label || ' unknown promise'));
	
	      if (!sealed && error) {
	        sealed = true;
	        _reject(promise, error);
	      }
	    }, promise);
	  }
	
	  function handleOwnThenable(promise, thenable) {
	    if (thenable._state === FULFILLED) {
	      fulfill(promise, thenable._result);
	    } else if (thenable._state === REJECTED) {
	      _reject(promise, thenable._result);
	    } else {
	      subscribe(thenable, undefined, function (value) {
	        return _resolve(promise, value);
	      }, function (reason) {
	        return _reject(promise, reason);
	      });
	    }
	  }
	
	  function handleMaybeThenable(promise, maybeThenable, then$$) {
	    if (maybeThenable.constructor === promise.constructor && then$$ === then && maybeThenable.constructor.resolve === resolve) {
	      handleOwnThenable(promise, maybeThenable);
	    } else {
	      if (then$$ === GET_THEN_ERROR) {
	        _reject(promise, GET_THEN_ERROR.error);
	      } else if (then$$ === undefined) {
	        fulfill(promise, maybeThenable);
	      } else if (isFunction(then$$)) {
	        handleForeignThenable(promise, maybeThenable, then$$);
	      } else {
	        fulfill(promise, maybeThenable);
	      }
	    }
	  }
	
	  function _resolve(promise, value) {
	    if (promise === value) {
	      _reject(promise, selfFulfillment());
	    } else if (objectOrFunction(value)) {
	      handleMaybeThenable(promise, value, getThen(value));
	    } else {
	      fulfill(promise, value);
	    }
	  }
	
	  function publishRejection(promise) {
	    if (promise._onerror) {
	      promise._onerror(promise._result);
	    }
	
	    publish(promise);
	  }
	
	  function fulfill(promise, value) {
	    if (promise._state !== PENDING) {
	      return;
	    }
	
	    promise._result = value;
	    promise._state = FULFILLED;
	
	    if (promise._subscribers.length !== 0) {
	      asap(publish, promise);
	    }
	  }
	
	  function _reject(promise, reason) {
	    if (promise._state !== PENDING) {
	      return;
	    }
	    promise._state = REJECTED;
	    promise._result = reason;
	
	    asap(publishRejection, promise);
	  }
	
	  function subscribe(parent, child, onFulfillment, onRejection) {
	    var _subscribers = parent._subscribers;
	    var length = _subscribers.length;
	
	    parent._onerror = null;
	
	    _subscribers[length] = child;
	    _subscribers[length + FULFILLED] = onFulfillment;
	    _subscribers[length + REJECTED] = onRejection;
	
	    if (length === 0 && parent._state) {
	      asap(publish, parent);
	    }
	  }
	
	  function publish(promise) {
	    var subscribers = promise._subscribers;
	    var settled = promise._state;
	
	    if (subscribers.length === 0) {
	      return;
	    }
	
	    var child = undefined,
	        callback = undefined,
	        detail = promise._result;
	
	    for (var i = 0; i < subscribers.length; i += 3) {
	      child = subscribers[i];
	      callback = subscribers[i + settled];
	
	      if (child) {
	        invokeCallback(settled, child, callback, detail);
	      } else {
	        callback(detail);
	      }
	    }
	
	    promise._subscribers.length = 0;
	  }
	
	  function ErrorObject() {
	    this.error = null;
	  }
	
	  var TRY_CATCH_ERROR = new ErrorObject();
	
	  function tryCatch(callback, detail) {
	    try {
	      return callback(detail);
	    } catch (e) {
	      TRY_CATCH_ERROR.error = e;
	      return TRY_CATCH_ERROR;
	    }
	  }
	
	  function invokeCallback(settled, promise, callback, detail) {
	    var hasCallback = isFunction(callback),
	        value = undefined,
	        error = undefined,
	        succeeded = undefined,
	        failed = undefined;
	
	    if (hasCallback) {
	      value = tryCatch(callback, detail);
	
	      if (value === TRY_CATCH_ERROR) {
	        failed = true;
	        error = value.error;
	        value = null;
	      } else {
	        succeeded = true;
	      }
	
	      if (promise === value) {
	        _reject(promise, cannotReturnOwn());
	        return;
	      }
	    } else {
	      value = detail;
	      succeeded = true;
	    }
	
	    if (promise._state !== PENDING) {
	      // noop
	    } else if (hasCallback && succeeded) {
	      _resolve(promise, value);
	    } else if (failed) {
	      _reject(promise, error);
	    } else if (settled === FULFILLED) {
	      fulfill(promise, value);
	    } else if (settled === REJECTED) {
	      _reject(promise, value);
	    }
	  }
	
	  function initializePromise(promise, resolver) {
	    try {
	      resolver(function resolvePromise(value) {
	        _resolve(promise, value);
	      }, function rejectPromise(reason) {
	        _reject(promise, reason);
	      });
	    } catch (e) {
	      _reject(promise, e);
	    }
	  }
	
	  var id = 0;
	  function nextId() {
	    return id++;
	  }
	
	  function makePromise(promise) {
	    promise[PROMISE_ID] = id++;
	    promise._state = undefined;
	    promise._result = undefined;
	    promise._subscribers = [];
	  }
	
	  function Enumerator(Constructor, input) {
	    this._instanceConstructor = Constructor;
	    this.promise = new Constructor(noop);
	
	    if (!this.promise[PROMISE_ID]) {
	      makePromise(this.promise);
	    }
	
	    if (isArray(input)) {
	      this._input = input;
	      this.length = input.length;
	      this._remaining = input.length;
	
	      this._result = new Array(this.length);
	
	      if (this.length === 0) {
	        fulfill(this.promise, this._result);
	      } else {
	        this.length = this.length || 0;
	        this._enumerate();
	        if (this._remaining === 0) {
	          fulfill(this.promise, this._result);
	        }
	      }
	    } else {
	      _reject(this.promise, validationError());
	    }
	  }
	
	  function validationError() {
	    return new Error('Array Methods must be provided an Array');
	  };
	
	  Enumerator.prototype._enumerate = function () {
	    var length = this.length;
	    var _input = this._input;
	
	    for (var i = 0; this._state === PENDING && i < length; i++) {
	      this._eachEntry(_input[i], i);
	    }
	  };
	
	  Enumerator.prototype._eachEntry = function (entry, i) {
	    var c = this._instanceConstructor;
	    var resolve$$ = c.resolve;
	
	    if (resolve$$ === resolve) {
	      var _then = getThen(entry);
	
	      if (_then === then && entry._state !== PENDING) {
	        this._settledAt(entry._state, i, entry._result);
	      } else if (typeof _then !== 'function') {
	        this._remaining--;
	        this._result[i] = entry;
	      } else if (c === Promise) {
	        var promise = new c(noop);
	        handleMaybeThenable(promise, entry, _then);
	        this._willSettleAt(promise, i);
	      } else {
	        this._willSettleAt(new c(function (resolve$$) {
	          return resolve$$(entry);
	        }), i);
	      }
	    } else {
	      this._willSettleAt(resolve$$(entry), i);
	    }
	  };
	
	  Enumerator.prototype._settledAt = function (state, i, value) {
	    var promise = this.promise;
	
	    if (promise._state === PENDING) {
	      this._remaining--;
	
	      if (state === REJECTED) {
	        _reject(promise, value);
	      } else {
	        this._result[i] = value;
	      }
	    }
	
	    if (this._remaining === 0) {
	      fulfill(promise, this._result);
	    }
	  };
	
	  Enumerator.prototype._willSettleAt = function (promise, i) {
	    var enumerator = this;
	
	    subscribe(promise, undefined, function (value) {
	      return enumerator._settledAt(FULFILLED, i, value);
	    }, function (reason) {
	      return enumerator._settledAt(REJECTED, i, reason);
	    });
	  };
	
	  /**
	    `Promise.all` accepts an array of promises, and returns a new promise which
	    is fulfilled with an array of fulfillment values for the passed promises, or
	    rejected with the reason of the first passed promise to be rejected. It casts all
	    elements of the passed iterable to promises as it runs this algorithm.
	  
	    Example:
	  
	    ```javascript
	    let promise1 = resolve(1);
	    let promise2 = resolve(2);
	    let promise3 = resolve(3);
	    let promises = [ promise1, promise2, promise3 ];
	  
	    Promise.all(promises).then(function(array){
	      // The array here would be [ 1, 2, 3 ];
	    });
	    ```
	  
	    If any of the `promises` given to `all` are rejected, the first promise
	    that is rejected will be given as an argument to the returned promises's
	    rejection handler. For example:
	  
	    Example:
	  
	    ```javascript
	    let promise1 = resolve(1);
	    let promise2 = reject(new Error("2"));
	    let promise3 = reject(new Error("3"));
	    let promises = [ promise1, promise2, promise3 ];
	  
	    Promise.all(promises).then(function(array){
	      // Code here never runs because there are rejected promises!
	    }, function(error) {
	      // error.message === "2"
	    });
	    ```
	  
	    @method all
	    @static
	    @param {Array} entries array of promises
	    @param {String} label optional string for labeling the promise.
	    Useful for tooling.
	    @return {Promise} promise that is fulfilled when all `promises` have been
	    fulfilled, or rejected if any of them become rejected.
	    @static
	  */
	  function all(entries) {
	    return new Enumerator(this, entries).promise;
	  }
	
	  /**
	    `Promise.race` returns a new promise which is settled in the same way as the
	    first passed promise to settle.
	  
	    Example:
	  
	    ```javascript
	    let promise1 = new Promise(function(resolve, reject){
	      setTimeout(function(){
	        resolve('promise 1');
	      }, 200);
	    });
	  
	    let promise2 = new Promise(function(resolve, reject){
	      setTimeout(function(){
	        resolve('promise 2');
	      }, 100);
	    });
	  
	    Promise.race([promise1, promise2]).then(function(result){
	      // result === 'promise 2' because it was resolved before promise1
	      // was resolved.
	    });
	    ```
	  
	    `Promise.race` is deterministic in that only the state of the first
	    settled promise matters. For example, even if other promises given to the
	    `promises` array argument are resolved, but the first settled promise has
	    become rejected before the other promises became fulfilled, the returned
	    promise will become rejected:
	  
	    ```javascript
	    let promise1 = new Promise(function(resolve, reject){
	      setTimeout(function(){
	        resolve('promise 1');
	      }, 200);
	    });
	  
	    let promise2 = new Promise(function(resolve, reject){
	      setTimeout(function(){
	        reject(new Error('promise 2'));
	      }, 100);
	    });
	  
	    Promise.race([promise1, promise2]).then(function(result){
	      // Code here never runs
	    }, function(reason){
	      // reason.message === 'promise 2' because promise 2 became rejected before
	      // promise 1 became fulfilled
	    });
	    ```
	  
	    An example real-world use case is implementing timeouts:
	  
	    ```javascript
	    Promise.race([ajax('foo.json'), timeout(5000)])
	    ```
	  
	    @method race
	    @static
	    @param {Array} promises array of promises to observe
	    Useful for tooling.
	    @return {Promise} a promise which settles in the same way as the first passed
	    promise to settle.
	  */
	  function race(entries) {
	    /*jshint validthis:true */
	    var Constructor = this;
	
	    if (!isArray(entries)) {
	      return new Constructor(function (_, reject) {
	        return reject(new TypeError('You must pass an array to race.'));
	      });
	    } else {
	      return new Constructor(function (resolve, reject) {
	        var length = entries.length;
	        for (var i = 0; i < length; i++) {
	          Constructor.resolve(entries[i]).then(resolve, reject);
	        }
	      });
	    }
	  }
	
	  /**
	    `Promise.reject` returns a promise rejected with the passed `reason`.
	    It is shorthand for the following:
	  
	    ```javascript
	    let promise = new Promise(function(resolve, reject){
	      reject(new Error('WHOOPS'));
	    });
	  
	    promise.then(function(value){
	      // Code here doesn't run because the promise is rejected!
	    }, function(reason){
	      // reason.message === 'WHOOPS'
	    });
	    ```
	  
	    Instead of writing the above, your code now simply becomes the following:
	  
	    ```javascript
	    let promise = Promise.reject(new Error('WHOOPS'));
	  
	    promise.then(function(value){
	      // Code here doesn't run because the promise is rejected!
	    }, function(reason){
	      // reason.message === 'WHOOPS'
	    });
	    ```
	  
	    @method reject
	    @static
	    @param {Any} reason value that the returned promise will be rejected with.
	    Useful for tooling.
	    @return {Promise} a promise rejected with the given `reason`.
	  */
	  function reject(reason) {
	    /*jshint validthis:true */
	    var Constructor = this;
	    var promise = new Constructor(noop);
	    _reject(promise, reason);
	    return promise;
	  }
	
	  function needsResolver() {
	    throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
	  }
	
	  function needsNew() {
	    throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
	  }
	
	  /**
	    Promise objects represent the eventual result of an asynchronous operation. The
	    primary way of interacting with a promise is through its `then` method, which
	    registers callbacks to receive either a promise's eventual value or the reason
	    why the promise cannot be fulfilled.
	  
	    Terminology
	    -----------
	  
	    - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
	    - `thenable` is an object or function that defines a `then` method.
	    - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
	    - `exception` is a value that is thrown using the throw statement.
	    - `reason` is a value that indicates why a promise was rejected.
	    - `settled` the final resting state of a promise, fulfilled or rejected.
	  
	    A promise can be in one of three states: pending, fulfilled, or rejected.
	  
	    Promises that are fulfilled have a fulfillment value and are in the fulfilled
	    state.  Promises that are rejected have a rejection reason and are in the
	    rejected state.  A fulfillment value is never a thenable.
	  
	    Promises can also be said to *resolve* a value.  If this value is also a
	    promise, then the original promise's settled state will match the value's
	    settled state.  So a promise that *resolves* a promise that rejects will
	    itself reject, and a promise that *resolves* a promise that fulfills will
	    itself fulfill.
	  
	  
	    Basic Usage:
	    ------------
	  
	    ```js
	    let promise = new Promise(function(resolve, reject) {
	      // on success
	      resolve(value);
	  
	      // on failure
	      reject(reason);
	    });
	  
	    promise.then(function(value) {
	      // on fulfillment
	    }, function(reason) {
	      // on rejection
	    });
	    ```
	  
	    Advanced Usage:
	    ---------------
	  
	    Promises shine when abstracting away asynchronous interactions such as
	    `XMLHttpRequest`s.
	  
	    ```js
	    function getJSON(url) {
	      return new Promise(function(resolve, reject){
	        let xhr = new XMLHttpRequest();
	  
	        xhr.open('GET', url);
	        xhr.onreadystatechange = handler;
	        xhr.responseType = 'json';
	        xhr.setRequestHeader('Accept', 'application/json');
	        xhr.send();
	  
	        function handler() {
	          if (this.readyState === this.DONE) {
	            if (this.status === 200) {
	              resolve(this.response);
	            } else {
	              reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
	            }
	          }
	        };
	      });
	    }
	  
	    getJSON('/posts.json').then(function(json) {
	      // on fulfillment
	    }, function(reason) {
	      // on rejection
	    });
	    ```
	  
	    Unlike callbacks, promises are great composable primitives.
	  
	    ```js
	    Promise.all([
	      getJSON('/posts'),
	      getJSON('/comments')
	    ]).then(function(values){
	      values[0] // => postsJSON
	      values[1] // => commentsJSON
	  
	      return values;
	    });
	    ```
	  
	    @class Promise
	    @param {function} resolver
	    Useful for tooling.
	    @constructor
	  */
	  function Promise(resolver) {
	    this[PROMISE_ID] = nextId();
	    this._result = this._state = undefined;
	    this._subscribers = [];
	
	    if (noop !== resolver) {
	      typeof resolver !== 'function' && needsResolver();
	      this instanceof Promise ? initializePromise(this, resolver) : needsNew();
	    }
	  }
	
	  Promise.all = all;
	  Promise.race = race;
	  Promise.resolve = resolve;
	  Promise.reject = reject;
	  Promise._setScheduler = setScheduler;
	  Promise._setAsap = setAsap;
	  Promise._asap = asap;
	
	  Promise.prototype = {
	    constructor: Promise,
	
	    /**
	      The primary way of interacting with a promise is through its `then` method,
	      which registers callbacks to receive either a promise's eventual value or the
	      reason why the promise cannot be fulfilled.
	    
	      ```js
	      findUser().then(function(user){
	        // user is available
	      }, function(reason){
	        // user is unavailable, and you are given the reason why
	      });
	      ```
	    
	      Chaining
	      --------
	    
	      The return value of `then` is itself a promise.  This second, 'downstream'
	      promise is resolved with the return value of the first promise's fulfillment
	      or rejection handler, or rejected if the handler throws an exception.
	    
	      ```js
	      findUser().then(function (user) {
	        return user.name;
	      }, function (reason) {
	        return 'default name';
	      }).then(function (userName) {
	        // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
	        // will be `'default name'`
	      });
	    
	      findUser().then(function (user) {
	        throw new Error('Found user, but still unhappy');
	      }, function (reason) {
	        throw new Error('`findUser` rejected and we're unhappy');
	      }).then(function (value) {
	        // never reached
	      }, function (reason) {
	        // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
	        // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
	      });
	      ```
	      If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
	    
	      ```js
	      findUser().then(function (user) {
	        throw new PedagogicalException('Upstream error');
	      }).then(function (value) {
	        // never reached
	      }).then(function (value) {
	        // never reached
	      }, function (reason) {
	        // The `PedgagocialException` is propagated all the way down to here
	      });
	      ```
	    
	      Assimilation
	      ------------
	    
	      Sometimes the value you want to propagate to a downstream promise can only be
	      retrieved asynchronously. This can be achieved by returning a promise in the
	      fulfillment or rejection handler. The downstream promise will then be pending
	      until the returned promise is settled. This is called *assimilation*.
	    
	      ```js
	      findUser().then(function (user) {
	        return findCommentsByAuthor(user);
	      }).then(function (comments) {
	        // The user's comments are now available
	      });
	      ```
	    
	      If the assimliated promise rejects, then the downstream promise will also reject.
	    
	      ```js
	      findUser().then(function (user) {
	        return findCommentsByAuthor(user);
	      }).then(function (comments) {
	        // If `findCommentsByAuthor` fulfills, we'll have the value here
	      }, function (reason) {
	        // If `findCommentsByAuthor` rejects, we'll have the reason here
	      });
	      ```
	    
	      Simple Example
	      --------------
	    
	      Synchronous Example
	    
	      ```javascript
	      let result;
	    
	      try {
	        result = findResult();
	        // success
	      } catch(reason) {
	        // failure
	      }
	      ```
	    
	      Errback Example
	    
	      ```js
	      findResult(function(result, err){
	        if (err) {
	          // failure
	        } else {
	          // success
	        }
	      });
	      ```
	    
	      Promise Example;
	    
	      ```javascript
	      findResult().then(function(result){
	        // success
	      }, function(reason){
	        // failure
	      });
	      ```
	    
	      Advanced Example
	      --------------
	    
	      Synchronous Example
	    
	      ```javascript
	      let author, books;
	    
	      try {
	        author = findAuthor();
	        books  = findBooksByAuthor(author);
	        // success
	      } catch(reason) {
	        // failure
	      }
	      ```
	    
	      Errback Example
	    
	      ```js
	    
	      function foundBooks(books) {
	    
	      }
	    
	      function failure(reason) {
	    
	      }
	    
	      findAuthor(function(author, err){
	        if (err) {
	          failure(err);
	          // failure
	        } else {
	          try {
	            findBoooksByAuthor(author, function(books, err) {
	              if (err) {
	                failure(err);
	              } else {
	                try {
	                  foundBooks(books);
	                } catch(reason) {
	                  failure(reason);
	                }
	              }
	            });
	          } catch(error) {
	            failure(err);
	          }
	          // success
	        }
	      });
	      ```
	    
	      Promise Example;
	    
	      ```javascript
	      findAuthor().
	        then(findBooksByAuthor).
	        then(function(books){
	          // found books
	      }).catch(function(reason){
	        // something went wrong
	      });
	      ```
	    
	      @method then
	      @param {Function} onFulfilled
	      @param {Function} onRejected
	      Useful for tooling.
	      @return {Promise}
	    */
	    then: then,
	
	    /**
	      `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
	      as the catch block of a try/catch statement.
	    
	      ```js
	      function findAuthor(){
	        throw new Error('couldn't find that author');
	      }
	    
	      // synchronous
	      try {
	        findAuthor();
	      } catch(reason) {
	        // something went wrong
	      }
	    
	      // async with promises
	      findAuthor().catch(function(reason){
	        // something went wrong
	      });
	      ```
	    
	      @method catch
	      @param {Function} onRejection
	      Useful for tooling.
	      @return {Promise}
	    */
	    'catch': function _catch(onRejection) {
	      return this.then(null, onRejection);
	    }
	  };
	
	  function polyfill() {
	    var local = undefined;
	
	    if (typeof global !== 'undefined') {
	      local = global;
	    } else if (typeof self !== 'undefined') {
	      local = self;
	    } else {
	      try {
	        local = Function('return this')();
	      } catch (e) {
	        throw new Error('polyfill failed because global object is unavailable in this environment');
	      }
	    }
	
	    var P = local.Promise;
	
	    if (P) {
	      var promiseToString = null;
	      try {
	        promiseToString = Object.prototype.toString.call(P.resolve());
	      } catch (e) {
	        // silently ignored
	      }
	
	      if (promiseToString === '[object Promise]' && !P.cast) {
	        return;
	      }
	    }
	
	    local.Promise = Promise;
	  }
	
	  polyfill();
	  // Strange compat..
	  Promise.polyfill = polyfill;
	  Promise.Promise = Promise;
	
	  return Promise;
	});
	//# sourceMappingURL=es6-promise.map
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8), (function() { return this; }())))

/***/ }),
/* 8 */
/***/ (function(module, exports) {

	'use strict';
	
	// shim for using process in browser
	var process = module.exports = {};
	
	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.
	
	var cachedSetTimeout;
	var cachedClearTimeout;
	
	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout() {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	})();
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch (e) {
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch (e) {
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }
	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e) {
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e) {
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }
	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while (len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	process.prependListener = noop;
	process.prependOnceListener = noop;
	
	process.listeners = function (name) {
	    return [];
	};
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () {
	    return '/';
	};
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function () {
	    return 0;
	};

/***/ }),
/* 9 */
/***/ (function(module, exports) {

	/* (ignored) */

/***/ }),
/* 10 */
/***/ (function(module, exports) {

	"use strict";
	
	module.exports = function getAppInfo() {
	    return new Promise(function (resolve, reject) {
	        var bridge = window.bridge;
	        bridge.callHandler("getAppInfo", {}, function (ret) {
	            var appInfo = bridge.toJson(ret);
	            bridge.appInfo = appInfo;
	            resolve(appInfo);
	        });
	    });
	};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(global) {'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	/**
	 * @module  fixtip
	 * @description  移动端toaster提示信息
	 * @author   宇尘
	 * @version   0.1.0
	 * @param {Object} options - 参数
	 * @param {string} options.msg - 提示消息
	 * @param {string} options.timer - 选填 显示时间 默认3000毫秒
	 * @param {string} options.bottom - 选填 距离底部的位置 默认为10%
	 * @param {function} options.callback - 选填 消失时回调
	 * @example  
	 *  new Fixtip({
	 * 		msg: '格式错误',
	 * 		timer: 3000,
	 * 		bottom: '100px',
	 *		zIndex: 1000,
	 * 		callback:function(){}
	 * 	})
	 * @return {function} Fixtip构造函数
	 */
	;(function () {
	
		__webpack_require__(12);
	
		function Fixtip(options) {
			this.options = options;
	
			this._init();
			this._render();
		}
	
		Fixtip.prototype._init = function () {
			var defaults = {
				timer: 3000,
				bottom: '10%',
				callback: null,
				zIndex: 1000
			};
	
			this._config = $.extend({}, defaults, this.options);
		};
	
		Fixtip.prototype._render = function () {
			var config = this._config;
			var $fixtip = null;
	
			if ($('.ui-fixtip').length == 0) {
				$fixtip = $('<div class="ui-fixtip"><span>' + config.msg + '</span></div>').appendTo('body');
	
				$fixtip.css({
					bottom: config.bottom,
					'z-index': config.zIndex
				});
	
				setTimeout(function () {
					$fixtip.remove();
					if (typeof config.callback == "function") {
						config.callback();
					}
				}, config.timer);
			}
		};
	
		if (typeof module !== 'undefined' && ( false ? 'undefined' : _typeof(exports)) === 'object') {
			module.exports = Fixtip;
		} else if (true) {
			!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
				return Fixtip;
			}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else {
			this.Fixtip = Fixtip;
		}
	}).call(function () {
		return this || (typeof window !== 'undefined' ? window : global);
	});
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(13);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../../../_css-loader@0.23.1@css-loader/index.js!../../../_postcss-loader@2.0.8@postcss-loader/lib/index.js!./fixtips.css", function() {
				var newContent = require("!!../../../_css-loader@0.23.1@css-loader/index.js!../../../_postcss-loader@2.0.8@postcss-loader/lib/index.js!./fixtips.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports
	
	
	// module
	exports.push([module.id, "/**\n * @author : 宇尘\n * @created : 2015-06-10\n * @version : v0.1.0\n * @desc : fixtip\n */\n.ui-fixtip {\n  position: fixed;\n  left: 0;\n  right: 0;\n  text-align: center;\n  font-size: 14px;\n}\n.ui-fixtip span {\n  display: inline-block;\n  padding: 10px 20px;\n  background: rgba(0,0,0,.5);\n  color: #fff;\n  border-radius: 2px;\n}\n", ""]);
	
	// exports


/***/ }),
/* 14 */
/***/ (function(module, exports) {

	'use strict';
	
	/**
	*
	* @param tpl {String} 模板字符串
	* @param data {Object} 模板数据（不传或为null时返回渲染方法）
	*
	* @return {String} 渲染结果
	* @return {Function} 渲染方法
	*
	*/
	
	function parse(p0) {
	    // 指令解析
	    var dir = p0.trim().replace(/[\s]+/g, ' ').split(' ');
	    switch (dir[0]) {
	        case 'if':
	            return ';if(' + dir.slice(1).join(' ') + '){';
	        case 'else':
	            return '}else{';
	        case 'elseif':
	            return '}else if(' + dir.slice(1).join(' ') + '){';
	        case 'endif':
	            return '};';
	        case 'each':
	            return '; ' + dir[1] + '.forEach(function(' + dir[3] + ', ' + dir[4] + '){';
	        case 'endeach':
	            return '});';
	        case 'for':
	            return ';(function(){ for(var ' + dir[4] + ' in ' + dir[1] + '){ var ' + dir[3] + '=' + dir[1] + '[' + dir[4] + '];';
	        case 'endfor':
	            return '}}());';
	        default:
	            // 默认直接输出变量, 过滤 undefined
	            //return `;$+=(typeof ${dir[0]}=='undefined'?'':${dir[0]}) ;` ;
	            return ';$+=(typeof (' + p0 + ')===\'undefined\'?\'\':(' + p0 + '));';
	    }
	}
	module.exports = function (tpl, data) {
	    var fn = function fn(d) {
	        var i = void 0,
	            k = [],
	            v = [];
	        for (i in d) {
	            k.push(i);
	            v.push(d[i]);
	        }
	        return new Function(k, fn.$).apply(d, v);
	    };
	    if (!fn.$) {
	        fn.$ = 'var $="";';
	        var tpls = tpl.split('{{');
	        for (var t = 0, len = tpls.length; t < len; t++) {
	            var p = tpls[t].split('}}');
	            if (t !== 0) {
	                fn.$ += parse(p[0]);
	            }
	            fn.$ += '$+="';
	            fn.$ += p[p.length - 1].replace(/\'/g, "\\'").replace(/\"/g, '\\"').replace(/\r\n/g, '\\n').replace(/\n/g, '\\n').replace(/\r/g, '\\n');
	            fn.$ += '"';
	        }
	        fn.$ += ';return $;';
	        //console.log(fn.$);
	    }
	    return data ? fn(data) : fn;
	};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var nativeReady = __webpack_require__(6);
	var nativeShare = __webpack_require__(16);
	var Fixtip = __webpack_require__(11);
	var queryString = __webpack_require__(17);
	
	function addZero(n) {
	    if (n < 10) {
	        return '0' + n;
	    }
	    return '' + n;
	}
	
	function getTime() {
	    var now = new Date();
	    var year = now.getFullYear();
	    var month = addZero(now.getMonth() + 1);
	    var day = addZero(now.getDate());
	    var hours = addZero(now.getHours());
	    var minutes = addZero(now.getMinutes());
	    var seconds = addZero(now.getSeconds());
	
	    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + secoeds;
	}
	
	function _isWechat() {
	    return navigator.userAgent.indexOf('MicroMessenger') > -1;
	}
	
	function shareApp(conf) {
	    nativeReady(function (appInfo) {
	        nativeShare({
	            url: conf.shareUrl,
	            content: conf.shareContent,
	            title: conf.shareTitle,
	            subTitle: conf.shareSubTitle,
	            image: conf.shareImgUrl
	        });
	    });
	}
	
	function shareWechat(conf) {
	    wx.ready(function () {
	        var shareOpt = {
	            title: conf.shareTitle, // 分享标题
	            link: conf.shareUrl, // 分享链接
	            imgUrl: conf.shareImgUrl, // 分享图标
	            desc: conf.shareContent,
	            type: '', // 分享类型,music、video或link，不填默认为link
	            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
	            success: function success() {
	                _vds.track("微信分享", {
	                    activeName: conf.activeName,
	                    activeUrl: conf.shareUrl,
	                    shareTime: getTime(),
	                    userId: conf.openid || ''
	                });
	            },
	            cancel: function cancel() {
	                // 用户取消分享后执行的回调函数
	            }
	        };
	        wx.onMenuShareTimeline(shareOpt);
	        wx.onMenuShareAppMessage(shareOpt);
	        wx.onMenuShareQQ(shareOpt);
	        wx.onMenuShareWeibo(shareOpt);
	    });
	}
	
	/**
	 * 获取user-agent里面的设备号
	 * user-agent示例
	 * deviceID/94A8FF48-DCA8-4D8A-9678-7A34FCFE59FF
	 */
	function getDeviceID() {
	    var userAgent = navigator.userAgent;
	    var deviceID = '';
	    if (userAgent.indexOf('deviceID/') > -1) {
	        var strs = userAgent.split('deviceID/');
	        if (strs.length > 1) {
	            var str = strs[1];
	            if (str.indexOf(' ') > -1) {
	                deviceID = str.split(' ')[0];
	            } else {
	                deviceID = str;
	            }
	        }
	    }
	    return deviceID;
	}
	
	function stat(info) {
	    // source 和 openid 需要手动设置
	    window._ax = [];
	    var source = 'other';
	    if (window.CONF.isapp) {
	        source = 'app';
	    } else if (_isWechat()) {
	        source = 'wechat';
	    } else {
	        if (window.location.search) {
	            var search = window.location.search.substring(1);
	            var params = queryString.parse(search);
	            if (params['trackId']) {
	                source = params['trackId'];
	            }
	        }
	    }
	
	    _ax.push(['set', 'source', source]);
	    _ax.push(['set', 'userId', info && info.userId ? info.userId : '']);
	    _ax.push(['set', 'openid', window.CONF.openid]);
	    _ax.push(['set', 'deviceID', getDeviceID()]);
	
	    (function () {
	        var vds = document.createElement('script');
	        vds.type = 'text/javascript';
	        vds.async = true;
	        vds.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'store.ddyc.com/res/xkcdn/analytics/v1.0.0/analytics.js';
	        var s = document.getElementsByTagName('script')[0];
	        s.parentNode.insertBefore(vds, s);
	    })();
	}
	
	var Common = function () {
	    function Common(conf) {
	        _classCallCheck(this, Common);
	
	        this.config = conf;
	        if (_isWechat()) {
	            wx.config({
	                debug: false,
	                appId: conf.appId,
	                timestamp: conf.timestamp,
	                nonceStr: conf.nonceStr,
	                signature: conf.signature,
	                jsApiList: [
	                // 所有要调用的 API 都要加到这个列表中
	                'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'getLocation']
	            });
	        }
	        if (this.config.isapp) {
	            nativeReady(function (info) {
	                stat(info);
	            });
	        } else {
	            stat();
	        }
	    }
	
	    _createClass(Common, [{
	        key: 'share',
	        value: function share() {
	            if (this.config.isapp) {
	                shareApp(this.config);
	            }
	            if (_isWechat()) {
	                shareWechat(this.config);
	            }
	            return this;
	        }
	    }, {
	        key: 'getLocation',
	        value: function getLocation(fn) {
	            wx.ready(function () {
	                wx.getLocation({
	                    type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
	                    success: function success(res) {
	                        var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
	                        var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
	                        var speed = res.speed; // 速度，以米/每秒计
	                        var accuracy = res.accuracy; // 位置精度
	                        fn(res.latitude, res.longitude);
	                    },
	                    error: function error(res) {
	                        new Fixtip({
	                            msg: '获取地理位置失败，请确认是否已开启'
	                        });
	                    }
	                });
	            });
	            return this;
	        }
	    }, {
	        key: 'isWechat',
	        value: function isWechat() {
	            return _isWechat();
	        }
	    }]);
	
	    return Common;
	}();
	
	var common = void 0;
	
	/**
	 * 单例模式， 依赖全局的 CONF 配置对象
	 * const getCommon = require('./module/common');
	 * getCommon().share();
	 */
	module.exports = function () {
	    if (!common) {
	        common = new Common(window.CONF);
	    }
	    return common;
	};

/***/ }),
/* 16 */
/***/ (function(module, exports) {

	'use strict';
	
	/**
	 * share
	 * version 3.2
	 */
	module.exports = function share(opt, callback) {
	    var bridge = window.bridge;
	    bridge.registerHandler('shareCallback', function (ret) {
	        if (callback) {
	            callback(bridge.toJson(ret));
	        }
	    });
	    opt.method = 'shareCallback';
	    bridge.callHandler('share', opt);
	};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var strictUriEncode = __webpack_require__(18);
	var objectAssign = __webpack_require__(19);
	
	function encode(value, opts) {
	    if (opts.encode) {
	        return opts.strict ? strictUriEncode(value) : encodeURIComponent(value);
	    }
	
	    return value;
	}
	
	/**
	 * 提取url中的query
	 * @param {string} str url
	 * @return {string} query
	 */
	exports.extract = function (str) {
	    return str.split('?')[1] || '';
	};
	
	/**
	 * 解析字符串
	 * @param {string} str 需要解析的url
	 * @return {object} query转成参数对象
	 * @example
	 * parse('a=b&c=d') //返回 {a:'b',c:'d'}
	 */
	exports.parse = function (str) {
	    // Create an object with no prototype
	    // https://github.com/sindresorhus/query-string/issues/47
	    var ret = Object.create(null);
	
	    if (typeof str !== 'string') {
	        return ret;
	    }
	
	    str = str.trim().replace(/^(\?|#|&)/, '');
	
	    if (!str) {
	        return ret;
	    }
	
	    str.split('&').forEach(function (param) {
	        var parts = param.replace(/\+/g, ' ').split('=');
	        // Firefox (pre 40) decodes `%3D` to `=`
	        // https://github.com/sindresorhus/query-string/pull/37
	        var key = parts.shift();
	        var val = parts.length > 0 ? parts.join('=') : undefined;
	
	        key = decodeURIComponent(key);
	
	        // missing `=` should be `null`:
	        // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
	        val = val === undefined ? null : decodeURIComponent(val);
	
	        if (ret[key] === undefined) {
	            ret[key] = val;
	        } else if (Array.isArray(ret[key])) {
	            ret[key].push(val);
	        } else {
	            ret[key] = [ret[key], val];
	        }
	    });
	
	    return ret;
	};
	
	/**
	 * 参数对象解析成query
	 * @param {object} obj  参数对象
	 * @param {object} opts 操作
	 * @param {boolean} opts.encode 是否需要encode
	 */
	exports.stringify = function (obj, opts) {
	    var defaults = {
	        encode: true,
	        strict: true
	    };
	
	    opts = objectAssign(defaults, opts);
	
	    return obj ? Object.keys(obj).sort().map(function (key) {
	        var val = obj[key];
	
	        if (val === undefined) {
	            return '';
	        }
	
	        if (val === null) {
	            return encode(key, opts);
	        }
	
	        if (Array.isArray(val)) {
	            var result = [];
	
	            val.slice().forEach(function (val2) {
	                if (val2 === undefined) {
	                    return;
	                }
	
	                if (val2 === null) {
	                    result.push(encode(key, opts));
	                } else {
	                    result.push(encode(key, opts) + '=' + encode(val2, opts));
	                }
	            });
	
	            return result.join('&');
	        }
	
	        return encode(key, opts) + '=' + encode(val, opts);
	    }).filter(function (x) {
	        return x.length > 0;
	    }).join('&') : '';
	};
	
	/**
	 * 把参数对象拼接到url上
	 * @param url {string} 待拼接的url
	 * @param data {object} 参数对象
	 * @return {string} 
	 * @example
	 * urlAppend('/xxx/xxx',{a:'1',b:'2'}) //返回 /xxx/xxx?a=1&b=2
	 */
	exports.urlAppend = function (url, data) {
	    if (!data) {
	        return url;
	    }
	    return url + '?' + exports.stringify(data);
	};

/***/ }),
/* 18 */
/***/ (function(module, exports) {

	'use strict';
	
	module.exports = function (str) {
		return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
			return '%' + c.charCodeAt(0).toString(16).toUpperCase();
		});
	};

/***/ }),
/* 19 */
/***/ (function(module, exports) {

	/*
	object-assign
	(c) Sindre Sorhus
	@license MIT
	*/
	
	'use strict';
	/* eslint-disable no-unused-vars */
	
	var getOwnPropertySymbols = Object.getOwnPropertySymbols;
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;
	
	function toObject(val) {
		if (val === null || val === undefined) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}
	
		return Object(val);
	}
	
	function shouldUseNative() {
		try {
			if (!Object.assign) {
				return false;
			}
	
			// Detect buggy property enumeration order in older V8 versions.
	
			// https://bugs.chromium.org/p/v8/issues/detail?id=4118
			var test1 = new String('abc'); // eslint-disable-line no-new-wrappers
			test1[5] = 'de';
			if (Object.getOwnPropertyNames(test1)[0] === '5') {
				return false;
			}
	
			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test2 = {};
			for (var i = 0; i < 10; i++) {
				test2['_' + String.fromCharCode(i)] = i;
			}
			var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
				return test2[n];
			});
			if (order2.join('') !== '0123456789') {
				return false;
			}
	
			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test3 = {};
			'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
				test3[letter] = letter;
			});
			if (Object.keys(Object.assign({}, test3)).join('') !== 'abcdefghijklmnopqrst') {
				return false;
			}
	
			return true;
		} catch (err) {
			// We don't expect any of the above to throw, but better to be safe.
			return false;
		}
	}
	
	module.exports = shouldUseNative() ? Object.assign : function (target, source) {
		var from;
		var to = toObject(target);
		var symbols;
	
		for (var s = 1; s < arguments.length; s++) {
			from = Object(arguments[s]);
	
			for (var key in from) {
				if (hasOwnProperty.call(from, key)) {
					to[key] = from[key];
				}
			}
	
			if (getOwnPropertySymbols) {
				symbols = getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) {
					if (propIsEnumerable.call(from, symbols[i])) {
						to[symbols[i]] = from[symbols[i]];
					}
				}
			}
		}
	
		return to;
	};

/***/ }),
/* 20 */
/***/ (function(module, exports) {

	"use strict";
	
	/**
	 * 判断用户是否登录
	 * @return {Boolean}
	 */
	module.exports = function isLogin() {
	    var bridge = window.bridge;
	    if (!bridge.appInfo) {
	        return false;
	    }
	    var userId = parseInt(bridge.appInfo.userId);
	    if (userId) {
	        return true;
	    }
	    return false;
	};

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var objectAssign = __webpack_require__(19);
	var isPhone = __webpack_require__(22);
	var isEmpty = __webpack_require__(23);
	var compareVersion = __webpack_require__(24);
	var queryString = __webpack_require__(17);
	
	module.exports = {
	    isPhone: isPhone,
	    isEmpty: isEmpty,
	    compareVersion: compareVersion,
	    queryString: queryString
	};

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var isEmpty = __webpack_require__(23);
	
	/**
	 * 字符串是否为空
	 * @param  {string}  str 待验证的字符串
	 * @return {Boolean}       
	 */
	function isPhone(str) {
	    if (!isEmpty(str)) {
	        return (/^1[34578]{1}[0-9]{9}$/g.test(str) || /^1011[12]{1}\d{6}$/g.test(str)
	        );
	    }
	    return false;
	}
	
	module.exports = isPhone;

/***/ }),
/* 23 */
/***/ (function(module, exports) {

	'use strict';
	
	/**
	 * 字符串是否为空
	 * @param  {string}  str 待验证的字符串
	 * @return {Boolean}       
	 */
	
	function isEmpty(str) {
	    if (typeof str != 'string') {
	        return false;
	    }
	    return str.replace(/\s/g, '') === '';
	}
	
	module.exports = isEmpty;

/***/ }),
/* 24 */
/***/ (function(module, exports) {

	'use strict';
	
	/**
	 * 版本号比较判断 如： 3.4.9  3.4.10
	 * @param {string}
	 * @param {string}
	 * @return {Boolane} v1>=v2 返回true
	 */
	function compareVersion(v1, v2) {
	    if (v1 == v2) {
	        return true;
	    }
	    var v1arr = v1.split('.');
	    var v2arr = v2.split('.');
	    var val1 = void 0,
	        val2 = void 0;
	    for (var i = 0, len = v1arr.length; i < len; i++) {
	        val1 = v1arr[i] ? parseInt(v1arr[i]) : 0;
	        val2 = v2arr[i] ? parseInt(v2arr[i]) : 0;
	        if (val1 == val2) {
	            continue;
	        }
	        if (val1 > val2) {
	            return true;
	        } else {
	            return false;
	        }
	    }
	    return false;
	}
	
	module.exports = compareVersion;

/***/ }),
/* 25 */
/***/ (function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	exports.mnul = mnul;
	exports.auto = auto;
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * 防止按钮重复点击, 需要手动重置
	 * 
	 * @example:
	 * const norepeat = require('norepeat-event');
	 * let flag = norepeat.mnul('select').on('tap', function(){
	 *      // do something
	 * });
	 * 
	 * switch.reset();
	 */
	var MnulEvent = function () {
	    function MnulEvent(selector) {
	        _classCallCheck(this, MnulEvent);
	
	        this.$btn = $(selector);
	        this.switch = true;
	    }
	
	    _createClass(MnulEvent, [{
	        key: "reset",
	        value: function reset() {
	            this.switch = true;
	            return this;
	        }
	    }, {
	        key: "on",
	        value: function on(type, fn) {
	            var me = this;
	            this.$btn.on(type, function () {
	                if (!me.switch) {
	                    return false;
	                }
	                me.switch = false;
	                return fn.call(this);
	            });
	            return this;
	        }
	    }]);
	
	    return MnulEvent;
	}();
	
	function mnul(selector) {
	    return new MnulEvent(selector);
	}
	
	/**
	 * 防止按钮重复点击, 自动重置
	 * @example:
	 * const norepeat = require('norepeat-event');
	 * norepeat.auto('selector').on('tap', function(){
	 *      // do something
	 * })
	 */
	
	var AutoEvent = function () {
	    function AutoEvent(selector) {
	        _classCallCheck(this, AutoEvent);
	
	        this.$btn = $(selector);
	        this.switch = true; // 是否触发事件的开关
	
	        this.timer = null;
	        this.time = 1000;
	    }
	
	    _createClass(AutoEvent, [{
	        key: "setResetTime",
	        value: function setResetTime(time) {
	            this.time = time;
	            return this;
	        }
	    }, {
	        key: "reset",
	        value: function reset() {
	            var _this = this;
	
	            clearTimeout(this.timer);
	            this.timer = setTimeout(function () {
	                _this.switch = true;
	                if (_this.resetEvent) {
	                    _this.resetEvent();
	                }
	            }, this.time);
	            return this;
	        }
	    }, {
	        key: "onReset",
	        value: function onReset(callback) {
	            this.resetEvent = callback;
	            return this;
	        }
	    }, {
	        key: "on",
	        value: function on(type, fn) {
	            var me = this;
	            this.$btn.on(type, function () {
	                if (!me.switch) {
	                    return;
	                }
	                me.switch = false;
	                me.reset();
	                fn.call(this);
	            });
	            return this;
	        }
	    }]);
	
	    return AutoEvent;
	}();
	
	function auto(selector) {
	    return new AutoEvent(selector);
	}

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Select = __webpack_require__(27);
	
	var CITY_DATA = [{ "c": "820000", "n": "澳门", "k": "A", "cs": [{ "c": "820000", "n": "澳门" }] }, { "c": "340000", "n": "安徽", "k": "A", "cs": [{ "c": "340100", "n": "合肥" }, { "c": "340200", "n": "芜湖" }, { "c": "340300", "n": "蚌埠" }, { "c": "340400", "n": "淮南" }, { "c": "340500", "n": "马鞍山" }, { "c": "340600", "n": "淮北" }, { "c": "340700", "n": "铜陵" }, { "c": "340800", "n": "安庆" }, { "c": "341000", "n": "黄山" }, { "c": "341100", "n": "滁州" }, { "c": "341200", "n": "阜阳" }, { "c": "341300", "n": "宿州" }, { "c": "341500", "n": "六安" }, { "c": "341600", "n": "亳州" }, { "c": "341700", "n": "池州" }, { "c": "341800", "n": "宣城" }] }, { "c": "110000", "n": "北京", "k": "B", "cs": [{ "c": "110000", "n": "北京" }] }, { "c": "500000", "n": "重庆", "k": "C", "cs": [{ "c": "500000", "n": "重庆" }] }, { "c": "350000", "n": "福建", "k": "F", "cs": [{ "c": "350100", "n": "福州" }, { "c": "350200", "n": "厦门" }, { "c": "350300", "n": "莆田" }, { "c": "350400", "n": "三明" }, { "c": "350500", "n": "泉州" }, { "c": "350600", "n": "漳州" }, { "c": "350700", "n": "南平" }, { "c": "350800", "n": "龙岩" }, { "c": "350900", "n": "宁德" }] }, { "c": "440000", "n": "广东", "k": "G", "cs": [{ "c": "440100", "n": "广州" }, { "c": "440200", "n": "韶关" }, { "c": "440300", "n": "深圳" }, { "c": "440400", "n": "珠海" }, { "c": "440500", "n": "汕头" }, { "c": "440600", "n": "佛山" }, { "c": "440700", "n": "江门" }, { "c": "440800", "n": "湛江" }, { "c": "440900", "n": "茂名" }, { "c": "441200", "n": "肇庆" }, { "c": "441300", "n": "惠州" }, { "c": "441400", "n": "梅州" }, { "c": "441500", "n": "汕尾" }, { "c": "441600", "n": "河源" }, { "c": "441700", "n": "阳江" }, { "c": "441800", "n": "清远" }, { "c": "441900", "n": "东莞" }, { "c": "442000", "n": "中山" }, { "c": "445100", "n": "潮州" }, { "c": "445200", "n": "揭阳" }, { "c": "445300", "n": "云浮" }] }, { "c": "450000", "n": "广西", "k": "G", "cs": [{ "c": "450100", "n": "南宁" }, { "c": "450200", "n": "柳州" }, { "c": "450300", "n": "桂林" }, { "c": "450400", "n": "梧州" }, { "c": "450500", "n": "北海" }, { "c": "450600", "n": "防城港" }, { "c": "450700", "n": "钦州" }, { "c": "450800", "n": "贵港" }, { "c": "450900", "n": "玉林" }, { "c": "451000", "n": "百色" }, { "c": "451100", "n": "贺州" }, { "c": "451200", "n": "河池" }, { "c": "451300", "n": "来宾" }, { "c": "451400", "n": "崇左" }] }, { "c": "520000", "n": "贵州", "k": "G", "cs": [{ "c": "520100", "n": "贵阳" }, { "c": "520200", "n": "六盘水" }, { "c": "520300", "n": "遵义" }, { "c": "520400", "n": "安顺" }, { "c": "520500", "n": "毕节" }, { "c": "520600", "n": "铜仁" }, { "c": "522300", "n": "黔西南" }, { "c": "522600", "n": "黔东南" }, { "c": "522700", "n": "黔南" }] }, { "c": "620000", "n": "甘肃", "k": "G", "cs": [{ "c": "620100", "n": "兰州" }, { "c": "620200", "n": "嘉峪关" }, { "c": "620300", "n": "金昌" }, { "c": "620400", "n": "白银" }, { "c": "620500", "n": "天水" }, { "c": "620600", "n": "武威" }, { "c": "620700", "n": "张掖" }, { "c": "620800", "n": "平凉" }, { "c": "620900", "n": "酒泉" }, { "c": "621000", "n": "庆阳" }, { "c": "621100", "n": "定西" }, { "c": "621200", "n": "陇南" }, { "c": "622900", "n": "临夏" }, { "c": "623000", "n": "甘南" }] }, { "c": "130000", "n": "河北", "k": "H", "cs": [{ "c": "130100", "n": "石家庄" }, { "c": "130200", "n": "唐山" }, { "c": "130300", "n": "秦皇岛" }, { "c": "130400", "n": "邯郸" }, { "c": "130500", "n": "邢台" }, { "c": "130600", "n": "保定" }, { "c": "130700", "n": "张家口" }, { "c": "130800", "n": "承德" }, { "c": "130900", "n": "沧州" }, { "c": "131000", "n": "廊坊" }, { "c": "131100", "n": "衡水" }, { "c": "139001", "n": "定州" }, { "c": "139002", "n": "辛集" }] }, { "c": "230000", "n": "黑龙江", "k": "H", "cs": [{ "c": "230100", "n": "哈尔滨" }, { "c": "230200", "n": "齐齐哈尔" }, { "c": "230300", "n": "鸡西" }, { "c": "230400", "n": "鹤岗" }, { "c": "230500", "n": "双鸭山" }, { "c": "230600", "n": "大庆" }, { "c": "230700", "n": "伊春" }, { "c": "230800", "n": "佳木斯" }, { "c": "230900", "n": "七台河" }, { "c": "231000", "n": "牡丹江" }, { "c": "231100", "n": "黑河" }, { "c": "231200", "n": "绥化" }, { "c": "232700", "n": "大兴安岭" }] }, { "c": "410000", "n": "河南", "k": "H", "cs": [{ "c": "410100", "n": "郑州" }, { "c": "410200", "n": "开封" }, { "c": "410300", "n": "洛阳" }, { "c": "410400", "n": "平顶山" }, { "c": "410500", "n": "安阳" }, { "c": "410600", "n": "鹤壁" }, { "c": "410700", "n": "新乡" }, { "c": "410800", "n": "焦作" }, { "c": "410900", "n": "濮阳" }, { "c": "411000", "n": "许昌" }, { "c": "411100", "n": "漯河" }, { "c": "411200", "n": "三门峡" }, { "c": "411300", "n": "南阳" }, { "c": "411400", "n": "商丘" }, { "c": "411500", "n": "信阳" }, { "c": "411600", "n": "周口" }, { "c": "411700", "n": "驻马店" }, { "c": "419001", "n": "济源" }] }, { "c": "420000", "n": "湖北", "k": "H", "cs": [{ "c": "420100", "n": "武汉" }, { "c": "420200", "n": "黄石" }, { "c": "420300", "n": "十堰" }, { "c": "420500", "n": "宜昌" }, { "c": "420600", "n": "襄阳" }, { "c": "420700", "n": "鄂州" }, { "c": "420800", "n": "荆门" }, { "c": "420900", "n": "孝感" }, { "c": "421000", "n": "荆州" }, { "c": "421100", "n": "黄冈" }, { "c": "421200", "n": "咸宁" }, { "c": "421300", "n": "随州" }, { "c": "422800", "n": "恩施" }, { "c": "429004", "n": "仙桃" }, { "c": "429005", "n": "潜江" }, { "c": "429006", "n": "天门" }, { "c": "429021", "n": "神农架" }] }, { "c": "430000", "n": "湖南", "k": "H", "cs": [{ "c": "430100", "n": "长沙" }, { "c": "430200", "n": "株洲" }, { "c": "430300", "n": "湘潭" }, { "c": "430400", "n": "衡阳" }, { "c": "430500", "n": "邵阳" }, { "c": "430600", "n": "岳阳" }, { "c": "430700", "n": "常德" }, { "c": "430800", "n": "张家界" }, { "c": "430900", "n": "益阳" }, { "c": "431000", "n": "郴州" }, { "c": "431100", "n": "永州" }, { "c": "431200", "n": "怀化" }, { "c": "431300", "n": "娄底" }, { "c": "433100", "n": "湘西" }] }, { "c": "460000", "n": "海南", "k": "H", "cs": [{ "c": "460100", "n": "海口" }, { "c": "460200", "n": "三亚" }, { "c": "460300", "n": "三沙" }, { "c": "469001", "n": "五指山" }, { "c": "469002", "n": "琼海" }, { "c": "469003", "n": "儋州" }, { "c": "469005", "n": "文昌" }, { "c": "469006", "n": "万宁" }, { "c": "469007", "n": "东方" }, { "c": "469021", "n": "定安" }, { "c": "469022", "n": "屯昌" }, { "c": "469023", "n": "澄迈" }, { "c": "469024", "n": "临高" }, { "c": "469025", "n": "白沙" }, { "c": "469026", "n": "昌江" }, { "c": "469027", "n": "乐东" }, { "c": "469028", "n": "陵水" }, { "c": "469029", "n": "保亭" }, { "c": "469030", "n": "琼中" }] }, { "c": "220000", "n": "吉林", "k": "J", "cs": [{ "c": "220100", "n": "长春" }, { "c": "220200", "n": "吉林" }, { "c": "220300", "n": "四平" }, { "c": "220400", "n": "辽源" }, { "c": "220500", "n": "通化" }, { "c": "220600", "n": "白山" }, { "c": "220700", "n": "松原" }, { "c": "220800", "n": "白城" }, { "c": "222400", "n": "延边" }] }, { "c": "320000", "n": "江苏", "k": "J", "cs": [{ "c": "320100", "n": "南京" }, { "c": "320200", "n": "无锡" }, { "c": "320300", "n": "徐州" }, { "c": "320400", "n": "常州" }, { "c": "320500", "n": "苏州" }, { "c": "320600", "n": "南通" }, { "c": "320700", "n": "连云港" }, { "c": "320800", "n": "淮安" }, { "c": "320900", "n": "盐城" }, { "c": "321000", "n": "扬州" }, { "c": "321100", "n": "镇江" }, { "c": "321200", "n": "泰州" }, { "c": "321300", "n": "宿迁" }] }, { "c": "360000", "n": "江西", "k": "J", "cs": [{ "c": "360100", "n": "南昌" }, { "c": "360200", "n": "景德镇" }, { "c": "360300", "n": "萍乡" }, { "c": "360400", "n": "九江" }, { "c": "360500", "n": "新余" }, { "c": "360600", "n": "鹰潭" }, { "c": "360700", "n": "赣州" }, { "c": "360800", "n": "吉安" }, { "c": "360900", "n": "宜春" }, { "c": "361000", "n": "抚州" }, { "c": "361100", "n": "上饶" }] }, { "c": "210000", "n": "辽宁", "k": "L", "cs": [{ "c": "210100", "n": "沈阳" }, { "c": "210200", "n": "大连" }, { "c": "210300", "n": "鞍山" }, { "c": "210400", "n": "抚顺" }, { "c": "210500", "n": "本溪" }, { "c": "210600", "n": "丹东" }, { "c": "210700", "n": "锦州" }, { "c": "210800", "n": "营口" }, { "c": "210900", "n": "阜新" }, { "c": "211000", "n": "辽阳" }, { "c": "211100", "n": "盘锦" }, { "c": "211200", "n": "铁岭" }, { "c": "211300", "n": "朝阳" }, { "c": "211400", "n": "葫芦岛" }] }, { "c": "150000", "n": "内蒙古", "k": "N", "cs": [{ "c": "150100", "n": "呼和浩特" }, { "c": "150200", "n": "包头" }, { "c": "150300", "n": "乌海" }, { "c": "150400", "n": "赤峰" }, { "c": "150500", "n": "通辽" }, { "c": "150600", "n": "鄂尔多斯" }, { "c": "150700", "n": "呼伦贝尔" }, { "c": "150800", "n": "巴彦淖尔" }, { "c": "150900", "n": "乌兰察布" }, { "c": "152200", "n": "兴安盟" }, { "c": "152500", "n": "锡林郭勒盟" }, { "c": "152900", "n": "阿拉善盟" }] }, { "c": "640000", "n": "宁夏", "k": "N", "cs": [{ "c": "640100", "n": "银川" }, { "c": "640200", "n": "石嘴山" }, { "c": "640300", "n": "吴忠" }, { "c": "640400", "n": "固原" }, { "c": "640500", "n": "中卫" }] }, { "c": "630000", "n": "青海", "k": "Q", "cs": [{ "c": "630100", "n": "西宁" }, { "c": "630200", "n": "海东" }, { "c": "632200", "n": "海北" }, { "c": "632300", "n": "黄南" }, { "c": "632500", "n": "海南" }, { "c": "632600", "n": "果洛" }, { "c": "632700", "n": "玉树" }, { "c": "632800", "n": "海西" }] }, { "c": "140000", "n": "山西", "k": "S", "cs": [{ "c": "140100", "n": "太原" }, { "c": "140200", "n": "大同" }, { "c": "140300", "n": "阳泉" }, { "c": "140400", "n": "长治" }, { "c": "140500", "n": "晋城" }, { "c": "140600", "n": "朔州" }, { "c": "140700", "n": "晋中" }, { "c": "140800", "n": "运城" }, { "c": "140900", "n": "忻州" }, { "c": "141000", "n": "临汾" }, { "c": "141100", "n": "吕梁" }] }, { "c": "310000", "n": "上海", "k": "S", "cs": [{ "c": "310000", "n": "上海" }] }, { "c": "370000", "n": "山东", "k": "S", "cs": [{ "c": "370100", "n": "济南" }, { "c": "370200", "n": "青岛" }, { "c": "370300", "n": "淄博" }, { "c": "370400", "n": "枣庄" }, { "c": "370500", "n": "东营" }, { "c": "370600", "n": "烟台" }, { "c": "370700", "n": "潍坊" }, { "c": "370800", "n": "济宁" }, { "c": "370900", "n": "泰安" }, { "c": "371000", "n": "威海" }, { "c": "371100", "n": "日照" }, { "c": "371200", "n": "莱芜" }, { "c": "371300", "n": "临沂" }, { "c": "371400", "n": "德州" }, { "c": "371500", "n": "聊城" }, { "c": "371600", "n": "滨州" }, { "c": "371700", "n": "菏泽" }] }, { "c": "510000", "n": "四川", "k": "S", "cs": [{ "c": "510100", "n": "成都" }, { "c": "510300", "n": "自贡" }, { "c": "510400", "n": "攀枝花" }, { "c": "510500", "n": "泸州" }, { "c": "510600", "n": "德阳" }, { "c": "510700", "n": "绵阳" }, { "c": "510800", "n": "广元" }, { "c": "510900", "n": "遂宁" }, { "c": "511000", "n": "内江" }, { "c": "511100", "n": "乐山" }, { "c": "511300", "n": "南充" }, { "c": "511400", "n": "眉山" }, { "c": "511500", "n": "宜宾" }, { "c": "511600", "n": "广安" }, { "c": "511700", "n": "达州" }, { "c": "511800", "n": "雅安" }, { "c": "511900", "n": "巴中" }, { "c": "512000", "n": "资阳" }, { "c": "513200", "n": "阿坝" }, { "c": "513300", "n": "甘孜" }, { "c": "513400", "n": "凉山" }] }, { "c": "610000", "n": "陕西", "k": "S", "cs": [{ "c": "610100", "n": "西安" }, { "c": "610200", "n": "铜川" }, { "c": "610300", "n": "宝鸡" }, { "c": "610400", "n": "咸阳" }, { "c": "610500", "n": "渭南" }, { "c": "610600", "n": "延安" }, { "c": "610700", "n": "汉中" }, { "c": "610800", "n": "榆林" }, { "c": "610900", "n": "安康" }, { "c": "611000", "n": "商洛" }] }, { "c": "120000", "n": "天津", "k": "T", "cs": [{ "c": "120000", "n": "天津" }] }, { "c": "710000", "n": "台湾", "k": "T", "cs": [{ "c": "710000", "n": "台湾" }] }, { "c": "540000", "n": "西藏", "k": "X", "cs": [{ "c": "540100", "n": "拉萨" }, { "c": "540200", "n": "日喀则" }, { "c": "540300", "n": "昌都" }, { "c": "540400", "n": "林芝" }, { "c": "542200", "n": "山南" }, { "c": "542400", "n": "那曲" }, { "c": "542500", "n": "阿里" }] }, { "c": "650000", "n": "新疆", "k": "X", "cs": [{ "c": "650100", "n": "乌鲁木齐" }, { "c": "650200", "n": "克拉玛依" }, { "c": "650400", "n": "吐鲁番" }, { "c": "652200", "n": "哈密" }, { "c": "652300", "n": "昌吉" }, { "c": "652700", "n": "博尔塔拉" }, { "c": "652800", "n": "巴音郭楞" }, { "c": "652900", "n": "阿克苏" }, { "c": "653000", "n": "克孜勒苏" }, { "c": "653100", "n": "喀什" }, { "c": "653200", "n": "和田" }, { "c": "654000", "n": "伊犁" }, { "c": "654200", "n": "塔城" }, { "c": "654300", "n": "阿勒泰" }, { "c": "659001", "n": "石河子" }, { "c": "659002", "n": "阿拉尔" }, { "c": "659003", "n": "图木舒克" }, { "c": "659004", "n": "五家渠" }] }, { "c": "810000", "n": "香港", "k": "X", "cs": [{ "c": "810000", "n": "香港" }] }, { "c": "530000", "n": "云南", "k": "Y", "cs": [{ "c": "530100", "n": "昆明" }, { "c": "530300", "n": "曲靖" }, { "c": "530400", "n": "玉溪" }, { "c": "530500", "n": "保山" }, { "c": "530600", "n": "昭通" }, { "c": "530700", "n": "丽江" }, { "c": "530800", "n": "普洱" }, { "c": "530900", "n": "临沧" }, { "c": "532300", "n": "楚雄" }, { "c": "532500", "n": "红河" }, { "c": "532600", "n": "文山" }, { "c": "532800", "n": "西双版纳" }, { "c": "532900", "n": "大理" }, { "c": "533100", "n": "德宏" }, { "c": "533300", "n": "怒江" }, { "c": "533400", "n": "迪庆" }] }, { "c": "330000", "n": "浙江", "k": "Z", "cs": [{ "c": "330100", "n": "杭州" }, { "c": "330200", "n": "宁波" }, { "c": "330300", "n": "温州" }, { "c": "330400", "n": "嘉兴" }, { "c": "330500", "n": "湖州" }, { "c": "330600", "n": "绍兴" }, { "c": "330700", "n": "金华" }, { "c": "330800", "n": "衢州" }, { "c": "330900", "n": "舟山" }, { "c": "331000", "n": "台州" }, { "c": "331100", "n": "丽水" }] }];
	
	var SelectCity = function () {
	    function SelectCity() {
	        var _this = this;
	
	        _classCallCheck(this, SelectCity);
	
	        this.value = [];
	
	        this.selectProvince = new Select({ title: '请选择省' });
	        this.selectProvince.setRenderMap({
	            name: 'n',
	            key: 'k'
	        });
	        this.selectCity = new Select({ title: '请选择城市', stopRenderKey: true });
	        this.selectCity.setRenderMap({ name: 'n' });
	        this.selectProvince.setData(CITY_DATA);
	        this.selectProvince.onTap(function (item) {
	            _this.value[0] = item;
	            var cityData = _this.getCityData(item.c);
	            if (cityData.length === 1) {
	                _this.value[1] = cityData[0];
	                if (_this.onTapEvent) {
	                    _this.onTapEvent.call(_this, _this.value);
	                    _this.selectProvince.hide();
	                }
	            } else {
	                // 城市选择点击事件
	                _this.selectCity.setData(_this.getCityData(item.c));
	                _this.selectCity.show();
	            }
	        });
	        this.selectCity.onTap(function (item) {
	            _this.value[1] = item;
	            if (_this.onTapEvent) {
	                _this.onTapEvent.call(_this, _this.value);
	            }
	            _this.selectProvince.hide();
	            _this.selectCity.hide();
	        });
	
	        this.onTapEvent = null;
	    }
	
	    _createClass(SelectCity, [{
	        key: "onTap",
	        value: function onTap(fn) {
	            this.onTapEvent = fn;
	            return this;
	        }
	    }, {
	        key: "getCityData",
	        value: function getCityData(pID) {
	            var ret = [];
	            CITY_DATA.forEach(function (item) {
	                if (item.c == pID) {
	                    ret = item.cs;
	                }
	            });
	            return ret;
	        }
	    }, {
	        key: "show",
	        value: function show() {
	            this.selectProvince.show();
	            return this;
	        }
	    }, {
	        key: "hide",
	        value: function hide() {
	            this.selectProvince.hide();
	            this.selectCity.hide();
	            return this;
	        }
	    }, {
	        key: "destroy",
	        value: function destroy() {
	            this.selectProvince.destroy();
	            this.selectCity.destroy();
	            return this;
	        }
	    }]);
	
	    return SelectCity;
	}();
	
	//单列模块
	
	
	var instanceSelectCity = void 0;
	SelectCity.getOnly = function () {
	    if (!instanceSelectCity) {
	        instanceSelectCity = new SelectCity();
	    }
	    return instanceSelectCity;
	};
	
	SelectCity.cityData = CITY_DATA;
	
	module.exports = SelectCity;

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Tween = __webpack_require__(28);
	var xtpl = __webpack_require__(14);
	__webpack_require__(29);
	
	var htmlTemp = '<aside class="aside hide">\n    <div class="aside-content">\n        <nav>\n            <p>{title}</p>\n            <div class="aside-close">\n                <i class="aside-icon-close"></i>\n            </div>\n        </nav>\n        <section>  \n        </section>\n    </div>\n</aside>';
	
	var renderTemp = '{{ if !stopRenderKey }}\n    <ul class="aside-key">\n        {{ each keys as k }}<li>{{ k }}</li>{{ endeach }}\n    </ul>\n    {{ endif }}\n    {{ for data as list key }}\n        {{ if !stopRenderKey }}\n            <h3 data-key="{{ key }}">{{ key }}</h3>\n        {{ endif }}\n        <ul class="aside-list">\n            {{ each list as item i}}\n                <li data-idx="{{ i }}" data-key="{{ key }}">\n                {{ if item[map.icon] }}\n                    <img src="{{ item[map.icon] }}">\n                {{ endif }}\n                {{ item[map.name] }}\n                </li>\n            {{ endeach }}\n        </ul>\n    {{ endfor }}\n';
	
	var Select = function () {
	    /**
	     * @param opt{Object} 
	     * @param opt.stopRenderKey {Boolean} 是否渲染快捷锚点
	     * @param opt.title {String} 渲染标题
	     */
	
	    /**
	     * 渲染数据格式
	     *  [{
	            icon  : '',  
	            name  : '',  
	            key   : ''   //首字母
	        }]
	     */
	    function Select(opt) {
	        _classCallCheck(this, Select);
	
	        this.stopRenderKey = opt.stopRenderKey; // true/false
	        this.keys = [];
	        this.data = {};
	        this.renderMap = {
	            key: 'key',
	            name: 'name',
	            icon: 'icon'
	        };
	
	        this.$wrap = $(htmlTemp.replace('{title}', opt.title));
	        this.render = xtpl(renderTemp);
	        $('body').append(this.$wrap);
	
	        this.$content = this.$wrap.find('.aside-content');
	        this.$section = this.$wrap.find('section');
	
	        this.onTapEvent = null;
	        this.bindEvent();
	    }
	
	    _createClass(Select, [{
	        key: 'onTap',
	        value: function onTap(fn) {
	            this.onTapEvent = fn;
	            return this;
	        }
	    }, {
	        key: 'setRenderMap',
	        value: function setRenderMap(obj) {
	            this.renderMap.key = obj.key || 'key';
	            this.renderMap.name = obj.name || 'name';
	            this.renderMap.icon = obj.icon || 'icon';
	            return this;
	        }
	    }, {
	        key: 'format',
	        value: function format(data) {
	            var _this = this;
	
	            data.forEach(function (item) {
	                var key = item[_this.renderMap.key];
	                if (!_this.data[key]) {
	                    _this.keys.push(key);
	                    _this.data[key] = [];
	                }
	                _this.data[key].push(item);
	            });
	            return this;
	        }
	    }, {
	        key: 'setData',
	        value: function setData(data) {
	            this.data = {};
	            this.keys.length = 0;
	            this.format(data);
	            var listHtml = this.render({
	                stopRenderKey: this.stopRenderKey,
	                keys: this.keys,
	                data: this.data,
	                map: this.renderMap
	            });
	            this.$section.html(listHtml);
	            return this;
	        }
	    }, {
	        key: 'bindEvent',
	        value: function bindEvent() {
	            var me = this;
	            this.$wrap.on('touchmove', function (e) {
	                if ($(e.target).hasClass('aside')) {
	                    return false;
	                }
	            });
	            this.$wrap.on('click', function (e) {
	                e.preventDefault();
	                if ($(e.target).hasClass('aside')) {
	                    me.hide();
	                }
	            });
	            this.$wrap.find('.aside-close').on('click', function (e) {
	                e.preventDefault();
	                // 关闭按钮
	                me.hide();
	            });
	            this.$wrap.on('click', '.aside-key li', function (e) {
	                e.preventDefault();
	                // 字母锚点事件
	                var that = $(this);
	                var $tag = me.$wrap.find('h3[data-key="' + that.html() + '"]');
	                var offset = $tag.offset();
	                // fix ios -webkit-overflow-scrolling bug 
	                new Tween().from({
	                    top: me.$section.scrollTop()
	                }).to({
	                    top: offset.top - 46
	                }).on('update', function (o) {
	                    me.$section.scrollTop(o.top);
	                }).start();
	            });
	            this.$wrap.on('click', '.aside-list li', function (e) {
	                e.preventDefault();
	                // option 触摸事件
	                var that = $(this);
	                var key = that.data('key');
	                var idx = that.data('idx');
	
	                if (me.onTapEvent) {
	                    me.onTapEvent.call(me, me.data[key][idx]);
	                }
	            });
	        }
	    }, {
	        key: 'show',
	        value: function show() {
	            var _this2 = this;
	
	            this.$wrap.removeClass('hide');
	            setTimeout(function () {
	                _this2.$content.addClass('aside-show');
	            }, 20);
	            return this;
	        }
	    }, {
	        key: 'hide',
	        value: function hide() {
	            var _this3 = this;
	
	            this.$content.removeClass('aside-show');
	            setTimeout(function () {
	                _this3.$wrap.addClass('hide');
	            }, 300);
	            return this;
	        }
	    }, {
	        key: 'destroy',
	        value: function destroy() {
	            var _this4 = this;
	
	            this.hide();
	            setTimeout(function () {
	                _this4.$wrap.remove();
	            });
	        }
	    }]);
	
	    return Select;
	}();
	
	module.exports = Select;

/***/ }),
/* 28 */
/***/ (function(module, exports) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * 缓动动画
	 * 可侦听的事件类型:
	 *     update    需要计算的值发生变化的时候触发
	 *     stop      动画停止的时候触发
	 *     complate  动画完成的时候触发，该事件之前总会触发stop事件
	 * @example
	 *     Tween.create({
	 *         easing    : 'InOut',
	 *         frame     : 20,
	 *         delay     : 0,
	 *         time      : 2000
	 *     }).from({x:0,y:0})
	 *       .to({x:50,y:100})
	 *       .on('update',function(obj){
	 *           el.left = obj.x
	 *           el.top  = obj.y
	 *       }).start();
	 */
	
	function apply(o, c, defaults) {
	    // no "this" reference for friendly out of scope calls
	    if (defaults) {
	        apply(o, defaults);
	    }
	    if (o && c && (typeof c === 'undefined' ? 'undefined' : _typeof(c)) == 'object') {
	        for (var p in c) {
	            o[p] = c[p];
	        }
	    }
	    return o;
	}
	
	var options = {
	    easing: 'linear', // 参考easingMap
	    frame: 40, //帧数
	    delay: 0,
	    time: 200 //动画持续时间
	};
	var easingMap = {
	    linear: function linear(t, b, c, d) {
	        return c * t / d + b;
	    },
	    easeIn: function easeIn(t, b, c, d) {
	        return c * (t /= d) * t + b;
	    },
	    easeOut: function easeOut(t, b, c, d) {
	        return -c * (t /= d) * (t - 2) + b;
	    },
	    easeInOut: function easeInOut(t, b, c, d) {
	        if ((t /= d / 2) < 1) return c / 2 * t * t + b;
	        return -c / 2 * (--t * (t - 2) - 1) + b;
	    }
	};
	
	var Observe = function () {
	    function Observe() {
	        _classCallCheck(this, Observe);
	    }
	
	    _createClass(Observe, [{
	        key: 'on',
	        value: function on(key, func) {
	            if (!this.__events__) {
	                this.__events__ = {};
	            }
	            this.__events__[key] = func;
	            return this;
	        }
	    }, {
	        key: 'off',
	        value: function off(key) {
	            if (!this.__events__) {
	                return this;
	            }
	            if (key) {
	                delete this.__events__[key];
	            } else {
	                delete this.__events__;
	            }
	            return this;
	        }
	    }, {
	        key: 'trigger',
	        value: function trigger(key, args) {
	            if (!this.__events__) {
	                return null;
	            }
	            if (!this.__events__[key]) {
	                return null;
	            }
	            return this.__events__[key].apply(this, args);
	        }
	    }]);
	
	    return Observe;
	}();
	
	var Tween = function (_Observe) {
	    _inherits(Tween, _Observe);
	
	    function Tween(obj) {
	        _classCallCheck(this, Tween);
	
	        var _this = _possibleConstructorReturn(this, (Tween.__proto__ || Object.getPrototypeOf(Tween)).call(this, obj));
	
	        _this.options = apply({}, obj || {}, options);
	        _this.loopTimer = null;
	        _this.delayTimer = null;
	        _this.startTime = 0;
	        _this.endTime = 0;
	        _this.looping = false;
	        _this.easingFunc = easingMap[_this.options.easing];
	        return _this;
	    }
	
	    _createClass(Tween, [{
	        key: 'from',
	        value: function from(obj) {
	            this._from = obj;
	            return this;
	        }
	    }, {
	        key: 'to',
	        value: function to(obj) {
	            this._to = obj;
	            return this;
	        }
	    }, {
	        key: 'start',
	        value: function start() {
	            var _this2 = this;
	
	            clearTimeout(this.delayTimer);
	            this.delayTimer = setTimeout(function () {
	                _this2.startTime = new Date().getTime();
	                _this2.endTime = _this2.time + _this2.startTime;
	                if (!_this2.looping) {
	                    _this2.looping = true;
	                    _this2.eventLoop();
	                }
	            }, this.delay);
	            return this;
	        }
	    }, {
	        key: 'stop',
	        value: function stop() {
	            this.looping = false;
	            clearTimeout(this.loopTimer);
	            clearTimeout(this.delayTimer);
	            this.trigger('stop');
	            return this;
	        }
	    }, {
	        key: 'complate',
	        value: function complate() {
	            this.stop();
	            if (this._to) {
	                this.trigger('update', [this._to]);
	                this.from(null);
	                this.to(null);
	                this.trigger('complate');
	            }
	            return this;
	        }
	    }, {
	        key: 'eventLoop',
	        value: function eventLoop() {
	            var _this3 = this;
	
	            var now = new Date().getTime();
	            var posTime = now - this.startTime;
	            var time = this.options.time;
	            if (posTime >= time) {
	                //end animate
	                this.complate();
	                return;
	            }
	            var animObj = {};
	            for (var i in this._from) {
	                var f = this._from[i];
	                var t = this._to[i];
	                animObj[i] = this.easingFunc(posTime, f, t - f, time);
	            }
	            this.trigger('update', [animObj]);
	
	            clearTimeout(this.loopTimer);
	            this.loopTimer = setTimeout(function () {
	                _this3.eventLoop();
	            }, 1000 / this.options.frame);
	        }
	    }]);
	
	    return Tween;
	}(Observe);
	
	module.exports = Tween;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(30);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../../_css-loader@0.23.1@css-loader/index.js!../../_postcss-loader@2.0.8@postcss-loader/lib/index.js!./index.css", function() {
				var newContent = require("!!../../_css-loader@0.23.1@css-loader/index.js!../../_postcss-loader@2.0.8@postcss-loader/lib/index.js!./index.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports
	
	
	// module
	exports.push([module.id, "/**\n * 选择组件\n */\naside.aside {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 1000;\n  background-color: rgba(0, 0, 0, 0.2);\n  font-size: 12px;\n  overflow: hidden;\n}\n.aside-content {\n  width: 6.24rem;\n  height: 100%;\n  margin-left: auto;\n  margin-right: 0;\n  background-color: #FFF;\n  position: relative;\n  -webkit-transform: translate3d(100%, 0, 0);\n          transform: translate3d(100%, 0, 0);\n  -webkit-backface-visibility: hidden;\n          backface-visibility: hidden;\n  transition: -webkit-transform 300ms ease-out 0s;\n  transition: transform 300ms ease-out 0s;\n  transition: transform 300ms ease-out 0s, -webkit-transform 300ms ease-out 0s;\n  -webkit-transform-style: preserve-3d;\n          transform-style: preserve-3d;\n}\n.aside-content.aside-show {\n  -webkit-transform: translate3d(0, 0, 0);\n          transform: translate3d(0, 0, 0);\n}\n.aside-content .aside-icon-close {\n  width: 22px;\n  height: 22px;\n  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAAAVFBMVEUAAAC9vb29vb2+vr69vb2+vr7Kysq8vLy+vr7AwMC+vr68vLy8vLy8vLy8vLy9vb29vb29vb29vb29vb29vb2+vr6+vr69vb2+vr6+vr6+vr68vLxW1qSPAAAAG3RSTlMA9mlOQhUJtI84LPDr5NvMwKmimoJ4cGFWMyE0wI5jAAAAcklEQVQ4y+3SSRZDUAAF0e+LaIIkemr/+7SFcgwMqPGdvReeLi6LB2yL1lvLN7O28bZq+L2trb1da3Jry4+3r4R/8LazNk3otYXC2gryoBtg9nqE6PUEk9cRRq9nGLxeoDil/Y7+If57/tWl12sanm7dDn5YBm2Ny8gRAAAAAElFTkSuQmCC);\n  background-size: cover;\n  display: inline-block;\n  vertical-align: middle;\n}\n.aside-content nav {\n  height: 47px;\n  line-height: 47px;\n  width: 100%;\n  position: absolute;\n  z-index: 1;\n  top: 0;\n  left: 0;\n  background-color: #ECEEF0;\n}\n.aside-content nav:after {\n  content: \" \";\n  position: absolute;\n  left: 0;\n  bottom: 0;\n  width: 100%;\n  height: 1px;\n  border-bottom: 1px solid #DDD;\n  color: #DDD;\n  -webkit-transform-origin: 0 100%;\n  transform-origin: 0 100%;\n  -webkit-transform: scaleY(0.5);\n  transform: scaleY(0.5);\n}\n.aside-content nav p {\n  height: 100%;\n  text-align: center;\n  font-size: 15px;\n  color: #4E5358;\n}\n.aside-content nav .aside-close {\n  position: absolute;\n  left: 0;\n  top: 0;\n  height: 0.94rem;\n  width: 0.94rem;\n}\n.aside-content section {\n  padding-top: 47px;\n  overflow: auto;\n  height: 100%;\n  -webkit-overflow-scrolling: touch;\n}\n.aside-content .aside-key {\n  /*\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-wrap: wrap;\n      flex-wrap: wrap;\n  -ms-flex-line-pack: start;\n      align-content: flex-start;\n  */\n  padding: 0.31rem 0.25rem;\n}\n.aside-content .aside-key li {\n  display: inline-block;\n  width: 0.839rem;\n  height: 0.74rem;\n  margin: 0 0.14rem 0.14rem 0;\n  line-height: 0.74rem;\n  text-align: center;\n  border: 1px solid #DDDEE3;\n  border-radius: 4px;\n  font-size: 12px;\n}\n.aside-content .aside-key li:nth-child(6n) {\n  margin-right: 0;\n}\n.aside-content h3 {\n  display: block;\n  margin: 0;\n  padding: 0;\n  height: 27px;\n  line-height: 27px;\n  padding-left: 12px;\n  background: #eceef0;\n  font-size: 15px;\n  color: #4E5358;\n}\n.aside-content .aside-list li {\n  height: 1rem;\n  line-height: 1rem;\n  font-size: 15px;\n  margin-left: 12px;\n  color: #4e5165;\n  position: relative;\n  white-space:nowrap;\n  overflow:hidden;\n  text-overflow:ellipsis;\n}\n.aside-content .aside-list img{\n  width: 0.6rem;\n  height: 0.6rem;\n  vertical-align: middle;\n}\n.aside-content .aside-list li:after {\n  content: \" \";\n  position: absolute;\n  left: 0;\n  bottom: 0;\n  width: 100%;\n  height: 1px;\n  border-bottom: 1px solid #E4E7E8;\n  color: #E4E7E8;\n  -webkit-transform-origin: 0 100%;\n  transform-origin: 0 100%;\n  -webkit-transform: scaleY(0.5);\n  transform: scaleY(0.5);\n}\n.aside-content .aside-list li:last-child:after {\n  border: none;\n}", ""]);
	
	// exports


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(global) {'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	/**
	 * @author : 宇尘
	 * @created : 2016-07-30
	 * @desc : ajax请求等场景需要用到的全屏loading效果
	 *
	 * 推荐使用方式
	 * const Loading = require('loading/wloading');
	 * Loading.show();
	 * Loading.hide();
	 * 
	 * 兼容老的方式（new的时候就是show的状态）
	 * const loading = new Loading()
	 * loading.show()
	 * loading.hide()
	 */
	;
	(function () {
	    __webpack_require__(32);
	
	    function Loading(options) {
	        this.options = options;
	        this.count = 0;
	        this._init();
	        this._render();
	    }
	
	    Loading.prototype._init = function () {
	        var defaults = {};
	
	        this._config = $.extend({}, defaults, this.options);
	    };
	
	    Loading.prototype._render = function () {
	        var config = this._config;
	        var $loading = $('.ui-loading-fixed');
	
	        if ($loading.length > 0) {
	            $loading.show();
	        } else {
	            $loading = $('<div class="ui-loading-fixed"><span><i></i></span></div>').appendTo('body');
	        }
	        this.count++;
	    };
	
	    Loading.prototype.show = function () {
	        $('.ui-loading-fixed').show();
	        this.count++;
	        return this;
	    };
	
	    Loading.prototype.hide = function () {
	        if (this.count <= 1) {
	            $('.ui-loading-fixed').hide();
	            this.count = 0;
	        } else {
	            this.count--;
	        }
	        return this;
	    };
	
	    Loading.prototype.forceHide = function () {
	        this.count = 1;
	        this.hide();
	    };
	
	    Loading.show = function () {
	        if (!Loading._loading) {
	            Loading._loading = new Loading();
	        } else {
	            Loading._loading.show();
	        }
	    };
	
	    Loading.hide = function () {
	        Loading._loading.hide();
	    };
	
	    if (typeof module !== 'undefined' && ( false ? 'undefined' : _typeof(exports)) === 'object') {
	        module.exports = Loading;
	    } else if (true) {
	        !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	            return Loading;
	        }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else {
	        this.Loading = Loading;
	    }
	}).call(function () {
	    return typeof window !== 'undefined' ? window : global;
	});
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(33);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../../_css-loader@0.23.1@css-loader/index.js!../../_postcss-loader@2.0.8@postcss-loader/lib/index.js!./wloading.css", function() {
				var newContent = require("!!../../_css-loader@0.23.1@css-loader/index.js!../../_postcss-loader@2.0.8@postcss-loader/lib/index.js!./wloading.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports
	
	
	// module
	exports.push([module.id, "/**\n * @author : 宇尘\n * @created : 2015-06-22\n * @version : v1.0\n * @desc : loading\n */\n .ui-loading-fixed {\n    position: fixed;\n    top: 0;\n    left: 0;\n    bottom: 0;\n    right: 0;\n    /*pointer-events: none;*/\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-pack: center;\n        -ms-flex-pack: center;\n            justify-content: center;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    z-index: 1000000;\n    background: rgba(0,0,0,.2);\n }\n .ui-loading-fixed span {\n    background-color: rgba(0,0,0,.4);\n    border-radius: 3px;\n    display: inline-block;\n    padding: 5px 10px;\n    font-size: 0;\n }\n .ui-loading-fixed i {\n    content:'';\n    display:block;\n    -webkit-animation: ui-loading-fixed-rotate 1s linear infinite;\n            animation: ui-loading-fixed-rotate 1s linear infinite;\n    background:url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoxNzk1ODUwQzlEMDhFMzExOTFBMkJBQUFCMkFDODIzRSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo0RjIzMTM3QTMzM0MxMUUzODU3MDg3MTczRUU5MUI2OCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo0RjIzMTM3OTMzM0MxMUUzODU3MDg3MTczRUU5MUI2OCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjFBOTU4NTBDOUQwOEUzMTE5MUEyQkFBQUIyQUM4MjNFIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjE3OTU4NTBDOUQwOEUzMTE5MUEyQkFBQUIyQUM4MjNFIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+SXvjNwAAAvpJREFUeNqsl0toU0EUhm80baJWS7Wttj6qqIuCohhdKaQouBARVCgiCOJSV1KXblUEN+rCB/haCC4UdeFG1LrwLUERFB+oC0vF+G5o1TRp/A/8A9PjzM29sQc+bu4kM//MmXPOTBKVSiWIarlcznxcBPaCZeArOA+OgbJ8mclkqo6VdAxazeaBC6CB721gD2gE+6IOkjAr9gjXg6Jq2w+2On5bAsvBj2qi4pGko3082AE2clVvwRHwxFqxz3sdFE6ALrAQvAG3wag9HecYYCfYZrlyPjjEQcQ+eIRHQB/73QC3wAk+e7kVXuFJXKm2OrCFn0873C92kYF2AKxW32XBwTDh6XbAKWvj8yXYDl7z/Rc4wygX6/b073ZGNe0TGOYKtX20Pt8Da+mhPwwsYxM9whPCVjwILjk6/WauBo7fl1TbTY/wqPakI42OgyGwiQHxChwF7+x0CCkuPWAFaFee3O1zdYJuEtGzpBaT9FvCOOhkTJwDeXuSRngNo1lWWABXwPWgdvvCFAwtmSs5O2OTmccl5mCk2htiU0CzVQVlUgMivMHTYZ0RjmJ6ctxzWcRMqznF94RE9TTPWK3B/1uLp71ZhPs9X/aPgXCdp71ehK/qAk67PAbCw572ouyxbMZhsBnMAJ8p+tB1VscMNBlrlivqTTrlSE0Wcoko8MRq+SeqZQWq41SwiinwDdzlzONamq4ukCDskJAI38WwN2exVKFTnHkUa2XFSjN25HB5oe9jWni9JWpffySnT0a4m0nlW8rya8pwO5/Pwk6nDs+As9V7A7dCT3yOJarP8nSYq4ccKzbtZvWy/wtMWoD7PMECPbiyFI9X54ofeTo95rPLEjUTyVoeKXj6l3l2e119h7eLEb5XmM+9PDLnegbu5PM9bySuo7IU5moRvMbraBP4bs00VSV1Aoo+YDY08b1PXZucwvaVZlC1DXAg1wTy6pr0PNJfmGplkClU5jZk1RbJvj6NW12SMX8v/wp+gsW8NeYpWoxbx/8KMAC97sC/2v4BrgAAAABJRU5ErkJggg==\") no-repeat 50% 50%;\n    background-size:30px;\n    width:30px;\n    height:30px;\n }\n\n @-webkit-keyframes ui-loading-fixed-rotate {\n    from {\n        -webkit-transform:rotate(0)\n    }\n    to {\n        -webkit-transform:rotate(360deg)\n    }\n }\n\n @keyframes ui-loading-fixed-rotate {\n    from {\n        -webkit-transform:rotate(0);\n                transform:rotate(0)\n    }\n    to {\n        -webkit-transform:rotate(360deg);\n                transform:rotate(360deg)\n    }\n }\n", ""]);
	
	// exports


/***/ }),
/* 34 */,
/* 35 */,
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * login
	 * version 3.2
	 */
	var getAppInfo = __webpack_require__(10);
	
	module.exports = function login() {
	    return new Promise(function (resolve, reject) {
	        var bridge = window.bridge;
	        bridge.callHandler('login', {}, function (ret) {
	            getAppInfo().then(function (info) {
	                resolve(info);
	            });
	        });
	    });
	};

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Select = __webpack_require__(27);
	var Fixtip = __webpack_require__(11);
	//const request = require('@util/native-bridge/lib/request');
	
	function isOk(ret) {
	    if (ret.success && ret.data) {
	        return true;
	    }
	    new Fixtip({
	        msg: ret.message || ret.msg || '网络错误'
	    });
	    return false;
	}
	
	var SelectCar = function () {
	    function SelectCar() {
	        _classCallCheck(this, SelectCar);
	
	        this.value = new Array(3);
	        this.selectBrand = new Select({ title: '选择品牌' });
	        this.selectBrand.setRenderMap({
	            name: 'brandName',
	            key: 'alphaCode',
	            icon: 'icon'
	        });
	        this.selectSeries = new Select({ title: '选择车系', stopRenderKey: true });
	        this.selectSeries.setRenderMap({ name: 'seriesName' });
	        this.selectModel = new Select({ title: '选择车型', stopRenderKey: true });
	        this.selectModel.setRenderMap({ name: 'modelName' });
	        this.bindEvent();
	        this.onTapEvent = null;
	    }
	
	    _createClass(SelectCar, [{
	        key: 'setBrandData',
	        value: function setBrandData() {
	            var _this = this;
	
	            return $.ajax({
	                url: '/feopen/illegal/brand',
	                type: 'POST',
	                data: {
	                    pageNumber: 1,
	                    pageSize: 1000
	                }
	            }).then(function (ret) {
	                if (isOk(ret)) {
	                    _this.selectBrand.setData(ret.data);
	                }
	            });
	        }
	    }, {
	        key: 'setSeriesData',
	        value: function setSeriesData(brandId) {
	            var _this2 = this;
	
	            return $.ajax({
	                url: '/feopen/illegal/series',
	                type: 'POST',
	                data: {
	                    pageNumber: 1,
	                    pageSize: 1000,
	                    brandId: brandId
	                }
	            }).then(function (ret) {
	                if (isOk(ret)) {
	                    _this2.selectSeries.setData(ret.data);
	                }
	            });
	        }
	    }, {
	        key: 'setModelData',
	        value: function setModelData(seriesId) {
	            var _this3 = this;
	
	            return $.ajax({
	                url: '/feopen/illegal/model',
	                type: 'POST',
	                data: {
	                    pageNumber: 1,
	                    pageSize: 1000,
	                    seriesId: seriesId
	                }
	            }).then(function (ret) {
	                if (isOk(ret)) {
	                    _this3.selectModel.setData(ret.data);
	                }
	            });
	        }
	    }, {
	        key: 'showModel',
	        value: function showModel() {
	            this.selectModel.show();
	            return this;
	        }
	    }, {
	        key: 'onTap',
	        value: function onTap(fn) {
	            this.onTapEvent = fn;
	            return this;
	        }
	    }, {
	        key: 'show',
	        value: function show() {
	            this.value = new Array(3);
	            this.selectBrand.show();
	            return this;
	        }
	    }, {
	        key: 'hide',
	        value: function hide() {
	            this.selectBrand.hide();
	            this.selectSeries.hide();
	            this.selectModel.hide();
	            this.value = new Array(3);
	            return this;
	        }
	    }, {
	        key: 'destroy',
	        value: function destroy() {
	            this.selectBrand.destroy();
	            this.selectSeries.destroy();
	            this.selectModel.destroy();
	        }
	    }, {
	        key: 'bindEvent',
	        value: function bindEvent() {
	            var _this4 = this;
	
	            this.selectBrand.onTap(function (v) {
	                _this4.value[0] = v;
	                _this4.setSeriesData(v.brandId).then(function () {
	                    _this4.selectSeries.show();
	                });
	            });
	            this.selectSeries.onTap(function (v) {
	                _this4.value[1] = v;
	                _this4.setModelData(v.seriesId).then(function () {
	                    _this4.selectModel.show();
	                });
	            });
	            this.selectModel.onTap(function (v) {
	                _this4.value[2] = v;
	                if (_this4.onTapEvent) {
	                    _this4.onTapEvent.call(_this4, _this4.value);
	                }
	
	                _this4.hide();
	            });
	        }
	    }]);
	
	    return SelectCar;
	}();
	
	var selectCar = void 0;
	module.exports = function () {
	    if (!selectCar) {
	        selectCar = new SelectCar();
	    }
	    return selectCar;
	};

/***/ }),
/* 38 */
/***/ (function(module, exports) {

	'use strict';
	
	/**
	 * callShare
	 * version 3.7.0
	 */
	module.exports = function callShare(opt) {
	    return new Promise(function (resolve, reject) {
	        var bridge = window.bridge;
	        bridge.callHandler('callShare', opt, function (ret) {
	            return resolve(bridge.toJson(ret));
	        });
	    });
	};

/***/ }),
/* 39 */
/***/ (function(module, exports) {

	'use strict';
	
	/**
	 * @description
	 * @author  youmu
	 * @date 16/12/2
	 */
	
	/**
	 * 前端H5页面跳转到app指定的原生页面
	 */
	
	var NativeAppLauncher = function () {
	    var IOS_VERSION_RE = /OS\s+(\d)_/;
	    var timers = [];
	    var userAgent = window.navigator.userAgent;
	    var isAndroid = function isAndroid() {
	        return (/Android/.test(userAgent)
	        );
	    };
	    var isIOS = function isIOS() {
	        return (/(?:i(?:Phone|P(?:o|a)d))/.test(userAgent)
	        );
	    };
	    var iOSVersion = function iOSVersion() {
	        return isIOS() ? parseInt(userAgent.match(IOS_VERSION_RE)[1], 10) : 0;
	    };
	    var isChrome = function isChrome() {
	        return (/Chrome/.test(userAgent) && !/OPR/.test(userAgent)
	        );
	    };
	    var isFirefox = function isFirefox() {
	        return (/Firefox/.test(userAgent)
	        );
	    };
	
	    return {
	        clearTimers: function clearTimers() {
	            console.log("Clearing timers: [" + timers.join(', ') + ']');
	            timers.map(clearTimeout);
	            timers = [];
	        },
	        openApp: function openApp(deeplink, storeURI) {
	            var launcher = this;
	            var storeLaunched = false;
	            var gotStoreURI = "string" == typeof storeURI;
	
	            gotStoreURI && timers.push(window.setTimeout(function () {
	                console.log('Launching App Store: ' + storeURI);
	                storeLaunched = true;
	                window.top.location = storeURI;
	            }, 3000));
	
	            isIOS() && timers.push(window.setTimeout(function () {
	                console.log('Reloading page');
	                storeLaunched && window.location.reload();
	            }, 5000));
	
	            console.log('Launching app: ' + deeplink);
	            window.location = deeplink;
	        },
	        getStoreURI: function getStoreURI() {
	            return "http://dl.ddyc.com?tips=1";
	        },
	        openAppPage: function openAppPage(pageid) {
	            var launcher = this;
	            var events = ["pagehide", "blur"];
	            if (isIOS() || isAndroid() && !isChrome()) {
	                events.push("beforeunload");
	            }
	            console.log("Listening window events: " + events.join(", "));
	
	            window.addEventListener("pagehide", function () {
	                console.log("Window event: " + e.type);
	                launcher.clearTimers();
	            }, false);
	
	            window.addEventListener("blur", function () {
	                console.log("Window event: " + e.type);
	                launcher.clearTimers();
	            }, false);
	
	            // $(window).on(events.join(" "), function(e) {
	            //     console.log("Window event: " + e.type);
	            //     launcher.clearTimers();
	            // });
	
	            launcher.openApp.call(launcher, pageid, launcher.getStoreURI());
	        },
	        init: function init(pageid) {
	            var me = this;
	            if (pageid) {
	                pageid = decodeURIComponent(pageid);
	                if (pageid.indexOf("ddyc.car://") != -1 || pageid.indexOf("ddyc://") != -1) {
	                    if (pageid.indexOf("url=") != -1) {
	                        var urls = pageid.split('url=');
	                        if (urls.length > 1) {
	                            pageid = urls[0] + 'url=' + encodeURIComponent(urls[1]);
	                        }
	                    }
	                    me.openAppPage(pageid);
	                    window.location.href = pageid;
	                }
	            }
	        }
	    };
	}();
	
	module.exports = NativeAppLauncher;

/***/ }),
/* 40 */
/***/ (function(module, exports) {

	'use strict';
	
	;(function ($) {
	
	    var w = window,
	        $window = $(w),
	        defaultOptions = {
	        threshold: 0,
	        failure_limit: 0,
	        event: 'scroll',
	        effect: 'show',
	        effect_params: null,
	        container: w,
	        data_attribute: 'original',
	        data_srcset_attribute: 'original-srcset',
	        skip_invisible: true,
	        appear: emptyFn,
	        load: emptyFn,
	        vertical_only: false,
	        check_appear_throttle_time: 300,
	        url_rewriter_fn: emptyFn,
	        no_fake_img_loader: false,
	        placeholder_data_img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC',
	        // for IE6\7 that does not support data image
	        placeholder_real_img: 'http://ditu.baidu.cn/yyfm/lazyload/0.0.1/img/placeholder.png'
	        // todo : 将某些属性用global来配置，而不是每次在$(selector).lazyload({})内配置
	    },
	        type; // function
	
	    function emptyFn() {}
	
	    type = function () {
	        var object_prototype_toString = Object.prototype.toString;
	        return function (obj) {
	            // todo: compare the speeds of replace string twice or replace a regExp
	            return object_prototype_toString.call(obj).replace('[object ', '').replace(']', '');
	        };
	    }();
	
	    function belowthefold($element, options) {
	        var fold;
	        if (options._$container == $window) {
	            fold = ('innerHeight' in w ? w.innerHeight : $window.height()) + $window.scrollTop();
	        } else {
	            fold = options._$container.offset().top + options._$container.height();
	        }
	        return fold <= $element.offset().top - options.threshold;
	    }
	
	    function rightoffold($element, options) {
	        var fold;
	        if (options._$container == $window) {
	            // Zepto do not support `$window.scrollLeft()` yet.
	            fold = $window.width() + ($.fn.scrollLeft ? $window.scrollLeft() : w.pageXOffset);
	        } else {
	            fold = options._$container.offset().left + options._$container.width();
	        }
	        return fold <= $element.offset().left - options.threshold;
	    }
	
	    function abovethetop($element, options) {
	        var fold;
	        if (options._$container == $window) {
	            fold = $window.scrollTop();
	        } else {
	            fold = options._$container.offset().top;
	        }
	        // console.log('abovethetop fold '+ fold)
	        // console.log('abovethetop $element.height() '+ $element.height())
	        return fold >= $element.offset().top + options.threshold + $element.height();
	    }
	
	    function leftofbegin($element, options) {
	        var fold;
	        if (options._$container == $window) {
	            // Zepto do not support `$window.scrollLeft()` yet.
	            fold = $.fn.scrollLeft ? $window.scrollLeft() : w.pageXOffset;
	        } else {
	            fold = options._$container.offset().left;
	        }
	        return fold >= $element.offset().left + options.threshold + $element.width();
	    }
	
	    function checkAppear($elements, options) {
	        var counter = 0;
	        $elements.each(function (i, e) {
	            var $element = $elements.eq(i);
	            if ($element.width() <= 0 && $element.height() <= 0 || $element.css('display') === 'none') {
	                return;
	            }
	            function appear() {
	                $element.trigger('_lazyload_appear');
	                // if we found an image we'll load, reset the counter 
	                counter = 0;
	            }
	            // If vertical_only is set to true, only check the vertical to decide appear or not
	            // In most situations, page can only scroll vertically, set vertical_only to true will improve performance
	            if (options.vertical_only) {
	                if (abovethetop($element, options)) {
	                    // Nothing. 
	                } else if (!belowthefold($element, options)) {
	                    appear();
	                } else {
	                    if (++counter > options.failure_limit) {
	                        return false;
	                    }
	                }
	            } else {
	                if (abovethetop($element, options) || leftofbegin($element, options)) {
	                    // Nothing. 
	                } else if (!belowthefold($element, options) && !rightoffold($element, options)) {
	                    appear();
	                } else {
	                    if (++counter > options.failure_limit) {
	                        return false;
	                    }
	                }
	            }
	        });
	    }
	
	    // Remove image from array so it is not looped next time. 
	    function getUnloadElements($elements) {
	        return $elements.filter(function (i, e) {
	            return !$elements.eq(i)._lazyload_loadStarted;
	        });
	    }
	
	    // throttle : https://github.com/component/throttle , MIT License
	    function throttle(func, wait) {
	        var ctx, args, rtn, timeoutID; // caching
	        var last = 0;
	
	        return function throttled() {
	            ctx = this;
	            args = arguments;
	            var delta = new Date() - last;
	            if (!timeoutID) if (delta >= wait) call();else timeoutID = setTimeout(call, wait - delta);
	            return rtn;
	        };
	
	        function call() {
	            timeoutID = 0;
	            last = +new Date();
	            rtn = func.apply(ctx, args);
	            ctx = null;
	            args = null;
	        }
	    }
	
	    if (!$.fn.hasOwnProperty('lazyload')) {
	
	        $.fn.lazyload = function (options) {
	            var $elements = this,
	                isScrollEvent,
	                isScrollTypeEvent,
	                throttleCheckAppear;
	
	            if (!$.isPlainObject(options)) {
	                options = {};
	            }
	
	            $.each(defaultOptions, function (k, v) {
	                if ($.inArray(k, ['threshold', 'failure_limit', 'check_appear_throttle_time']) != -1) {
	                    // these params can be a string
	                    if (type(options[k]) == 'String') {
	                        options[k] = parseInt(options[k], 10);
	                    } else {
	                        options[k] = v;
	                    }
	                } else if (k == 'container') {
	                    // options.container can be a seletor string \ dom \ jQuery object
	                    if (options.hasOwnProperty(k)) {
	                        if (options[k] == w || options[k] == document) {
	                            options._$container = $window;
	                        } else {
	                            options._$container = $(options[k]);
	                        }
	                    } else {
	                        options._$container = $window;
	                    }
	                    delete options.container;
	                } else if (defaultOptions.hasOwnProperty(k) && (!options.hasOwnProperty(k) || type(options[k]) != type(defaultOptions[k]))) {
	                    options[k] = v;
	                }
	            });
	
	            isScrollEvent = options.event == 'scroll';
	            throttleCheckAppear = options.check_appear_throttle_time == 0 ? checkAppear : throttle(checkAppear, options.check_appear_throttle_time);
	
	            // isScrollTypeEvent cantains custom scrollEvent . Such as 'scrollstart' & 'scrollstop'
	            // https://github.com/search?utf8=%E2%9C%93&q=scrollstart
	            isScrollTypeEvent = isScrollEvent || options.event == 'scrollstart' || options.event == 'scrollstop';
	
	            $elements.each(function (i, e) {
	                var element = this,
	                    $element = $elements.eq(i),
	                    placeholderSrc = $element.attr('src'),
	                    originalSrcInAttr = $element.attr('data-' + options.data_attribute),
	                    // `data-original` attribute value
	                originalSrc = options.url_rewriter_fn == emptyFn ? originalSrcInAttr : options.url_rewriter_fn.call(element, $element, originalSrcInAttr),
	                    originalSrcset = $element.attr('data-' + options.data_srcset_attribute),
	                    isImg = $element.is('img');
	
	                if ($element._lazyload_loadStarted == true || placeholderSrc == originalSrc) {
	                    $element._lazyload_loadStarted = true;
	                    $elements = getUnloadElements($elements);
	                    return;
	                }
	
	                $element._lazyload_loadStarted = false;
	
	                // If element is an img and no src attribute given, use placeholder. 
	                if (isImg && !placeholderSrc) {
	                    // For browsers that do not support data image.
	                    $element.one('error', function () {
	                        // `on` -> `one` : IE6 triggered twice error event sometimes
	                        $element.attr('src', options.placeholder_real_img);
	                    }).attr('src', options.placeholder_data_img);
	                }
	
	                // When appear is triggered load original image. 
	                $element.one('_lazyload_appear', function () {
	                    var effectParamsIsArray = $.isArray(options.effect_params),
	                        effectIsNotImmediacyShow;
	                    function loadFunc() {
	                        // In most situations, the effect is immediacy show, at this time there is no need to hide element first
	                        // Hide this element may cause css reflow, call it as less as possible
	                        if (effectIsNotImmediacyShow) {
	                            // todo: opacity:0 for fadeIn effect
	                            $element.hide();
	                        }
	                        if (isImg) {
	                            // attr srcset first
	                            if (originalSrcset) {
	                                $element.attr('srcset', originalSrcset);
	                            }
	                            if (originalSrc) {
	                                $element.attr('src', originalSrc);
	                            }
	                        } else {
	                            $element.css('background-image', 'url("' + originalSrc + '")');
	                        }
	                        if (effectIsNotImmediacyShow) {
	                            $element[options.effect].apply($element, effectParamsIsArray ? options.effect_params : []);
	                        }
	                        $elements = getUnloadElements($elements);
	                    }
	                    if (!$element._lazyload_loadStarted) {
	                        effectIsNotImmediacyShow = options.effect != 'show' && $.fn[options.effect] && (!options.effect_params || effectParamsIsArray && options.effect_params.length == 0);
	                        if (options.appear != emptyFn) {
	                            options.appear.call(element, $element, $elements.length, options);
	                        }
	                        $element._lazyload_loadStarted = true;
	                        if (options.no_fake_img_loader || originalSrcset) {
	                            if (options.load != emptyFn) {
	                                $element.one('load', function () {
	                                    options.load.call(element, $element, $elements.length, options);
	                                });
	                            }
	                            loadFunc();
	                        } else {
	                            $('<img />').one('load', function () {
	                                // `on` -> `one` : IE6 triggered twice load event sometimes
	                                loadFunc();
	                                if (options.load != emptyFn) {
	                                    options.load.call(element, $element, $elements.length, options);
	                                }
	                            }).attr('src', originalSrc);
	                        }
	                    }
	                });
	
	                // When wanted event is triggered load original image 
	                // by triggering appear.                              
	                if (!isScrollTypeEvent) {
	                    $element.on(options.event, function () {
	                        if (!$element._lazyload_loadStarted) {
	                            $element.trigger('_lazyload_appear');
	                        }
	                    });
	                }
	            });
	
	            // Fire one scroll event per scroll. Not one scroll event per image. 
	            if (isScrollTypeEvent) {
	                options._$container.on(options.event, function () {
	                    throttleCheckAppear($elements, options);
	                });
	            }
	
	            // Check if something appears when window is resized. 
	            // Force initial check if images should appear when window is onload. 
	            $window.on('resize load', function () {
	                throttleCheckAppear($elements, options);
	            });
	
	            // Force initial check if images should appear. 
	            $(function () {
	                throttleCheckAppear($elements, options);
	            });
	
	            return this;
	        };
	    }
	})(window.Zepto || window.jQuery);

/***/ })
/******/ ]);
//# sourceMappingURL=index.js.map
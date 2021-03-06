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
	
	var modal = __webpack_require__(1);
	var Fixtip = __webpack_require__(11);
	var stringUtil = __webpack_require__(21);
	var ready = __webpack_require__(6);
	var isLogin = __webpack_require__(20);
	var payment = __webpack_require__(34);
	var getCommon = __webpack_require__(15);
	var locationData = __webpack_require__(35);
	var norepeat = __webpack_require__(25);
	var loading = __webpack_require__(31);
	
	var bookingInfo = stringUtil.queryString.parse(window.location.search.substring(1));
	var urlParse = location.search;
	var commodityCode = bookingInfo['commodity_code'];
	var look = bookingInfo['look'];
	var userId = "";
	var lat = void 0;
	var lng = void 0;
	var formMgr = void 0;
	
	$(function () {
	
	    loading.show();
	
	    // 分享
	    function share() {
	        if (CONF.iswechat) {
	            var common = getCommon();
	            common.share();
	        }
	    }
	    share();
	
	    // 大写金额
	    function AmountLtoU(num) {
	        ///<summery>小写金额转化大写金额</summery>
	        ///<param name=num type=number>金额</param>
	        if (isNaN(num)) return "";
	        var strPrefix = "";
	        if (num < 0) strPrefix = "(负)";
	        num = Math.abs(num);
	        if (num >= 1000000000000) return "无效数值！";
	        var strOutput = "";
	        var strUnit = '仟佰拾亿仟佰拾万仟佰拾元角分';
	        var strCapDgt = '零壹贰叁肆伍陆柒捌玖';
	        num += "00";
	        var intPos = num.indexOf('.');
	        if (intPos >= 0) {
	            num = num.substring(0, intPos) + num.substr(intPos + 1, 2);
	        }
	        strUnit = strUnit.substr(strUnit.length - num.length);
	        for (var i = 0; i < num.length; i++) {
	            strOutput += strCapDgt.substr(num.substr(i, 1), 1) + strUnit.substr(i, 1);
	        }
	        return strPrefix + strOutput.replace(/零角零分$/, '整').replace(/零[仟佰拾]/g, '零').replace(/零{2,}/g, '零').replace(/零([亿|万])/g, '$1').replace(/零+元/, '元').replace(/亿零{0,3}万/, '亿').replace(/^元/, "零元");
	    };
	
	    $.ajax({
	        url: "/nactive/newcar/item",
	        type: "GET",
	        data: { goodsCode: commodityCode }
	    }).then(function (ret) {
	        loading.hide();
	        if (ret.success) {
	            var price = ret.data.ddPrice;
	            $('#conPrice').text(price);
	            $('#bigPrice').text(AmountLtoU(price));
	        } else {
	            new Fixtip({ msg: ret.message });
	        }
	    }, function () {
	        new Fixtip({ msg: '网络错误' });
	    });
	
	    if (look == 'look') {
	        $("#barBox").hide();
	    }
	
	    $('#checkWrap').on('tap', function (e) {
	        if ($("#check").hasClass('check-icon')) {
	            $("#check").removeClass('check-icon');
	            $(".bar-btn").addClass("bar-btn-no");
	        } else {
	            $("#check").addClass('check-icon');
	            $(".bar-btn").removeClass("bar-btn-no");
	        }
	        e.preventDefault();
	        e.stopPropagation();
	    });
	
	    function bindEvent() {
	        norepeat.auto("#payBtn").on("tap", function () {
	            if ($("#check").hasClass('check-icon')) {
	                loading.show();
	                $.ajax({
	                    url: "/nactive/newcar/prepay",
	                    type: "POST",
	                    data: {
	                        userId: formMgr.uuid,
	                        lat: formMgr.lat,
	                        lng: formMgr.lng,
	                        goodsCode: commodityCode
	                    }
	                }).then(function (ret) {
	                    loading.hide();
	                    if (ret.success) {
	                        new modal.Modal({
	                            title: '',
	                            msg: '请在10分钟内完成付款，否则订单将会被取消',
	                            inputType: '',
	                            btns: [{
	                                text: '我知道了',
	                                onTap: function onTap(value) {
	                                    if (window.CONF.isapp) {
	                                        // app 支付
	                                        payment({
	                                            "orderId": ret.data.orderId // 订单ID
	                                        });
	                                    } else {
	                                        // 微信支付
	                                        window.location.href = ret.data.uri;
	                                    }
	                                }
	                            }]
	                        });
	                    } else {
	                        if (ret.code == 40060 || ret.code == 40070) {
	                            new modal.Modal({
	                                title: '',
	                                msg: ret.message,
	                                inputType: '',
	                                btns: [{
	                                    text: '我知道了',
	                                    onTap: function onTap(value) {
	                                        window.location.href = '/nactive/newcar/index';
	                                    }
	                                }]
	                            });
	                        } else {
	                            new Fixtip({ msg: ret.message });
	                        }
	                    }
	                }, function () {
	                    new Fixtip({ msg: '网络错误' });
	                });
	            } else {
	                new Fixtip({ msg: '请先同意合同条款' });
	            }
	        });
	    }
	
	    if (CONF.isapp) {
	        ready(function (info) {
	            formMgr = {
	                uuid: info.userId,
	                lat: info.lat,
	                lng: info.lng,
	                phone: info.phone
	            };
	            bindEvent();
	        });
	    } else {
	        locationData(function (res) {
	            res = res || { lat: '', lng: '' };
	            formMgr = {
	                uuid: '',
	                lat: res.lat,
	                lng: res.lng,
	                phone: ''
	            };
	            bindEvent();
	        });
	    }
	});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	exports.alert = alert;
	exports.confirm = confirm;
	exports.prompt = prompt;
	exports.promptPhone = promptPhone;
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	__webpack_require__(2);
	/**
	 * @example:
	 * new Base({
	 *  cls:'',//全局modal样式
	 *  title : '标题',
	 *  msg   : '消息',
	 *  inputType : 'text',
	 *  btns : [{
	 *    text : '取消' ,
	 *    cls:''//btn样式
	 *  },{
	 *    text : '确定',
	 *    cls:'',//btn样式
	 *    onTap : (value) => {} // 返回false时，点击按钮不会隐藏对话框
	 *  }]
	 * })
	 */
	
	var Modal = exports.Modal = function () {
	    function Modal(o) {
	        _classCallCheck(this, Modal);
	
	        this.options = o;
	        var template = this.createTemplate(this.options);
	        this.$modal = $(template).appendTo(document.body);
	        this.$box = this.$modal.find('.modal-box');
	        if (this.options.inputType) {
	            this.$input = this.$modal.find('.modal-input');
	        }
	        this.$btns = this.$modal.find('.modal-btn');
	        this.bindEvent();
	        this.show();
	    }
	
	    _createClass(Modal, [{
	        key: 'createTemplate',
	        value: function createTemplate(opts) {
	            // 生成字符串模板
	            var headerStr = opts.title ? '<div class="modal-header">' + opts.title + '</div>' : '';
	            var inputStr = opts.inputType ? '<input type="' + opts.inputType + '" class="modal-input">' : '';
	
	            var btnStr = '';
	            opts.btns.forEach(function (item) {
	                btnStr += '<span class="modal-btn ' + (item.cls || '') + '">' + item.text + '</span>';
	            });
	
	            return '<div class="modal-bg modal-hide ' + (opts.cls || '') + '">\n            <div class="modal-box modal-null">\n                ' + headerStr + '\n                <div class="modal-middle">\n                    <span>' + opts.msg + '</span>\n                    ' + inputStr + '\n                </div>\n                <div class="modal-footer">\n                    ' + btnStr + '\n                </div>\n            </div>\n        </div>';
	        }
	    }, {
	        key: 'getInputValue',
	        value: function getInputValue() {
	            if (this.$input) {
	                return this.$input.val().trim();
	            }
	            return '';
	        }
	    }, {
	        key: 'getTapEvent',
	        value: function getTapEvent(text) {
	            var fn = null;
	            this.options.btns.forEach(function (item) {
	                if (item.text == text) {
	                    fn = item.onTap;
	                }
	            });
	            return fn;
	        }
	    }, {
	        key: 'bindEvent',
	        value: function bindEvent() {
	            // 绑定按钮事件
	            var me = this;
	            this.$btns.on('touchend', function (e) {
	                e.preventDefault();
	                var that = $(this);
	                var onTap = me.getTapEvent(that.html());
	                var inputValue = me.getInputValue();
	                if (onTap && onTap(inputValue) === false) {
	                    return;
	                }
	                if (me.$input) {
	                    me.$input.blur();
	                }
	                me.destroy();
	            });
	            return this;
	        }
	    }, {
	        key: 'show',
	        value: function show() {
	            var _this = this;
	
	            this.$modal.removeClass('modal-hide');
	            setTimeout(function () {
	                _this.$box.removeClass('modal-null');
	            }, 10);
	            return this;
	        }
	    }, {
	        key: 'hide',
	        value: function hide(fn) {
	            var _this2 = this;
	
	            // 通过延迟隐藏，处理击穿Bug
	            this.$box.addClass('modal-null');
	            setTimeout(function () {
	                _this2.$modal.addClass('modal-hide');
	                if (fn) {
	                    fn();
	                }
	            }, 300);
	            return this;
	        }
	    }, {
	        key: 'destroy',
	        value: function destroy() {
	            var _this3 = this;
	
	            this.hide(function () {
	                _this3.$modal.remove();
	            });
	            return this;
	        }
	    }]);
	
	    return Modal;
	}();
	/**
	 * 对话框
	 * @example
	 * modal.alert('msg', function(){  });
	 */
	
	
	function alert(str, fn) {
	    var btn = { text: '确定' };
	    if (fn) {
	        btn.onTap = fn;
	    }
	    return new Modal({
	        msg: str,
	        btns: [btn]
	    });
	}
	/**
	 * 确认框
	 * @example
	 * modal.confirm({
	 *  msg : 'msg',
	 *  ok : () => {}
	 * })
	 */
	function confirm(o) {
	    return new Modal({
	        title: o.title,
	        msg: o.msg,
	        btns: [{
	            text: '取消'
	        }, {
	            text: '确定',
	            onTap: o.ok
	        }]
	    });
	}
	/**
	 * 输入框
	 * @example
	 * modal.prompt({
	 *  msg : 'msg',
	 *  inputType : 'text',
	 *  ok : () => {}
	 * })
	 */
	function prompt(o) {
	    return new Modal({
	        title: o.title,
	        msg: o.msg,
	        inputType: o.inputType || 'text',
	        btns: [{
	            text: '取消'
	        }, {
	            text: '确定',
	            onTap: o.ok
	        }]
	    });
	}
	/**
	 * 手机号输入验证组件
	 * @example
	 * modal.promptPhone({
	 *  title : 'title',
	 *   msg : 'msg',
	 *   ok : (value) => { alert(value); },
	 *   error : () => { alert('请输入正确的手机号码'); }
	 * });
	 */
	function promptPhone(o) {
	    var modal = new Modal({
	        title: o.title,
	        msg: o.msg,
	        inputType: 'tel',
	        btns: [{
	            text: o.cancalText || '取消'
	        }, {
	            text: o.okText || '确定',
	            onTap: function onTap(value) {
	                if (!/^1\d{10}$/.test(value)) {
	                    modal.$input.addClass('error');
	                    if (o.error) {
	                        o.error();
	                    }
	                    return false;
	                }
	                modal.$input.removeClass('error');
	                return o.ok(value);
	            }
	        }]
	    });
	}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(3);
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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports
	
	
	// module
	exports.push([module.id, ".modal-hide {\n  display: none !important;\n}\n.modal-bg {\n  position: fixed;\n  left: 0;\n  top: 0;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  width: 100%;\n  height: 100%;\n  background-color: rgba(0, 0, 0, 0.8);\n  z-index: 100;\n}\n.modal-bg .modal-box {\n  background-color: #F8F8F8;\n  width: 270px;\n  height: auto;\n  -webkit-transform: scale(1);\n          transform: scale(1);\n  opacity: 1;\n  transition: all 0.3s;\n}\n.modal-bg .modal-null {\n  -webkit-transform: scale(0);\n          transform: scale(0);\n  opacity: 0;\n}\n.modal-bg .modal-header {\n  font-size: 16px;\n  font-weight: 500;\n  text-align: center;\n  padding: 10px 8px 0;\n}\n.modal-bg .modal-middle {\n  font-size: 14px;\n  padding: 10px 8px;\n  line-height: 1.6;\n  word-wrap: break-word;\n  text-align: center;\n}\n.modal-bg .modal-input {\n  box-sizing: border-box;\n  border: 1px solid #dedede;\n  border-radius: 0;\n  display: block;\n  font-size: 14px;\n  color: #222;\n  line-height: 18px;\n  padding: 5px;\n  width: 100%;\n  -webkit-appearance: none;\n  -webkit-tap-highlight-color: transparent;\n}\n.modal-bg .modal-input.error {\n  border: 1px solid red;\n}\n.modal-bg .modal-input:focus {\n  border-color: #D6D6D6;\n  outline: none;\n}\n.modal-bg .modal-footer {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  border-top: 1px solid #DEDEDE;\n}\n.modal-bg .modal-btn {\n  -webkit-box-flex: 1;\n      -ms-flex: 1 1 0;\n          flex: 1 1 0;\n  display: block;\n  color: #0e90d2;\n  box-sizing: border-box;\n  border-left: 1px solid #DEDEDE;\n  cursor: pointer;\n  font-size: 14px;\n  height: 33px;\n  line-height: 33px;\n  overflow: hidden;\n  padding: 0 5px;\n  text-align: center;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  word-wrap: normal;\n}\n.modal-bg .modal-btn:first-child {\n  border-left: none;\n}\n.modal-bg .modal-btn:active {\n  background-color: #d4d4d4;\n}\n", ""]);
	
	// exports


/***/ }),
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

	var require;var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(process, global) {'use strict';
	
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
/* 14 */,
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
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
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
/* 34 */
/***/ (function(module, exports) {

	'use strict';
	
	/**
	 * 付款接口
	 */
	module.exports = function payment(opt) {
	  bridge.callHandler('payment', opt);
	};

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var nativeReady = __webpack_require__(6);
	var common = __webpack_require__(15)();
	var config = window.CONF;
	window.APPINFO = {};
	
	/**
	 * 处理地理位置
	 */
	var getLocation = function getLocation(fn) {
	    // fn({
	    //     lat: 30.288973,
	    //     lng: 120.089225
	    // });
	    if (config.isapp) {
	        //app获取经纬度
	        nativeReady(function (ret) {
	            window.APPINFO = ret;
	            if (ret.lat && ret.lng) {
	                fn({ lat: ret.lat, lng: ret.lng });
	            } else {
	                fn();
	            }
	        });
	    } else if (common.isWechat()) {
	        //微信获取经纬度
	        var flag = false,
	            timer = void 0;
	        common.getLocation(function (lat, lng) {
	            flag = true;
	            if (timer) {
	                window.clearTimeout(timer);
	            }
	            fn({ lat: lat, lng: lng });
	        });
	        timer = window.setTimeout(function () {
	            if (!flag) {
	                fn();
	            }
	        }, 3000);
	    } else {
	        var success = function success(pos) {
	            var crd = pos.coords;
	            fn({ lat: crd.latitude, lng: crd.longitude });
	        };
	
	        var error = function error(err) {
	            console.warn('ERROR(' + err.code + '): ' + err.message);
	            fn({ lat: '', lng: '' });
	        };
	
	        //第三方获取经纬度
	        var options = {
	            enableHighAccuracy: true,
	            timeout: 3000,
	            maximumAge: 0
	        };
	
	        ;
	
	        ;
	        navigator.geolocation.getCurrentPosition(success, error, options);
	    }
	};
	
	module.exports = getLocation;

/***/ })
/******/ ]);
//# sourceMappingURL=contract.js.map
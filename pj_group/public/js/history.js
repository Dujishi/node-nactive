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
/******/ 	__webpack_require__.p = "pj_group/public/js";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var Loading = __webpack_require__(22);
	var Fixtip = __webpack_require__(27);
	var Common = __webpack_require__(1);
	
	template.helper('imgSize', function (url) {
	    return url.split('!')[0] + '!/both/700x280/force/true';
	});
	
	template.helper('dateFormat', function (date) {
	    date = new Date(date);
	    var toTen = function toTen(n) {
	        return n >= 10 ? n : '0' + n;
	    };
	    var map = {
	        Y: date.getFullYear(),
	        M: date.getMonth() + 1,
	        d: date.getDate(),
	        h: date.getHours(),
	        m: date.getMinutes(),
	        s: date.getSeconds()
	    };
	    return toTen(map.Y) + '.' + toTen(map.M) + '.' + toTen(map.d) + ' ' + toTen(map.h) + ':' + toTen(map.m) + ':' + toTen(map.s);
	});
	
	var getUserGroup = function getUserGroup() {
	    Loading.show();
	    $.post('/nactive/group/getTuanInfos', { status: 2 }, function (res) {
	        Loading.hide();
	        if (res.success) {
	            if (res.data && res.data.length > 0) {
	                var html = template('group-item-tpl', res.data);
	                $('#groupWrap').append(html).show();
	            } else {
	                $('.no-data').show();
	            }
	        } else {
	            new Fixtip({ msg: res.message || res.msg });
	            if (res.code == -200) {
	                window.location.href = window.location.origin + '/feopen/login/index?url=' + window.location.href;
	            }
	        }
	    });
	};
	
	$(function () {
	    var common = Common.create();
	    var analytics = Common.analytics;
	    common.share(function () {});
	    getUserGroup();
	});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.analytics = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	exports.create = create;
	
	var _queryString = __webpack_require__(2);
	
	var queryString = _interopRequireWildcard(_queryString);
	
	var _getlocation = __webpack_require__(5);
	
	var _analytics = __webpack_require__(15);
	
	var _analytics2 = _interopRequireDefault(_analytics);
	
	var _util = __webpack_require__(18);
	
	var util = _interopRequireWildcard(_util);
	
	var _performance = __webpack_require__(20);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function addVds(activeName, pageGroup) {
	    window._vds = window._vds || [];
	    var _vds = window._vds;
	    _vds.push(['setAccountId', 'e2f213a5f5164248817464925de8c1af']);
	    var queryOpt = queryString.parse(window.location.search);
	    var trackId = queryOpt.trackId;
	    if (trackId) {
	        _vds.push(['setPageGroup', pageGroup || 'activityPage']); // 必须  比如活动页面 activityPage ；养车H5页面 ddycAppH5Page 等
	        _vds.push(['setPS1', activeName]);
	        _vds.push(['setPS2', trackId]); // trackId 原来id
	    }
	    setTimeout(function () {
	        var vds = document.createElement('script');
	        vds.type = 'text/javascript';
	        vds.async = true;
	        vds.src = (document.location.protocol == 'https:' ? 'https://' : 'http://') + 'dn-growing.qbox.me/vds.js';
	        var s = document.getElementsByTagName('script')[0];
	        s.parentNode.insertBefore(vds, s);
	    }, 0);
	}
	
	var locationFlag = false;
	
	var Common = function () {
	    function Common(opt) {
	        _classCallCheck(this, Common);
	
	        this.options = opt;
	        this.clientType = 'other';
	        var wx = window.wx || null;
	        if (opt.iswechat && wx) {
	            this.clientType = 'wechat';
	            var apiList = opt.jsApiList || [];
	            var api = apiList.concat(['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'getLocation']);
	            wx.config({
	                debug: opt.debug || false,
	                appId: opt.appId,
	                timestamp: opt.timestamp,
	                nonceStr: opt.nonceStr,
	                signature: opt.signature,
	                jsApiList: api
	            });
	        } else if (opt.isapp) {
	            this.clientType = 'app';
	        }
	    }
	
	    _createClass(Common, [{
	        key: 'share',
	        value: function share(fn) {
	            var ext = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	
	            var opt = util.extend(this.options, ext);
	            if (this.clientType === 'wechat') {
	                util.onShareWechat(opt, fn);
	            }
	            if (this.clientType === 'app') {
	                util.onShareApp(opt, fn);
	            }
	        }
	    }, {
	        key: 'getLocation',
	        value: function getLocation() {
	            locationFlag = true;
	            return (0, _getlocation.getLocation)(this.clientType);
	        }
	    }]);
	
	    return Common;
	}();
	
	var common = void 0;
	/**
	 *
	 * @param opt {Object}
	 * @param opt.activeName {String}
	 * @param opt.pageGroup {String}
	 * @param opt.iswechat {Boolean} default false
	 * @param opt.isapp {Boolean} default false
	 * @param opt.notLocation {Boolean}  default false
	 * @param opt.historyMode {Boolean}  default hash (hash, h5)
	 */
	function onCommonCreate(opt) {
	    addVds(opt.activeName, opt.pageGroup); // 添加growio统计
	    if (opt.iswechat) {
	        _analytics2.default.set('source', 'wechat');
	    }
	    if (opt.isapp) {
	        _analytics2.default.set('source', 'app');
	    }
	    _analytics2.default.set('userId', util.getToken());
	    _analytics2.default.set('key', 'domReady');
	    _analytics2.default.send();
	    if (!opt.notLocation) {
	        var sendLocation = function sendLocation() {
	            (0, _getlocation.getLocation)(common.clientType).then(function (info) {
	                var lat = info.latitude;
	                var lng = info.longitude;
	                _analytics2.default.set('lat', lat).set('lng', lng);
	                _analytics2.default.set('key', 'getLocationReady');
	                _analytics2.default.send();
	                (0, _performance.uploadData)(lat, lng);
	            }, function (info) {
	                _analytics2.default.set('key', 'getLocationError');
	                _analytics2.default.send();
	                (0, _performance.uploadData)();
	            });
	        };
	
	        setTimeout(function () {
	            if (!locationFlag) {
	                sendLocation();
	            } else {
	                window.setTimeout(function () {
	                    sendLocation();
	                }, 10 * 1000);
	            }
	        }, 1000);
	    } else {
	        (0, _performance.uploadData)();
	    }
	    locationEvent(opt.historyMode);
	}
	
	function locationEvent() {
	    var mode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'hash';
	
	    if (mode === 'hash') {
	        window.addEventListener('hashchange', locationChange, false);
	    } else {
	        window.addEventListener('popstate', locationChange, false);
	    }
	    //
	}
	
	function locationChange(e) {
	    var doc = document;
	    _analytics2.default.setObj({
	        userId: util.getToken(),
	        domain: doc.domain,
	        url: e.newURL || doc.location.href,
	        title: doc.title,
	        referrer: e.oldURL || doc.referrer || '',
	        key: 'popstate'
	    }).send();
	}
	function create(opt) {
	    if (!common) {
	        var options = opt || window.CONF;
	        common = new Common(options);
	        onCommonCreate(options);
	    }
	    return common;
	}
	exports.analytics = _analytics2.default;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var strictUriEncode = __webpack_require__(3);
	var objectAssign = __webpack_require__(4);
	
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
/* 3 */
/***/ (function(module, exports) {

	'use strict';
	
	module.exports = function (str) {
		return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
			return '%' + c.charCodeAt(0).toString(16).toUpperCase();
		});
	};

/***/ }),
/* 4 */
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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.getLocation = getLocation;
	
	var _app = __webpack_require__(6);
	
	var _h = __webpack_require__(12);
	
	var _weixin = __webpack_require__(13);
	
	var _amap = __webpack_require__(14);
	
	/**
	 * 获取地理位置
	 * @param isApp
	 * @param isWechat
	 * @author  yinshi
	 * @date 16/11/21.
	 * @return {Promise}
	 */
	function getLocation(type) {
	    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	
	    return new Promise(function (resolve, reject) {
	        switch (type) {
	            case 'app':
	                (0, _app.app)(resolve);
	                break;
	            case 'wechat':
	                (0, _weixin.weixin)(resolve, reject, options);
	                break;
	            default:
	                if (window.AMap && window.AMap.Map) {
	                    (0, _amap.amap)(resolve, reject, options);
	                } else {
	                    (0, _h.h5)(resolve, reject, options);
	                }
	
	        }
	    });
	}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.app = app;
	/**
	 * @description
	 * @author  yinshi
	 * @date 16/12/14.
	 */
	var nativeBridgeReady = __webpack_require__(7);
	function app(success) {
	    nativeBridgeReady(function (info) {
	        success({
	            latitude: info.lat,
	            longitude: info.lng,
	            userId: info.userId
	        });
	    });
	}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(8);
	var getAppInfo = __webpack_require__(11);
	
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
/* 8 */
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
	      var vertx = __webpack_require__(10);
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
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9), (function() { return this; }())))

/***/ }),
/* 9 */
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
/* 10 */
/***/ (function(module, exports) {

	/* (ignored) */

/***/ }),
/* 11 */
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
/* 12 */
/***/ (function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.h5 = h5;
	/**
	 * @description
	 * @author  yinshi
	 * @date 16/12/14.
	 */
	
	function h5(success, error, options) {
	    var _opts = options || {};
	
	    _opts.maximumAge = _opts.maximumAge || 3000;
	    _opts.enableHighAccuracy = _opts.enableHighAccuracy || true;
	    _opts.timeout = _opts.timeout || 10000;
	    _opts.debug = _opts.debug || false;
	    // 其他浏览器
	    if (navigator.geolocation) {
	        navigator.geolocation.getCurrentPosition(function (position) {
	            if (_opts.debug) {
	                console.log(position.coords);
	                alert(position.coords);
	            }
	            success(position.coords);
	        }, function (err) {
	            if (_opts.debug) {
	                console.error(err);
	                alert(err);
	            }
	            error(err);
	        }, {
	            enableHighAccuracy: _opts.maximumAge,
	            // 指定获取地理位置的超时时间，默认不限时，单位为毫秒
	            timeout: _opts.timeout,
	            // 最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。
	            maximumAge: _opts.maximumAge
	        });
	    }
	}

/***/ }),
/* 13 */
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * @description
	 * @author  yinshi
	 * @date 16/12/14.
	 */
	function weixin(_success, error, options) {
	    if (!wx) {
	        alert('您没有引入wxJSSDK');
	        return;
	    }
	    var _opts = options || {};
	
	    _opts.type = _opts.type || 'wgs84';
	    _opts.debug = _opts.debug || false;
	    wx.ready(function () {
	        wx.getLocation({
	            type: _opts.type,
	            success: function success(res) {
	                _opts.debug && alert(res);
	                _success(res);
	            },
	            fail: function fail(err) {
	                _opts.debug && alert(err);
	                error(err);
	            },
	            cancel: function cancel(err) {
	                _opts.debug && alert(err);
	                error(err);
	            }
	        });
	    });
	}
	exports.weixin = weixin;

/***/ }),
/* 14 */
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.amap = amap;
	/**
	 * @description 根据经纬度判断
	 * @author  yinshi
	 * @date 17/3/17.
	 */
	
	function amap(resolve, reject) {
	    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
	
	    var AMap = window.AMap;
	    var mapObj = new AMap.Map('iCenter');
	    mapObj.plugin('AMap.Geolocation', function () {
	        var geolocation = new AMap.Geolocation({
	            enableHighAccuracy: true, //是否使用高精度定位，默认:true
	            timeout: options.timeout || 10000, //超过10秒后停止定位，默认：无穷大
	            maximumAge: 1000, //定位结果缓存0毫秒，默认：0
	            convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
	            showButton: true, //显示定位按钮，默认：true
	            buttonPosition: 'LB', //定位按钮停靠位置，默认：'LB'，左下角
	            buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
	            showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
	            showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
	            panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
	            zoomToAccuracy: true //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
	        });
	        geolocation.getCurrentPosition(function (status, result) {
	            if (status === 'complete') {
	                result.latitude = result.position.lat;
	                result.longitude = result.position.lng;
	                resolve(result);
	            } else {
	                reject(result);
	            }
	        });
	    });
	}

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _cmd = __webpack_require__(16);
	
	var _cmd2 = _interopRequireDefault(_cmd);
	
	var _util = __webpack_require__(18);
	
	var util = _interopRequireWildcard(_util);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/*****************************
	 * 业务数据统计模块
	 *****************************/
	var cmd = new _cmd2.default();
	var sysinfo = util.getSysInfo();
	var doc = document;
	var win = window;
	
	if (doc) {
	    cmd.setObj({
	        domain: doc.domain,
	        url: doc.URL || location.href,
	        title: doc.title,
	        referrer: doc.referrer || ''
	    });
	}
	if (win && win.screen) {
	    cmd.setObj({
	        height: win.screen.height || win.outerHeight || 0,
	        width: win.screen.width || win.outerWidth || 0
	    });
	}
	if (navigator) {
	    cmd.set('lang', navigator.language || '');
	}
	cmd.setObj(sysinfo).setObj({
	    deviceId: util.getDeviceID(),
	    ua: navigator.userAgent
	});
	
	exports.default = cmd;
	/*
	"chanelId"="",//渠道 //合作渠道
	"source":"",//微信/App/other //APP来源
	"key":"page/click",//事件类型
	"lat":"", //经度
	"lng":"",//纬度
	"province":"浙江省", //?
	"citycode":"3023", //?
	"city":"杭州", //?
	"url":"", //当前URL
	"referer":"",//上一个页面的连接
	"osVersion":"",//系统
	"osName":"",//系统名称
	"timestamp":1482216860341,//当前时间戳
	"userId":"10112340888", //用户ID
	"openId":"", //微信中openId
	"deviceId":"", //APP中设备号
	"width":,//屏幕的宽度
	"height":,//屏幕的高度
	"ua":"",//userAgent
	"segmentation":"key=value&key=value" //扩展字段

	*/

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _post = __webpack_require__(17);
	
	var _post2 = _interopRequireDefault(_post);
	
	var _util = __webpack_require__(18);
	
	var util = _interopRequireWildcard(_util);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Cmd = function () {
	    function Cmd() {
	        _classCallCheck(this, Cmd);
	
	        this.params = {}; // 每个请求都会携带的数据参数
	    }
	
	    _createClass(Cmd, [{
	        key: 'set',
	        value: function set(key, value) {
	            this.params[key] = value;
	            return this;
	        }
	    }, {
	        key: 'setObj',
	        value: function setObj(opts) {
	            var _this = this;
	
	            Object.keys(opts).forEach(function (key) {
	                _this.set(key, opts[key]);
	            });
	            return this;
	        }
	    }, {
	        key: 'send',
	        value: function send() {
	            var now = new Date();
	            this.params['timestamp'] = now.getTime();
	            this.params['actionTime'] = util.getTime(now);
	            (0, _post2.default)(this.url, this.params);
	            return this;
	        }
	    }, {
	        key: 'clean',
	        value: function clean() {
	            this.params = {};
	            return this;
	        }
	    }, {
	        key: 'event',
	        value: function event(key, seg) {
	            this.params['key'] = key;
	            if (seg) {
	                this.params['segmentation'] = seg;
	            }
	            this.send();
	            delete this.params['key'];
	            delete this.params['segmentation'];
	            return this;
	        }
	    }, {
	        key: 'host',
	        get: function get() {
	            if (window.location.host === 'm.ddyc.com') {
	                return 'https://collect.ddyc.com';
	            } else {
	                return 'http://int.xiaokakeji.com:8091';
	            }
	        }
	    }, {
	        key: 'url',
	        get: function get() {
	            return this.host + '/datachannel/data/h5/sendLog';
	        }
	    }]);
	
	    return Cmd;
	}();
	
	exports.default = Cmd;

/***/ }),
/* 17 */
/***/ (function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = post;
	function post(url, params) {
	    if (!url) {
	        return;
	    }
	    var xhr = new XMLHttpRequest();
	    xhr.open('POST', url, true);
	    //xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	    var json = {
	        events: [params]
	    };
	    xhr.send(JSON.stringify(json));
	}

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.getTime = getTime;
	exports.getDeviceID = getDeviceID;
	exports.getSysInfo = getSysInfo;
	exports.getToken = getToken;
	exports.getItem = getItem;
	exports.setItem = setItem;
	exports.onShareWechat = onShareWechat;
	exports.onShareApp = onShareApp;
	exports.extend = extend;
	
	function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }
	
	var nativeReady = __webpack_require__(7);
	var nativeShare = __webpack_require__(19);
	function addZero(n) {
	    if (n < 10) {
	        return '0' + n;
	    }
	    return '' + n;
	}
	function getTime(nowDate) {
	    var now = nowDate || new Date();
	    var year = now.getFullYear();
	    var month = addZero(now.getMonth() + 1);
	    var day = addZero(now.getDate());
	    var hours = addZero(now.getHours());
	    var minutes = addZero(now.getMinutes());
	    var seconds = addZero(now.getSeconds());
	    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
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
	/**
	 * 解析 ua, 修改 zepto detect 模块
	 */
	function detect(ua, platform) {
	    var os = {},
	
	    //webkit = ua.match(/Web[kK]it[\/]{0,1}([\d.]+)/),
	    android = ua.match(/(Android);?[\s\/]+([\d.]+)?/),
	        osx = !!ua.match(/\(Macintosh\; Intel /),
	        ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
	        ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/),
	        iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
	
	    //webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
	    win = /Win\d{2}|Windows/.test(platform),
	        wp = ua.match(/Windows Phone ([\d.]+)/);
	    //chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/),
	    //firefox = ua.match(/Firefox\/([\d.]+)/),
	    //ie = ua.match(/MSIE\s([\d.]+)/) || ua.match(/Trident\/[\d](?=[^\?]+).*rv:([0-9.].)/)
	    //safari =  ua.match(/Version\/([\d.]+)([^S](Safari)|[^M]*(Mobile)[^S]*(Safari))/)
	    // Todo: clean this up with a better OS/browser seperation:
	    // - discern (more) between multiple browsers on android
	    // - decide if kindle fire in silk mode is android or not
	    // - Firefox on Android doesn't specify the Android version
	    // - possibly devide in os, device and browser hashes
	    if (android) os.android = true, os.version = android[2];
	    if (iphone && !ipod) os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.');
	    if (ipad) os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.');
	    if (ipod) os.ios = os.ipod = true, os.version = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
	    if (wp) os.wp = true, os.version = wp[1];
	    // 扩展 osName参数
	    if (osx) {
	        os.osName = 'osx';
	    }
	    if (win) {
	        os.osName = 'win';
	    }
	    if (android) {
	        os.osName = 'android';
	    }
	    if (iphone || ipad || ipod) {
	        os.osName = 'ios';
	    }
	    if (wp) {
	        os.osName = 'wp';
	    }
	    if (!os.osName) {
	        os.osName = 'other';
	    }
	    return os;
	}
	function getSysInfo() {
	    return detect(navigator.userAgent, navigator.platform);
	}
	
	var doc = document;
	var win = window;
	function getToken() {
	    var cookie = doc.cookie.split(';').reduce(function (ck, str) {
	        var _str$split = str.split('='),
	            _str$split2 = _toArray(_str$split),
	            key = _str$split2[0],
	            data = _str$split2.slice(1);
	
	        ck[key.trim()] = data.join('=');
	        return ck;
	    }, {});
	    if (cookie.outToken) {
	        setItem('outtoken', cookie.outToken);
	    }
	    return cookie.outToken || getItem('outtoken') || '';
	}
	
	function getItem(key) {
	    try {
	        return localStorage.getItem(key);
	    } catch (e) {}
	}
	function setItem(key, val) {
	    try {
	        localStorage.setItem(key, val);
	    } catch (e) {}
	}
	/**
	 * 微信分享
	 */
	function onShareWechat(opt, fn) {
	    wx.ready(function () {
	        var shareOpt = {
	            title: opt.shareTitle,
	            link: opt.shareUrl,
	            imgUrl: opt.shareImgUrl,
	            desc: opt.shareContent,
	            type: '',
	            dataUrl: '',
	            success: function success() {
	                if (window._vds) {
	                    window._vds.track("微信分享", {
	                        activeName: opt.activeName,
	                        activeUrl: opt.shareUrl,
	                        shareTime: getTime(),
	                        userId: opt.openid || ''
	                    });
	                }
	                if (fn) {
	                    fn('wechat', { status: 1 });
	                }
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
	 * APP 分享
	 */
	function onShareApp(opt, fn) {
	    nativeReady(function (info) {
	        nativeShare({
	            url: opt.shareUrl,
	            content: opt.shareContent,
	            title: opt.shareTitle,
	            subTitle: opt.shareSubTitle,
	            image: opt.shareImgUrl
	        }, function (ret) {
	            if (window._vds) {
	                window._vds.track('APP分享', {
	                    activeName: opt.activeName,
	                    activeUrl: opt.shareUrl,
	                    shareTime: getTime(),
	                    userId: info.userId || ''
	                });
	            }
	            if (fn) {
	                fn('app', ret);
	            }
	        });
	    });
	}
	
	/**
	 * 对象合并
	 */
	function extend(o, p) {
	    for (var k in p) {
	        o[k] = p[k];
	    }
	    return o;
	}

/***/ }),
/* 19 */
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
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.uploadData = uploadData;
	
	var _post = __webpack_require__(17);
	
	var _post2 = _interopRequireDefault(_post);
	
	var _util = __webpack_require__(18);
	
	var util = _interopRequireWildcard(_util);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var performance = window.performance;
	var sysinfo = util.getSysInfo();
	function getEnterType(type) {
	    switch (type) {
	        case 0:
	            return '点击链接、地址栏输入、表单提交、脚本操作等方式加载';
	        case 1:
	            return '通过“重新加载”按钮或者location.reload()方法加载';
	        case 2:
	            return '用户通过后退按钮访问本页面';
	        default:
	            return '任何其他来源的加';
	    }
	}
	function getResourcesData(resObj) {
	    var resArr = [];
	    resObj.forEach(function (item) {
	        resArr.push({
	            name: item.name,
	            duration: Math.round(item.duration),
	            type: item.initiatorType
	        });
	    });
	    return resArr;
	}
	function getPerformanceData() {
	    var navigator = window.navigator;
	    if (!performance) {
	        return {
	            ua: navigator.userAgent
	        };
	    }
	
	    var timing = performance.timing;
	    var now = new Date();
	    return {
	        timestamp: now.getTime(),
	        actionTime: util.getTime(now),
	        dns: timing.domainLookupEnd - timing.domainLookupStart,
	        tcp: timing.connectEnd - timing.connectStart,
	        request: timing.responseEnd - timing.responseStart,
	        dom: timing.domComplete - timing.domInteractive,
	        emptyPage: timing.responseStart - timing.navigationStart,
	        domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
	        onload: timing.loadEventEnd === 0 ? 0 : timing.loadEventEnd - timing.navigationStart,
	        resources: getResourcesData(performance.getEntries()),
	        enterType: getEnterType(performance.navigation.type),
	        redirectCount: performance.navigation.redirectCount,
	        url: document.URL,
	        osVersion: sysinfo.version,
	        osName: sysinfo.name,
	        ua: navigator.userAgent,
	        originData: JSON.stringify(performance)
	    };
	}
	// 性能数据输出
	function uploadData(lat, lng) {
	    var performance = window.performance;
	    if (!performance || !performance.timing.loadEventEnd) {
	        window.addEventListener('load', function () {
	            uploadData(lat, lng);
	        }, false);
	        return;
	    }
	    var data = getPerformanceData();
	    data.lat = lat;
	    data.lng = lng;
	    if (window.location.host === 'm.ddyc.com') {
	        (0, _post2.default)('https://collect.ddyc.com/datachannel/page/h5/pref_analysis', data);
	    } else {
	        (0, _post2.default)('http://int.xiaokakeji.com:8091/datachannel/page/h5/pref_analysis', data);
	    }
	}

/***/ }),
/* 21 */,
/* 22 */
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
	    __webpack_require__(23);
	
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
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(24);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(26)(content, {});
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
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(25)();
	// imports
	
	
	// module
	exports.push([module.id, "/**\n * @author : 宇尘\n * @created : 2015-06-22\n * @version : v1.0\n * @desc : loading\n */\n .ui-loading-fixed {\n    position: fixed;\n    top: 0;\n    left: 0;\n    bottom: 0;\n    right: 0;\n    /*pointer-events: none;*/\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-pack: center;\n        -ms-flex-pack: center;\n            justify-content: center;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    z-index: 1000000;\n    background: rgba(0,0,0,.2);\n }\n .ui-loading-fixed span {\n    background-color: rgba(0,0,0,.4);\n    border-radius: 3px;\n    display: inline-block;\n    padding: 5px 10px;\n    font-size: 0;\n }\n .ui-loading-fixed i {\n    content:'';\n    display:block;\n    -webkit-animation: ui-loading-fixed-rotate 1s linear infinite;\n            animation: ui-loading-fixed-rotate 1s linear infinite;\n    background:url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoxNzk1ODUwQzlEMDhFMzExOTFBMkJBQUFCMkFDODIzRSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo0RjIzMTM3QTMzM0MxMUUzODU3MDg3MTczRUU5MUI2OCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo0RjIzMTM3OTMzM0MxMUUzODU3MDg3MTczRUU5MUI2OCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjFBOTU4NTBDOUQwOEUzMTE5MUEyQkFBQUIyQUM4MjNFIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjE3OTU4NTBDOUQwOEUzMTE5MUEyQkFBQUIyQUM4MjNFIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+SXvjNwAAAvpJREFUeNqsl0toU0EUhm80baJWS7Wttj6qqIuCohhdKaQouBARVCgiCOJSV1KXblUEN+rCB/haCC4UdeFG1LrwLUERFB+oC0vF+G5o1TRp/A/8A9PjzM29sQc+bu4kM//MmXPOTBKVSiWIarlcznxcBPaCZeArOA+OgbJ8mclkqo6VdAxazeaBC6CB721gD2gE+6IOkjAr9gjXg6Jq2w+2On5bAsvBj2qi4pGko3082AE2clVvwRHwxFqxz3sdFE6ALrAQvAG3wag9HecYYCfYZrlyPjjEQcQ+eIRHQB/73QC3wAk+e7kVXuFJXKm2OrCFn0873C92kYF2AKxW32XBwTDh6XbAKWvj8yXYDl7z/Rc4wygX6/b073ZGNe0TGOYKtX20Pt8Da+mhPwwsYxM9whPCVjwILjk6/WauBo7fl1TbTY/wqPakI42OgyGwiQHxChwF7+x0CCkuPWAFaFee3O1zdYJuEtGzpBaT9FvCOOhkTJwDeXuSRngNo1lWWABXwPWgdvvCFAwtmSs5O2OTmccl5mCk2htiU0CzVQVlUgMivMHTYZ0RjmJ6ctxzWcRMqznF94RE9TTPWK3B/1uLp71ZhPs9X/aPgXCdp71ehK/qAk67PAbCw572ouyxbMZhsBnMAJ8p+tB1VscMNBlrlivqTTrlSE0Wcoko8MRq+SeqZQWq41SwiinwDdzlzONamq4ukCDskJAI38WwN2exVKFTnHkUa2XFSjN25HB5oe9jWni9JWpffySnT0a4m0nlW8rya8pwO5/Pwk6nDs+As9V7A7dCT3yOJarP8nSYq4ccKzbtZvWy/wtMWoD7PMECPbiyFI9X54ofeTo95rPLEjUTyVoeKXj6l3l2e119h7eLEb5XmM+9PDLnegbu5PM9bySuo7IU5moRvMbraBP4bs00VSV1Aoo+YDY08b1PXZucwvaVZlC1DXAg1wTy6pr0PNJfmGplkClU5jZk1RbJvj6NW12SMX8v/wp+gsW8NeYpWoxbx/8KMAC97sC/2v4BrgAAAABJRU5ErkJggg==\") no-repeat 50% 50%;\n    background-size:30px;\n    width:30px;\n    height:30px;\n }\n\n @-webkit-keyframes ui-loading-fixed-rotate {\n    from {\n        -webkit-transform:rotate(0)\n    }\n    to {\n        -webkit-transform:rotate(360deg)\n    }\n }\n\n @keyframes ui-loading-fixed-rotate {\n    from {\n        -webkit-transform:rotate(0);\n                transform:rotate(0)\n    }\n    to {\n        -webkit-transform:rotate(360deg);\n                transform:rotate(360deg)\n    }\n }\n", ""]);
	
	// exports


/***/ }),
/* 25 */
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
/* 26 */
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
/* 27 */
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
	
		__webpack_require__(28);
	
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
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(29);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(26)(content, {});
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
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(25)();
	// imports
	
	
	// module
	exports.push([module.id, "/**\n * @author : 宇尘\n * @created : 2015-06-10\n * @version : v0.1.0\n * @desc : fixtip\n */\n.ui-fixtip {\n  position: fixed;\n  left: 0;\n  right: 0;\n  text-align: center;\n  font-size: 14px;\n}\n.ui-fixtip span {\n  display: inline-block;\n  padding: 10px 20px;\n  background: rgba(0,0,0,.5);\n  color: #fff;\n  border-radius: 2px;\n}\n", ""]);
	
	// exports


/***/ })
/******/ ]);
//# sourceMappingURL=history.js.map
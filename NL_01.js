/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////
///////////////   基础扩展
///////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @ target Extends the basic Javascript Language
 * @ author peichao01
 * @ date 2011-12-28
 * @ last-change 2012-01-15 00:34  --------- 换到下一个版本，此时的主要困难： Dom 事件的 on||off 处理。
 *                                           要考虑到 不同的 dom 集合使用同一个函数作为侦听器，以及，
 *                                           同一个dom在不同事件用同一个侦听器函数
 *                                     建议：
 *                                           所有的函数都缓存到 NL 对象内部，返回 ID 句柄，移除对象是只用 ID 来移除
 *                                     e.g.
 *                                           var ID = NL('li').on('click', function(){...});
 *                                           NL.off(ID);
 *                                           
 *                                           var ID = NL('#box').delegate('.li', 'click', function(){..});
 *                                           NL.undelegate(ID);
 * @ project ExtendsJs.js
 * @ structor
 ************************* prototype ***************
 ****** String.trim
 ****** Array.forEach
 ****** Array.filter
 ****** Array.map
 ****** Array.indexOf
 ****** Function.bind
 ****** Function.method
 ****** Function.inherite
 ****** ****************** static method *************
 ****** Object.create
 ****** Object.construct
 ****** Object.merge
 */

/**
 * @ target 去除参数字符串两侧的空字符
 * 
 */
if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/(^\s*)|(\s*$)/g, "");
    }
}

/**
* @ target 遍历数组，为每一个元素执行一次指定的函数
* @ property fn: Function 对每个元素执行的函数
* @ property thisObj: Object (Alternative) 指定 this 对象
* 
*/
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function (fn, thisObj) {
        var scope = thisObj || window;
        for (var i = 0, len = this.length; i < len; ++i) {
            fn.call(scope, this[i], i, this);
        }
    };
}
/**
* @ target 使用指定的函数过滤数组元素，并把符合函数的元素组成新数组并返回
* @ property fn: Function 对每个元素执行的函数, 每个元素在函数中返回 true，则合格
* @ property thisObj: Object (Alternative) 指定 this 对象
* @ return new Array
*/
if (!Array.prototype.filter) {
    Array.prototype.filter = function (fn, thisObj) {
        var scope = thisObj || window;
        var a = [];
        for (var i = 0, len = this.length; i < len; ++i) {
            if (!fn.call(scope, this[i], i, this)) {
                continue;
            }
            a.push(this[i]);
        }
        return a;
    };
}
/**
* @ target 遍历数组，把每个元素在指定函数中执行的结果作为新的数组返回
* @ property fn: Function 对每个元素执行的函数
* @ property thisObj: Object (Alternative) 指定 this 对象
* @ return new Array 每个元素在指定函数中执行的结果
*/
if(!Array.prototype.map){
    Array.prototype.map = function (fn, thisObj) {
        if (typeof fn != "function")
            throw new TypeError();
        var scope = thisObj || window, result = [];
        for (var i = 0, len = this.length; i < len; i++) {
            if (i in this)
                result[i] = fn.call(scope, this[i], i, this);
        }
        return result;
    }
}
/**
* @ target 获取指定item在数组中的索引，如果不存在则返回-1
* @ property item: Mixin 要查找的item
* @ return index || -1: Int/Number
*/
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (item) {
        for (var i = 0, len = this.length; i < len; i++) {
            if (item === this[i])
                return i;
        }
        return -1;
    }
}
/**
* @ target 移除数组中指定的元素，如果不存在则返回  false
* @ property item: Mixin 要移除的元素
* @ return index || -1 : Int/Number 移除的元素所在的索引位置
*/
if (!Array.prototype.remove) {
    Array.prototype.remove = function (item) {
        for (var i = 0, len = this.length; i < len; i++) {
            if (item == this[i]) {
                this.splice(i, 1);
                return i;
            }
        }
        return -1;
    };
}
/**
* @ target 创建一个新的对象，并把参数作为新对象的原型
* @ property proto: Object 新对象的原型
* @ return new Object
* 
* @ note 使用空函数 TempEmptyConstrctor 来做中间件，但这就扰乱了继承关系
*        重设新对象的 constructor 以重新指正正确的继承关系
*/
if(!Object.create){
    Object.create = function (proto) {
        var TempEmptyConstrctor = function () { };
        TempEmptyConstrctor.prototype = proto;
        var r = new TempEmptyConstrctor();
        r.constructor = proto.constructor; //*** @ note
        return r;
    }
}
/**
* @ target 创建一个新的对象，把参数作为原型，且，若参数原型中含有 Main 函数，即先初始化 再返回
* @ property proto: Object 新对象的原型，且先初始化（若有 Main 函数）
* @ return new Object
*
* @ note 此方法的目的是把参数提供的对象作为原型生成新的对象
*        但在内部实现中，用到了第三方的一个空函数 TempEmptyConstrctor ，
*        这就扰乱了新对象的继承指示关系，最后重设新对象的 constructor 属性，
*        让新对象的 constructor 指向参数原型的 constructor，即它们应该是一条链继承下来的关系
*/
if(!Object.construct){
    Object.construct = function (proto) {
        var TempEmptyConstrctor = function () { };
        if (proto.Main) {
            proto.Main.apply(proto, [].slice.call(arguments, 1));
        }
        TempEmptyConstrctor.prototype = proto;
        var r = new TempEmptyConstrctor();
        r.constructor = proto.constructor; //*** @ note
        return r;
    }
}
/**
* @ target 合并对象，把source的属性都传递给接受的对象并返回
* @ property destination: Object 接受属性的对象
* @ property source: Object 输出属性的对象
* @ property isOverride: Boolean 接受者已经有了同名属性时，是否覆盖
*/
if (!Object.merge) {
    Object.merge = function (destination, source, isOverride) {
        for (var key in source) {
            if (isOverride || !destination[key])
                destination[key] = source[key];
        }
    }
}
/**
* @ version Mozilla 实现版
* @ target 为函数绑定 this 对象
* @ property thisObj: Object 需要绑定的 函数的 this指向
* 
*/
if (!Function.prototype.bind) {
    Function.prototype.bind = function (thisObj) {
        if (typeof this !== "function")
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");

        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function () { },
            fBound = function () {
                return fToBind.apply(this instanceof fNOP ? this : thisObj || window, aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}
/** bind @ version 简化版
if (!Function.prototype.bind) {
    Function.prototype.bind = function (sourceObj) {
        var arr = [], args = arr.slice.call(arguments, 1);
        return function () {
            return this.apply(sourceObj, arr.concat.apply(args, arr.slice.call(arguments,1)));
        }
    }
}
*/
    
/**
* @ target 为 函数 添加原型方法
* @ property fnName: String 方法的名字
* @ property fn: Function 方法函数本身
* 
*/
if (!Function.prototype.method) {
    Function.prototype.method = function (fnName, fn) {
        this.prototype[fnName] = fn;
        return this;
    }
}
/**
* @ target 为 函数||类 添加原型
* 
*/
if (!Function.prototype.addProto) {
    Function.prototype.addProto = function (prototypes) {
        for (var key in prototypes) {
            this.prototype[key] = prototypes[key];
        }
    }
}
/**
* @ target 为 函数 添加静态方法 || 类方法  Fn.fn();
* @ property fnName: String 方法的名字
* @ property fn: Function 方法函数本身
* @ e.g.
*       1. function.addStaticFn('eat', fn);
*       2. function.addStaticFn({ eat: fn, sleep: fn2 });
* 
*/
if (!Function.prototype.addStatic) {
    Function.prototype.addStatic = function (staticThings) {
        for (var key in staticThings) {
            this[key] = staticThings[key];
        }
        return this;
    }
}
/**
* @ target 继承自其它构造器
* @ property Class: Function 需要继承的父类构造函数
*
* @ note 继承之后，再把constructor重置回来
* 
*/
if(!Function.prototype.inherite){
    Function.prototype.inherite = function (Class) {
        if (typeof Class != 'function')
            throw new TypeError('custom: argument Class should be a Function.');
        this.prototype = new Class();
        this.prototype.constructor = this;//*** @ note
    }
}

/**
* @ require ExtendJs.js
* @ means NL Naruto & Luffy
* @ author peichao01
* @ date 2011-12-28
* @ last-change 2012-01-13 23:01
* @ project Lib.js 
* @ structor
****** NL.$
****** NL.$$: sizzle
****** NL.create
****** NL.onDomReady
****** 
****** NL.Browser
****** NL.Cookie
****** NL.Elements
****** NL.CSS
****** NL.ajax
****** NL.JSON
****** NL.Events
****** NL.Utils
****** NL.console
*/
(function (win, undefined) { 
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////
    ///////////////   NL 核心
    ///////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var _NL = (function(){
		var $ = function(selector, context, results, seed){
			return new $.fn.init(selector, context, results, seed);
		}

        $.addProto({
            init: function(selector, context, results, seed){
                if(!NL.$) throw new Error('custom : must load NL_sizzle.js first!');
                if(selector.nodeType !== undefined) this.doms = new Array(selector);//如果传进来的是一个Element
				else this.doms = NL.$(selector, context, results, seed);
			},
            doms : null
        });
        $.fn = $.prototype;
        $.fn.init.prototype = $.fn;

		return $;
	})();
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////
    ///////////////   NL 类的静态方法
    ///////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var staticMethod = {
        /**
        * @ target 创建一个类的实例
        * @ property className: Function 类名/构造函数
        * @ property [ Main's params: Mixin ] 此类 Main 函数的参数
        * @ e.g. 
        *		var instance = NL.create(ClassName, constructorParams);
        */
        create: function (className, MainParams) {
            var instance = (typeof className === 'function') ? (new className()) : (eval('new ' + className));
            var args = [].slice.call(arguments, 1);
            args.unshift(instance);
            return Object.construct.apply(win, args);
        },
        /**
        * @ target 判断DOM加载完毕
        * @ property callback
        * @ property enableFF2 [optional] 设置是否在FF2下使用DOMContentLoaded（在FF2下的特定场景有Bug）
        * @ url http://varnow.org/?p=77 //参考来源
        */
        onDomReady: function (callback, enableFF2) {
            var isReady = false;
            function doReady() {
                if (isReady) return;
                //确保onready只执行一次
                isReady = true;
                callback();
            }
            if (this.browser.isIE) {
                (function () {
                    if (isReady) return;
                    try {
                        document.documentElement.doScroll('left');
                    } catch (e) {
                        setTimeout(arguments.callee, 0);
                        return;
                    }
                    doReady();
                })();
                NL.Events.on(win, 'load', doReady);
            } else if (this.browser.isWebkit && this.browser.webkitVersion < 525) {
                (function () {
                    if (isReady) return;
                    if (/load|complete/.test(document.readyState))
                        doReady();
                    else
                        setTimeout(arguments.callee, 0);
                })();
                NL.Events.on(win, 'load', doReady);
            } else {
                if (!this.browser.isFF || this.browser.version != 2 || enableFF2) {
                    NL.Events.on(doc, 'DOMContentLoaded', function (e) {
                        NL.Events.off(doc, 'DOMContentLoaded', arguments.callee);
                        doReady();
                    });
                }
                NL.Events.on(win, 'load', doReady);
            }
        },
        /**
        * @ target 浏览器的信息
        * @ 
        */
        browser: (function () {
            var ua = navigator.userAgent,
                isIE = (/MSIE/gi).test(ua),
                isOpera = (/Opera/gi).test(ua),
                isChrome = (/Chrome/gi).test(ua),
                isWebkit = (/WebKit/gi).test(ua),
                isSafari = (/Safari/gi).test(ua) && !isChrome,
                isFF = (/Firefox/gi).test(ua),
                version = (function () {
                    var v = 0;
                    if (isIE)
                        v = parseFloat(ua.substring(ua.indexOf('MSIE') + 4));
                    else if (isFF)
                        v = parseFloat(ua.substring(ua.indexOf('Firefox/') + 8));
                    else if (isOpera)
                        v = parseFloat(ua.substring(ua.indexOf('Opera/') + 6));
                    else if (isChrome)
                        v = parseFloat(ua.substring(ua.indexOf('Chrome/') + 7));
                    else if (isSafari)
                        v = parseFloat(ua.substring(ua.indexOf('Version/') + 8));
                    return v;
                })(),
                webkitVersion = isWebkit ? parseFloat(ua.substring(ua.indexOf('AppleWebKit/') + 12)) : false;

            return {
                ua: ua,
                isIE: isIE,
                isFF: isFF,
                isWebkit: isWebkit,
                isChrome: isChrome,
                isSafari: isSafari,
                isOpera: isOpera,
                version: version,
                webkitVersion: webkitVersion
            };
        })(),
        /**
        * @ target 管理cookie
        *
        * @ method setCookie
        * @ method getCookie
        * @ method killCookie
        */
        Cookie: {
            DEFAULT_HOURS: 24,
            setCookie: function (name, value, hours, path, domain, secure) {
                if (typeof (hours) != 'number') {
                    hours = this.DEFAULT_HOURS;
                }
                var numHours = (new Date((new Date()).getTime() + hours * 3600000)).toGMTString();
                document.cookie = name + '=' + escape(value) + ((numHours) ? (';expires=' + numHours) : '') + ((path) ? ';path=' + path : '') + ((domain) ? ';domain=' + domain : '') + ((secure && (secure == true)) ? '; secure' : '');
            },
            getCookie: function (name) {
                if (document.cookie == '') {
                    return false;
                } else {
                    var firstChar, lastChar;
                    var theBigCookie = document.cookie;
                    firstChar = theBigCookie.indexOf(name);
                    if (firstChar != -1) {
                        firstChar += name.length + 1;
                        lastChar = theBigCookie.indexOf(';', firstChar);
                        if (lastChar == -1) lastChar = theBigCookie.length;
                        return unescape(theBigCookie.substring(firstChar, lastChar));
                    } else {
                        return false;
                    }
                }
            },
            killCookie: function (name, path, domain) {
                var theValue = this.getCookie(name);
                if (theValue) {
                    document.cookie = name + '=' + theValue + '; expires=Fri, 13-Apr-1970 00:00:00 GMT' + ((path) ? ';path=' + path : '') + ((domain) ? ';domain=' + domain : '');
                }
            }
        },
        /**
        * @ target Event Bus 事件管理 non-DOM
        * @ method on(listen) --------------- 监听事件的方法
        * @ method off(remove|removeAll) ---- 移除事件的方法
        * @ method fire --------------------- 发出事件
        * 
        * @ note ---------------------------- DOM 事件 见 NL() 的实例方法
        */
        events: new function(){
            var events = {};
            /*
            * @ target non-DOM 的监听事件的方法
            * @ property eventType: String 监听的事件类型
            * @ property callback: Function 监听的事件
            *
            * @ return handlerId: String 监听函数手柄--用来移除监听事件
            */
            this.on = function (eventType, callback) {
                callback.id = 'NLLibraryEventBusHandlerId:' + (new Date).getTime();
                if (!events[eventType])
                    events[eventType] = [];
                events[eventType].push(callback);
                return callback.id;
            };
            /*
            * @ target non-DOM 的移除事件的方法
            * @ property eventType: String 移除的事件类型
            * @ property fn_id_isAll: Function | handlerId | Boolean 需要移除的监听函数 | 此函数的句柄 | 是否全部移除此类事件的监听
            */
            this.off = function (eventType, fn_id_isAll) {
                if(!events[eventType])
                    return;
                else if(staticMethod.utils.isBoolean(fn_id_isAll))
                    delete events[eventType];
                else{
                    var ci = fn_id_isAll;
                    for (var i = 0, len = events[eventType].length; i < len; i++) {
                        if (((typeof ci == 'string') && events[eventType][i].id == ci) || ((typeof ci == 'function') && events[eventType][i] == ci)) {
                            events[eventType].splice(i, 1);
                            return;
                        }
                    }
                }
            };
            /*
            * @ target 发出事件
            * @ property eventType: String 事件的名字
            * @ property [ fnParams: Mixin ] 执行函数时，传递的参数
            * @ property [ fnScope: Object ] 执行函数时，可以传递作用域内 this 对象
            */
            this.fire = function (eventType, fnParams, fnScope) {
                fnScope = fnScope || window;
                if (events[eventType]) {
                    for (var i = 0, len = events[eventType].length; i < len; i++) {
                        events[eventType][i].call(fnScope, fnParams);
                    }
                }
            };
        },
        ajax : function (method, url, callback, data) {
            method = method.toUpperCase();
            var xhr = (function () {
                try {
                    var tempXhr = new XMLHttpRequest();
                    xhr = new XMLHttpRequest(); // *** @  note 
                } catch (e) {
                    var tempXhr = new ActiveXObject('msxml2.xmlhttp.3.0');
                    xhr = new ActiveXObject('msxml2.xmlhttp.3.0');
                }
                return tempXhr;
            })();

            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    callback(xhr.responseText, xhr.responseXML);
                }
            }
            xhr.open(method, url, true);
            if (method == 'GET') {
                url = dataToUrl(data || {}, url);
                data = null;
            } else if (method == 'POST') {
                data = dataToUrl(data);
                xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                //xhr.setRequestHeader('Content-length', data.length);
                //xhr.setRequestHeader('Connection', 'close');
            }
            xhr.send(data);
            /*
            * @ target get请求时，把data对象添加到 url 的末尾
            * @ property url: String URL
            * @ property data: Object 请求参数
            */
            function dataToUrl(data, url) {
                if (url) {
                    url += url.indexOf('?') == -1 ? '?' : '';
                } else {
                    url = '';
                }
                for (var key in data) {
                    url += key + '=' + data[key] + '&';
                }
                return url.substring(0, url.length - 1);
            }
        },
        JSON : {
            /**
            * @ target 把JSON字符串解析为json字面值
            * @ note 目前得到的 Number Boolean RegExp Date 都是 String， 在使用时需要二次转换(IE)
            */
            parse: function (jsonStr) {
                /*if (win.JSON && JSON.parse) {
                return win.JSON.parse(jsonStr);
                } else {*/
                try {
                    var temp = win.JSON.parse(jsonStr);
                } catch (e) {
                    eval('var temp = ' + jsonStr);
                }
                return temp;
            },
            /**
            * @ target 把json字面值转换为JSON字符串
            * @ note 目前可以正常转换 String Number Boolean Object Array RegExp Date
            * @ e.g. NL.JSON.stringify(['hello', 50, true, { name: 'John', age: 23, reg: /a/g, arr: ['shit', new Date()]}]);
            */
            stringify: function (javascriptObjectNotation) {
                if (win.JSON && JSON.stringify) {
                    return win.JSON.stringify(javascriptObjectNotation);
                } else {
                    var change = (function (s) {
                        var result = '';
                        if (NL.Utils.isArray(s)) {
                            result += '[';
                            for (var i = 0, len = s.length; i < len; i++) {
                                result += arguments.callee(s[i]) + ',';
                            }
                            result = result.substr(0, result.length - 1);
                            result += ']';
                        } else if (NL.Utils.isOriginObject(s)) {
                            result += '{';
                            for (var key in s) {
                                result += '"' + key + '"' + ':' + arguments.callee(s[key]) + ',';
                            }
                            result = result.substr(0, result.length - 1);
                            result += '}';
                        } else {
                            result += '"' + s.toString() + '"';
                        }
                        return result;
                    })(javascriptObjectNotation);
                    //return "'" + change + "'";
                    return change;
                }
            }
        },
        utils : {
            /**
            * @ target 转换驼峰格式到连线格式
            * @ e.g. 'myNameIs'' --> 'my-name-is
            */
            toHyphens: function (camelCaseValue) {
                var result = camelCaseValue.replace(/[A-Z]/g, function (character) {
                    return ('-' + character.charAt(0).toLowerCase());
                });
                return result;
            },
            /**
            * @ target 转换连线格式到驼峰格式
            * @ e.g. 'my-name-is' --> 'myNameIs'
            */
            toCamelCase: function (hyphenatedValue) {
                return hyphenatedValue.replace(/-([a-z])/g, function (m, w) {
                    return m.slice(1).toUpperCase();
                });
            },
            /**
            * @ target 替换字符串中特定的 元素
            * @ property text: String 需要替换的字符串
            * @ property values: Object 被替换的键值对
            * @ e.g. ('my name is {name}, and age is {age}', {name:"peichao", age:23})
            */
            replaceText: function (text, values) {
                for (var key in values) {
                    if (values.hasOwnProperty(key)) {
                        if (typeof values[key] == undefined) {
                            values[key] = '';
                        }
                        text = text.replace(new RegExp("{" + key + "}", "g"), values[key]);
                    }
                }
                return text;
            },
            $_GET: function (name) {

            },
            /*
            * @ target 获取数组中指定index的元素
            */
            getItem: function (array, index) {
                return array.splice(index, 1)[0];
            },
            isInArray: function (item, array) {
                for (var i = 0, len = array.length; i < len; i++) {
                    if (item === array[i])
                        return true;
                }
                return false;
            },
            toRealArray: function (fakeArray) {
                try {
                    return Array.prototype.slice.call(fakeArray);
                } catch (e) {
                    var f = fakeArray, len = f.length, t = new Array(len);
                    for (var i = 0; i < len; i++) {
                        t[i] = f[i];
                    }
                    return t;
                }
            },
            /**
            * @ target 返回指定参数的数据类型
            * 
            * 
            */
            getType: function (sth) {
                var str = Object.prototype.toString.call(sth);
                return str.substring(8, str.length - 1);
            },
            isString: function (sth) {
                return this.getType(sth) === 'String';
            },
            isNumber: function (sth) {
                return this.getType(sth) === 'Number';
            },
            isBoolean: function (sth) {
                return this.getType(sth) === 'Boolean';
            },
            isArray: function (sth) {
                return this.getType(sth) === 'Array';
            },
            isOriginObject: function (sth) {
                return this.getType(sth) === 'Object';
            },
            isRegExp: function (sth) {
                return this.getType(sth) === 'RegExp';
            },
            isDate: function (sth) {
                return this.getType(sth) === 'Date';
            },
            /**
            * @ target 返回当前时间的标准格式
            * @ return 2012-1-11 23:01:25
            */
            getFullDate: function () {
                var d = new Date(),
                    da = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(),
                    t = d.toString().substring(16, 24);
                return da + ' ' + t;
            },
            /**
            * @ target 返回当前时间的标准格式
            * @ return 23:01:25
            */
            getStdTime: function () {
                var date = this.getFullDate();
                return date.substring(date.indexOf(' ') + 1);
            },
            /**
            * @ target 返回当前时间的标准格式
            * @ return 2012-1-11
            */
            getStdDate: function () {
                var date = this.getFullDate();
                return date.substring(0, date.indexOf(' '));
            }
        },
        console : {
            _log: function(msg, full){
                if (win.console && console.log && !full) {
                    console.log(msg);
                }else{
                    var dom = NL.$('$$console');
                    if (!dom) {
                        dom = document.createElement('div');
                        dom.setAttribute('id', '$$console');
                        NL.CSS.setStyle(dom, {
                            'border-top': '2px solid #666',
                            'background-color': '#eee',
                            'position': 'absolute',
                            'bottom': '0',
                            'left': '0',
                            'overflow': 'auto',
                            'height': '100px',
                            'width': '100%',
                            'margin': '0',
                            'padding': '0'
                        });
                        document.body.appendChild(dom);
                    };
                    var p = document.createElement('p');
                    NL.CSS.setStyle(p, {
                        'border-bottom': '1px solid #aaa',
                        'font-size': '12px',
                        'line-height': '180%',
                        'height': '20px',
                        'margin': '0',
                        'padding': '0'
                    });
                    dom.appendChild(p);
                    p.innerHTML = msg;
                }
            },
            log: function (obj, full) {
                if (win.console && console.log && !full) {
                    console.log(obj);
                } else if (NL.Utils.isOriginObject(obj)) {
                    for (var key in obj) {
                        NL.console._log(key + ' : ' + obj[key], full);
                    }
                } else {
                    NL.console._log(obj, full);
                }
            },
            setHeight: function (height) {
                if (!win.console) {
                    var dom = NL.$('$$console');
                    if (!dom)
                        NL.console.log('');
                    NL.CSS.setStyle(dom, {
                        'height': height + 'px'
                    });
                }
            },
            clear: function () {
                NL.$('$$console').innerHTML = '';
            }
        }
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////
    ///////////////   临时使用的 存储容器
    ///////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var tempEventContainter = new function(){
        //////////////////////////////////
        /////////
        ///////// 这里的方法 最终要被添加到 NL() 的实例方法中，因此
        ///////// on | off | delegate | undelegate 中的 this 最终会被替换为  NL()的一个实例
        /////////
        //////////////////////////////////
        var events=[];
        /*
        * @ target 针对 DOM 的 添加 事件的方法
        * @ property type: String 事件的名字
        * @ property fn: Function 侦听函数
        *
        * @ e.g. 
        *       NL('li').on('click', fn);
        *       NL('li').on({ click: fn, mouseout: fn })
        *
        * @ return handlerId | handlerId_s : String | Object
        */
        this.on = function (type, fn) {
            if(typeof type === 'string'){
                events.push(fn);
                fn.id = 'NLLibraryDomEventHandlerId:' + (new Date).getTime();
                this.each(function(dom, index){
                    var realHandler = addEvent(dom, type, fn);
                });
                return fn.id;
            }else if(staticMethod.utils.isOriginObject(type)){
                var _events = type,handlerId_s = {};
                for(type in _events){
                    fn = _events[type];
                    events.push(fn);
                    fn.id = handlerId_s[type] = 'NLLibraryDomEventHandlerId:' + (new Date).getTime();
                    this.each(function(dom, index){
                        addEvent(dom, type, fn);
                    });
                }
                return handlerId_s;
            }else
                throw new Error(' custom: Please check the Format of the Parameters of "on" method');
        };

        /*
        * @ target 针对 DOM 的 移除 事件的方法
        * @ property type: String 事件的名字
        * @ property fn_id: Function | handlerId :: 侦听函数 | 侦听器的 id
        * @ e.g. 
        *       NL('li').off('click', fn);
        *       NL('li').off('click', handlerId);
        *       NL('li').off({ click: fn, mouseout: fn })
        */
        this.off = function (type, fn_id) {
            var fn = getHandler(fn_id);
            if (typeof type === 'string') {
                this.each(function(dom){
                    removeEvent(dom, type, fn);
                })
            } else if(staticMethod.utils.isOriginObject(type)){
                var _events = type;
                for(var _type in _events){
                    fn = getHandler(_events[_type]);
                    this.each(function(dom){
                        removeEvent(dom, _type, fn);
                    });
                }
            }
            function getHandler(fn_id){
                var fn;
                if(typeof fn_id === 'function'){
                    fn = fn_id;
                }else if(typeof fn_id === 'string'){
                    for(var i=0,len = events.length; i<len; i++){
                        if(fn_id === events[i].id){
                            fn = events[i];
                            break;
                         }
                    }
                    if(fn === undefined) throw new Error(' custom : are you sure you had put the correct Handler_Id into the parameters?');
                }
                return fn;
            }
        };
        /**
        * @ target 还是把事件委托分离出来吧
        * @ property selector: String CSS过滤子元素
        *
        * @ note 目前 filter 仅支持 className
        * @ Important 需要重写：现在是用 target 来判断，但如果元素很多层，应该判断事件冒泡各个阶段所经过的元素
        */
        this.delegate = function (dom, selector, type, fn) {
            fn.realHandler = tempHandler;
            this.on(dom, type, tempHandler);
            var nodes = NL.Elements.byCss(selector, dom);

            function tempHandler(e) {
                e = standardize(e);
                if (NL.Utils.isInArray(e.target, nodes)) {
                    fn.call(e.target, e, dom);
                }
            }

        }
        this.undelegate = function (filter, dom, type, fn) {
            this.off(dom, type, fn.realHandler);
        }

        /**
        * @ target 给NL.Events 对象添加静态属性
        * @ 
        * 
        * 
        **/
        this.createEvent = function (eventName, description) {
            this[eventName.toUpperCase()] = description
        }
        /*
        * @ target 兼容的添加事件的方法
        * @ property dom: Element 有侦听需求的元素
        * @ property type: String 事件的名字
        * @ property fn: Function 侦听函数
        *
        * @ note ① 包装一层，把真正的侦听器的手柄作为传进来的fn的属性保存，以便到时移除
        * @ note ② 如果已经有了，说明传进来的 fn 已经绑定作为其他的 handler  在工作了，
        *           1.此时，如果再 使用 .realHandler = ... 
        *               则会把 fn 保存的上一个  侦听器 给覆盖掉，导致无法正常移除
        *           2.其实也没必要或者说不应该 再 .realHandler = ... 
        *               因为尽然传递进来一个相同的fn，说明使用者目的就是要重用 侦听器，
        *               再次赋给一个 handler 函数的新实例，一来浪费资源，二来，抹掉了fn.realHandler 
        *               保留的上一个 侦听器，致使上一个侦听无法正常移除
        */
        function addEvent(dom, type, fn) {
            /*if(!fn.realHandler)  //*** @ note ②
                fn.realHandler = handler;  //*** @ note ①*/
            var realHandler = handler;
            if (dom.addEventListener) {
                dom.addEventListener(type, realHandler, false);
            } else {
                dom.attachEvent('on' + type, realHandler);
            }
            
            function handler(e){
                e = standardize(e);
                fn.call(dom, e);
            }
            return realHandler;
        }
        /*
        * @ target 兼容的移除事件的方法
        * @ property dom: Element 有移除侦听需求的元素
        * @ property type: String 事件的名字
        * @ property fn: Function 侦听函数
        */
        function removeEvent(dom, type, fn) {
            if (dom.removeEventListener) {
                dom.removeEventListener(type, fn.realHandler);
            } else {
                dom.detachEvent('on' + type, fn.realHandler);
            }
        }
        /*
        * @ target 修复event 对象，使之标准化
        * @ property event: Object
        */
        function standardize(event) {
            var page = getMousePositionRelativeToDocument(event);
            var offset = getMousePositionOffset(event);
            if (event.stopPropagation) {
                event.stopPropagation();
            } else {
                event.cancelBubble = true;
            }
            return {
                target: getTarget(event),
                currentTarget: getCurrentTarget(event),
                relatedTarget: getRelatedTarget(event),
                key: getCharacterFromKey(event),
                pageX: page.x,
                pageY: page.y,
                offsetX: offset.x,
                offsetY: offset.y,
                originalEventObject: event,
                preventDefault: function () {
                    if (event.preventDefault) {
                        event.preventDefault();
                    } else {
                        event.returnValue = false;
                    }
                }
            }
        };
        /*
        * @ target 获取 event 的target
        * @ property event: Object
        */
        function getTarget(event) {
            var target = event.srcElement || event.target;
            try {
                if (target.nodeType == 3) {
                    target = target.parentNode;
                }
            } catch (e) { };
            return target;
        }
        function getCurrentTarget(event){
            
        }
        /*
        * @ target 获取 event (键盘事件) 的按键
        * @ property event: Object
        */
        function getCharacterFromKey(event) {
            var character = '';
            if (event.keyCode) {
                character = String.fromCharCode(event.keyCode);
            } else if (event.which) {
                character = String.fromCharCode(event.which);
            }
            return character;
        }
        /*
        * @ target 获取 event (鼠标事件) 的位置信息
        * @ property event: Object
        */
        function getMousePositionRelativeToDocument(event) {
            var x = 0, y = 0;
            if (event.pageX) {
                x = event.pageX;
                y = event.pageY;
            } else if (event.clientX) {
                x = event.clientX + doc.body.scrollLeft + docEl.scrollLeft;
                y = event.clientY + doc.body.scrollTop + docEl.scrollTop;
            }
            return {
                x: x,
                y: y
            }
        }
        /*
        * @ target 获取 event (鼠标事件) 的
        * @ property event: Object
        */
        function getMousePositionOffset(event) {
            var x = 0, y = 0;
            if (event.layerX) {
                x = event.layerX;
                y = event.layerY;
            } else if (event.offsetX) {
                x = event.offsetX;
                y = event.offsetY;
            }
            return {
                x: x,
                y: y
            }
        }
        /*
        * @ target 获取 event 的
        * @ property event: Object
        */
        function getRelatedTarget(event) {
            var relatedTarget = event.relatedTarget;
            if (event.type == 'mouseover') {
                relatedTarget = event.fromElement;
            } else if (event.type == 'mouseout') {
                relatedTarget = event.toElement;
            }
            return relatedTarget;
        }
    }




    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////
    ///////////////   NL 类的实例方法
    ///////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    _NL.addProto({
        each: function(fn){
            var arr = this.doms;
            arr.forEach(fn);
            return this;
        },
        getStyle: function(styleName){
            var styles = [];
            this.each(function(element){
                var style = '';
                if (window.getComputedStyle) {//W3C
                    style = element.ownerDocument.defaultView.getComputedStyle(element, null).getPropertyValue(staticMethod.utils.toHyphens(styleName));
                } else if (element.currentStyle) {//IE
                    style = element.currentStyle[NL.Utils.toCamelCase(styleName)];
                }
                styles.push(style);
            });
            return styles.length === 1 ? styles[0] : styles;
        },
        setStyle: function(styleObj){
            this.each(function(element){
                var s = styleObj, c = staticMethod.utils.toCamelCase;
                for (var key in s) {
                    element.style[c(key)] = s[key];
                }
            });
            return this;
        },
        addClass: function(className){
            var classNames = this.getClassNames(), len = this.doms.length;
            this.each(function(element, index){
                ////如果self.doms.length > 1 的话，className是一个二维数组
                ////==1则为一维数组，且有可能是个空数组 (原因的话，详见 getClassNames() 函数)
                var __classNames = len===1 ? classNames : classNames[index];
                if (!staticMethod.utils.isInArray(className, __classNames))
                    __classNames.push(className);
                element.className = __classNames.join(' ');
            });
            return this;
        },
        removeClass: function(className){
            var classNames = this.getClassNames();
            this.each(function(element, index){
                for (var i = 0, len = classNames[index].length; i < len; i++) {
                    if (className == classNames[index][i]) {
                        classNames[index].splice(i, 1);
                        break;
                    }
                }
                element.className = classNames[index].join(' ');
            });
            return this;
        },
        getClassNames: function(){
            var cns = [];
            this.each(function(element){
                var classNames = [],
                classes = element.className.replace(/\s+/g, ' ');
                if (element.className) {
                    classNames = classes.split(' ');
                }
                cns.push(classNames);
            });
            return cns.length ==1 ? cns[0] : cns;
        },
        getPosition: function(){
            var poses = [];
            this.each(function(element, i){
                var x = 0, y = 0;
                var elementBackup = element;
                if (element.offsetParent) {
                    do {
                        x += element.offsetLeft;
                        y += element.offsetTop;
                    } while (element = element.offsetParent);
                }
                poses.push({
                    x: x,
                    y: y,
                    height: elementBackup.offsetHeight,
                    width: elementBackup.offsetWidth
                });
            });
            return poses.length == 1 ? poses[0] : poses;

        },
        hasClass: function (className, isAllHas) {
            //其实在 each 函数中 只需 match++ 也可，但下面的判断 是为了 快速 return 而不用等待 forEach 全部循环
            var classNames = this.getClassNames(), match = 0;
            this.each(function(el,index){
                if(staticMethod.utils.isInArray(className, classNames[index])){
                    match++;
                    if(!isAllHas)
                        return true;
                }else if(isAllHas)
                    return false;
            });
            if(match == 0)
                return false;
            else if(match == classNames.length)
                return true;
            else
                return !isAllHas ? true : false;
        },
        //////////==========================================================================
        //////////
        ////////// 事件 on off
        //////////
        //////////==========================================================================
        /*
        * @ target 针对 DOM 的 添加 事件的方法
        * @ return handlerId
        * @ note 详见 tempEventContainter
        */
        on: function(type, fn_id){
            return tempEventContainter.on.call(this, type, fn_id);
        },
        off: function(type, fn_id){
            tempEventContainter.off.call(this, type, fn_id);
        }
    });
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////
    ///////////////   NL 最后的操作
    ///////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    _NL.addStatic(staticMethod);
    window.NL = _NL;

})(window);
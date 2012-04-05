/**
 * @ require ExtendJs.js
 * @ means NL Naruto & Luffy
 * @ author peichao01
 * @ date 2011-12-28
 * @ last-change 2012-01-11
 *
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
    var doc = win.document,
        docEl = doc.documentElement;

    window.NL = window.NL || {};

    /**
    * @ target 创建一个类的实例
    * @ property className: Function 类名/构造函数
    * @ property [ Main's params: Mixin ] 此类 Main 函数的参数
    * @ e.g. 
    *		var instance = NL.create(ClassName, constructorParams);
    */
    NL.create = function (className, MainParams) {
        var instance = (typeof className === 'function') ? (new className()) : (eval('new ' + className));
        var args = [].slice.call(arguments, 1);
        args.unshift(instance);
        return Object.construct.apply(win, args);
    };

    /**
    * @ target 判断DOM加载完毕
    * @ property callback
    * @ property enableFF2 [optional] 设置是否在FF2下使用DOMContentLoaded（在FF2下的特定场景有Bug）
    * @ url http://varnow.org/?p=77 //参考来源
    */
    //未完！
    NL.onDomReady = function (callback, enableFF2) {
        var isReady = false;
        function doReady() {
            if (isReady) return;
            //确保onready只执行一次
            isReady = true;
            callback();
        }
        if (NL.Browser.isIE) {
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
        } else if (NL.Browser.isWebkit && NL.Browser.webkitVersion < 525) {
            (function () {
                if (isReady) return;
                if (/load|complete/.test(document.readyState))
                    doReady();
                else
                    setTimeout(arguments.callee, 0);
            })();
            NL.Events.on(win, 'load', doReady);
        } else {
            if (!NL.Browser.isFF || NL.Browser.version != 2 || enableFF2) {
                NL.Events.on(doc, 'DOMContentLoaded', function (e) {
                    NL.Events.off(doc, 'DOMContentLoaded', arguments.callee);
                    doReady();
                });
            }
            NL.Events.on(win, 'load', doReady);
        }
    }

    /**
    * @ target 浏览器的信息
    * @ 
    */
    NL.Browser = (function () {
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
    })();

    /**
    * @ target 管理cookie
    *
    * @ method setCookie
    * @ method getCookie
    * @ method killCookie
    */
    NL.Cookie = {
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
    };

    /**
    * @ target 处理与节点相关的事务
    *
    * @ method create ------------------创建节点
    * @ method byId --------------------根据 id 选择元素
    * @ method byClass -----------------根据 class 选择元素，返回数组
    * @ method firstChild --------------第一个子元素
    * @ method lastChild ---------------最后一个子元素
    * @ method prevElement -------------上一个兄弟元素
    * @ method nextElement -------------下一个兄弟元素
    * @ method getUsBrothers -----------获取所有同级元素，包括自身
    * @ method getSiblings -------------获取所有其他兄弟节点
    * @ method getIndex ----------------获取自己在兄弟节点中的索引
    * @ method isForefatherNode --------判断是否是祖先节点
    *
    * @ method append ------------------往节点的末尾添加内容（Element || '<div></div>'）
    * @ method prepend -----------------往节点的首部添加内容（Element || '<div></div>'）
    *
    */
    NL.Elements = {
        /**
        * @ target 创建节点
        * @ property ElementTagName: String
        * @ return NL.Elements 的一个副本，以便与链式调用
        */
        create: function (ElementTagName) {
            return document.createElement(ElementTagName);
        },
        /**
        * @ target 根据ID 选择元素
        * @ return 选中的元素
        */
        byId: function (id) {
            return document.getElementById(id);
        },
        /**
        * @ target 根据 class 获取节点
        * @ property className: String 要选择的类名
        * @ property [ filterNode: Element ] 从此类下面的开始获取节点
        * @ return Array || NodeList || HTMLElementCollection
        */
        byClass: function (className, filterNode) {
            filterNode = filterNode || document;
            if (document.getElementsByClassName)
                return filterNode.getElementsByClassName(className);
            else {
                var classElements = new Array();
                var els = filterNode.getElementsByTagName('*');
                var elsLen = els.length;
                var pattern = new RegExp("(^|\\s)" + className + "(\\s|$)");
                for (i = 0, j = 0; i < elsLen; i++) {
                    if (pattern.test(els[i].className)) {
                        classElements[j] = els[i];
                        j++;
                    }
                }
                return classElements;
            }
        },
        /**
        * @ target 获取第一个非text元素的子元素
        * @ property dom: Element 
        * @ return dom: Element
        */
        firstChild: function (dom) {
            var f = dom.firstChild;
            return f.nodeType == 3 ? f.nextSibling : f;
        },
        lastChild: function (dom) {
            var l = dom.lastChild;
            return l.nodeType == 3 ? l.previousSibling : l;
        },
        prevElement: function (dom) {
            var p = dom.previousSibling;
            return p.nodeType == 3 ? p.previousSibling : p;
        },
        nextElement: function (dom) {
            var n = dom.nextSibling;
            return n.nodeType == 3 ? n.nextSibling : n;
        },
        /**
        * @ target 获取参数节点的兄弟节点
        * @ property dom: Element 要查看的元素
        * @ property [ options: Object ] 
        *       {
        *           tagName: tagName,  //只在标签都为此tagName的元素中选择
        *           className: className  //只在类名都为此className的元素中选择
        *       }
        *
        * @ note 在遇到 script 标签时，有错误：无法获取 script 标签下面的兄弟节点
        *
        * @ return siblings: Array
        */
        getUsBrothers: function (dom, options) {
            options = options || {};
            var pa = dom.parentNode,
                children = pa.childNodes,
                tag = options.tagName,
                cls = options.className,
                i = 0,
                temp = [],
                siblings = [];
            for (i = 0; i < children.length; i++) {
                if (children[i].nodeType !== 3)
                    siblings.push(children[i]);
            }
            if (tag) {
                temp = [];
                for (i = 0; i < siblings.length; i++) {
                    if (siblings[i].tagName.toLowerCase() === tag.toLowerCase())
                        temp.push(siblings[i]);
                }
                siblings = temp;
            }
            if (cls) {
                temp = [];
                for (i = 0; i < siblings.length; i++) {
                    if (NL.CSS.hasClass(siblings[i], cls))
                        temp.push(siblings[i]);
                }
                siblings = temp;
            }
            return siblings;
        },
        getSiblings: function (dom, options) {
            var siblings = this.getUsBrothers(dom, options);
            var temp = [];
            for (var i = 0; i < siblings.length; i++) {
                if (siblings[i] !== dom) {
                    temp.push(siblings[i]);
                }
            }
            return temp;
        },
        /**
        * @ target 获取参数节点在兄弟节点是第几个元素
        * @ property dom: Element 要查看的元素
        * @ property [ options: Object ] 
        *       {
        *           tagName: tagName,  //只在标签都为此tagName的元素中定位索引
        *           className: className  //只在类名都为此className的元素中定位索引
        *       }
        *
        * @ note 在遇到 script 标签时，有错误：无法获取 script 标签下面的兄弟节点
        *
        * @ return index: String
        */
        getIndex: function (dom, options) {
            var siblings = this.getSiblings(dom, options);
            for (var i = 0; i < siblings.length; i++) {
                if (siblings[i] === dom) {
                    return i;
                }
            }
            return -1;
        },
        /**
        * @ target 检查是否是祖先节点
        * @ property childEl: Element 需要检查的子节点
        * @ property forefatherEl: Element （可能的）参数1的祖先节点
        */
        isForefatherNode: function (childEl, forefatherEl) {
            if (childEl === win || childEl === doc)
                throw new TypeError('custom: the first argument must be a child Element of document.');
            while (childEl.parentNode !== doc) {
                if (forefatherEl === childEl)
                    return true;
                childEl = childEl.parentNode;
            }
            return false;
        },
        /**
        * @ target 往节点的末尾追加内容
        * @ property ElementOrHtmlString: Element || String
        */
        append: function (dom, ElementOrHtmlString) {
            if (NL.Utils.isString(ElementOrHtmlString)) {
                var d = NL.Elements.create('div');
                d.innerHTML = ElementOrHtmlString;
                var f = NL.Elements.firstChild(d);
                dom.appendChild(f);
                d = f = null;
            } else {
                dom.appendChild(ElementOrHtmlString);
            }
        },
        /**
        * @ target 往节点的首部追加内容
        * @ property ElementOrHtmlString: Element || String
        */
        prepend: function (dom, ElementOrHtmlString) {

        }
    }

    /**
    * @ target 处理 CSS 相关的事务
    *
    * @ method getAppliedStyle ---------获取元素的指定样式的值
    * @ method getArrayOfClassNames ----获取指定元素的类，返回类的数组
    * @ method addClass ----------------添加 class
    * @ method removeClass -------------移除 class
    * @ method hasClass ----------------判断 指定元素是否拥有指定的 class
    * @ method getPosition -------------获取指定元素的 x y height width 信息
    * @ method setStyle ----------------给指定元素添加 样式
    * 
    */
    NL.CSS = {
        /**
        * @ target 或许指定元素的指定样式
        * @ property element: Element 
        * @ property styleName: String
        */
        getAppliedStyle: function (element, styleName) {
            var style = '';
            if (window.getComputedStyle) {//W3C
                style = element.ownerDocument.defaultView.getComputedStyle(element, null).getPropertyValue(NL.Utils.toHyphens(styleName));
            } else if (element.currentStyle) {//IE
                style = element.currentStyle[NL.Utils.toCamelCase(styleName)];
            }
            return style;
        },
        /**
        * @ target 获取指定元素的 Class
        * @ property element: Element 
        * @ return Classes: Array
        */
        getArrayOfClassNames: function (element) {
            var classNames = [],
            classes = element.className.replace(/\s+/g, ' ');
            if (element.className) {
                classNames = classes.split(' ');
            }
            return classNames;
        },
        /**
        * @ target 给元素添加类
        * @ property element: Element 
        * @ property className: String
        */
        addClass: function (element, className) {
            var classNames = this.getArrayOfClassNames(element);
            classNames.push(className);
            element.className = classNames.join(' ');
        },
        /**
        * @ target 给元素移除类
        * @ property element: Element 
        * @ property className: String
        */
        removeClass: function (element, className) {
            var classNames = this.getArrayOfClassNames(element);
            for (var index = 0, len = classNames.length; index < len; index++) {
                if (className == classNames[index]) {
                    classNames.splice(index, 1);
                    break;
                }
            }
            element.className = classNames.join(' ');
        },
        /**
        * @ target 检查指定元素是否拥有指定的类
        * @ property element: Element 
        * @ property className: String
        */
        hasClass: function (element, className) {
            var isClassNamePresent = false;
            var classNames = this.getArrayOfClassNames(element);
            for (var i = 0, len = classNames.length; i < len; i++) {
                if (className == classNames[i]) {
                    isClassNamePresent = true;
                    break;
                }
            }
            return isClassNamePresent;
        },
        /**
        * @ target 获取指定元素的 x y height width 信息
        * @ property element: Element 
        * @ property className: String
        */
        getPosition: function (element) {
            var x = 0, y = 0;
            var elementBackup = element;
            if (element.offsetParent) {
                do {
                    x += element.offsetLeft;
                    y += element.offsetTop;
                } while (element = element.offsetParent);
            }
            return {
                x: x,
                y: y,
                height: elementBackup.offsetHeight,
                width: elementBackup.offsetWidth
            };
        },
        /*
        * @ target 设置目标DOM 的样式
        * @ property dom: Element 需要设置样式的 DOM
        * @ property styleObj: Object 样式对象
        */
        setStyle: function (dom, styleObj) {
            if (NL.Utils.isArray(dom)) {
                for (var i = 0, len = dom.length; i < len; i++) {
                    applyStyle(dom[i]);
                }
            } else {
                applyStyle(dom);
            }
            function applyStyle(dom) {
                for (var key in styleObj) {
                    dom.style[NL.Utils.toCamelCase(key)] = styleObj[key];
                }
            }
        }
    };

    /*
    * @ target Ajax 通用方法
    * @ property method: String 'GET' || 'POST' //不区分大小写
    * @ property url: String 请求的url，无论是get或post，这里只需写纯粹的url即可
    * @ property callback: Function 回调函数
    * @ property data: Object 需要传递的值，以map的形式传递，函数内自动根据get 或 post 发送
    *
    */
    NL.ajax = function (method, url, callback, data) {
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
    };

    /**
    * @ target JSON 相关
    * @ method parse 把字符串解析为JSON
    * @ method 
    * 
    */
    NL.JSON = {
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
    };

    /**
    * @ target 事件管理
    * @ method listen ------------- non-DOM 的监听事件的方法
    * @ method remove ------------- non-DOM 的移除事件的方法
    * @ method trigger ------------ 发出事件
    * @ method on ----------------- 针对 DOM 的 添加 事件的方法
    * @ method off ---------------- 针对 DOM 的 移除 事件的方法
    */
    NL.Events = new function () {
        var events = {},
            handlerId = 0;
        /*
        * @ target non-DOM 的监听事件的方法
        * @ property eventType: String 监听的事件类型
        * @ property callback: Function 监听的事件
        */
        this.listen = function (eventType, callback) {
            callback.id = handlerId++;
            if (!events[eventType])
                events[eventType] = [];
            events[eventType].push(callback);
            return callback.id;
        };
        /*
        * @ target non-DOM 的移除事件的方法
        * @ property eventType: String 移除的事件类型
        * @ property callback: Function 同 listen
        */
        this.remove = function (eventType, callback_or_id) {
            if (events[eventType]) {
                var ci = callback_or_id;
                for (var i = 0, len = events[eventType].length; i < len; i++) {
                    if (((typeof ci == 'number') && events[eventType][i].id == ci) || ((typeof ci == 'function') && events[eventType][i] == ci)) {
                        events[eventType].splice(i, 1);
                        return;
                    }
                }
            }
        };
        /*
        * @ target non-DOM 的移除一定类型的全部事件
        * @ property eventType: String 移除的事件类型
        */
        this.removeAll = function (eventType) {
            if (events[eventType]) {
                delete events[eventType];
            }
        }
        /*
        * @ target 发出事件
        * @ property eventType: String 事件的名字
        * @ property [ params: Mixin ] 执行函数时，传递的参数
        * @ property [ scope: Object ] 执行函数时，可以传递作用域内 this 对象
        */
        this.fire = function (eventType, params, scope) {
            scope = scope || window;
            if (events[eventType]) {
                for (var i = 0, len = events[eventType].length; i < len; i++) {
                    events[eventType][i].call(scope, params);
                }
            }
        };

        /*
        * @ target 针对 DOM 的 添加 事件的方法
        * @ property dom: Element 有侦听需求的元素
        * @ property type: String 事件的名字
        * @ property fn: Function 侦听函数
        *
        * @ e.g. NL.Events.on(dom, 'click', fn);
        * @ e.g. NL.Events.on(dom, { click: fn, mouseout: fn })
        */
        this.on = function (dom, type, fn) {
            if (typeof type === 'string') {
                addEvent(dom, type, fn);
            } else {
                var _events = type;
                for (type in _events) {
                    fn = _events[type];
                    addEvent(dom, type, fn);
                }
            }
        };

        /*
        * @ target 针对 DOM 的 移除 事件的方法
        * @ property dom: Element 有移除侦听需求的元素
        * @ property type: String 事件的名字
        * @ property fn: Function 侦听函数
        */
        this.off = function (dom, type, fn) {
            if (typeof type === 'string') {
                removeEvent(dom, type, fn);
            } else {
                var _events = type;
                for (type in _events) {
                    removeEvent(dom, type, _events[type]);
                }
            }
        };
        /**
        * @ target 还是把事件委托分离出来吧
        * @ property filter: String CSS过滤子元素 || 目前只支持 class
        *
        * @ note 目前 filter 仅支持 className
        * @ Important 需要重写：现在是用 target 来判断，但如果元素很多层，应该判断事件冒泡各个阶段所经过的元素
        */
        this.delegate = function (filter, dom, type, fn) {
            fn.realHandler = tempHandler;
            this.on(dom, type, tempHandler);

            function tempHandler(e) {
                e = standardize(e);
                if (e.target.className == filter) {
                    fn.call(dom, e);
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
        * @ note 包装一层，把真正的侦听器的手柄作为传进来的fn的属性保存，以便到时移除
        */
        function addEvent(dom, type, fn) {
            fn.realHandler = handler; //*** @ note
            if (dom.addEventListener) {
                dom.addEventListener(type, handler, false);
            } else {
                dom.attachEvent('on' + type, handler);
            }
            function handler(e) {
                e = standardize(e);
                fn.call(dom, e);
            }
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
                relatedTarget: getRelatedTarget(event),
                key: getCharacterFromKey(event),
                pageX: page.x,
                pageY: page.y,
                offsetX: offset.x,
                offsetY: offset.y,
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
    };

    /**
    * @ target 工具集
    * @ method toHyphens ---------- 把驼峰格式的字符串转换为连线格式 --> how-are-you
    * @ method toCamelCase -------- 把连线格式的字符串转换为驼峰格式 --> howAreYou
    * @ method replaceText -------- 替换字符串中特定的 元素
    * @ method getType ------------ 返回参数的数据类型
    */
    NL.Utils = {
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
        getStdTime: function () {
            var date = this.getFullDate();
            return date.substring(date.indexOf(' ') + 1);
        },
        getStdDate: function () {
            var date = this.getFullDate();
            return date.substring(0, date.indexOf(' '));
        }
    };

    /**
    * @ target 针对IE的，替代 alert 的控制台
    * @ method log 输出字符
    * @ method logObj 输出对象
    * @ method setHeight 设置控制台高度
    * @ method clear 清空控制台
    */
    NL.console = {
        _log: function (msg) {
            if (win.console && console.log) {
                console.log(msg);
            } else {
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
        log: function (obj) {
            if (win.console && console.log) {
                console.log(obj);
            } else if (NL.Utils.isOriginObject(obj)) {
                for (var key in obj) {
                    NL.console._log(key + ' : ' + obj[key]);
                }
            } else {
                NL.console._log(obj);
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
    };


    /**
    * @ target 根据ID 选择元素
    * @ return 选中的元素
    */
    NL.$ = NL.Elements.byId;
    //NL.$$ = Sizzle //用的 Sizzle 作为CSS选择器

})(window);

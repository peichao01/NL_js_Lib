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
 * @ last-change 2012-02-23 23:09  -------  下一步，把 绑定事件 的事件对象，加上 命名空间，如：NL.on('box.click'); NL.on('toolbar.click'); NL.on('click');
 *
 * @ project ExtendsJs.js
 * @ structor
 ************************* prototype ***************
 ****** String.trim
 ****** Array.forEach
 ****** Array.filter
 ****** Array.map
 ****** Array.indexOf
 ****** Array.combine
 ****** Array.bealone
 ****** Array.remove
 ****** Array.reverse
 ****** Function.bind
 ****** Function.method
 ****** Function.inherite
 ****** ****************** static method *************
 ****** Object.forEach
 ****** Object.map
 ****** Object.create
 ****** Object.construct
 ****** Object.merge
 */

 /**
 * @ target 对Object的各元素执行一个函数
 * @ property fn:Function
 * 
 */
if(!Object.forEach){
    Object.forEach = function(_object, fn, thisObj){
        var scope = thisObj || window;
        for(var key in _object){
            //if(_object.hasOwnProperty(key))
                fn.call(scope, key, _object[key], _object);
        }
    }
}
if(!Object.map){
    Object.map = function(_object,fn, thisObj){
        if (typeof fn != "function")
            throw new TypeError();
        var scope = thisObj || window, result = {};
        for(var key in _object){
            result[key] = fn.call(scope,key, _object[key], _object);
        }
        return result;
    }
}
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
* @ target 移除数组中指定的元素，如果不存在则返回  -1
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
* @ target 把参数数组合并到 此数组中
* @ property array: Array
* @ return original array 原始数组--扩展后的
*/
if (!Array.prototype.combine) {
    Array.prototype.combine = function (array) {
        for(var i=0,len=array.length; i<len; i++){
            this.push(array[i]);
        }
    };
}
/**
* @ target 剔除数组内部的相同元素
* @ return new array 
*/
if (!Array.prototype.bealone) {
    Array.prototype.bealone = function () {
        var arr = [];
		this.forEach(function(ele){
			if(arr.indexOf(ele) == -1)
				arr.push(ele);
		});
		return arr;
    };
}
/**
* @ target 数组翻转
* @ return new array 
*/
if (!Array.prototype.reverse) {
    Array.prototype.reverse = function () {
        var arr = [];
		this.forEach(function(ele){
			arr.unshift(ele);
		});
		return arr;
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
* @ property [ Main_para : Mixin ] 构造函数需要的参数
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
* @ property prototypes: Object 方法的名字
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
*       1. function.addStatic('eat', fn);
*       2. function.addStatic({ eat: fn, sleep: fn2 });
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
* @ //note 继承之后，再把constructor重置回来
* @ last-change: 2012-1-31
*/
if(!Function.prototype.inherite){
    Function.prototype.inherite = function (Class) {
        if (typeof Class != 'function')
            throw new TypeError('custom: argument Class should be a Function.');
        //1. 
        this.prototype = new Class();
        //2. 这两种哪个更好？
        /*var ins = new Class();
        for (var key in ins) {
            if (override || !this.prototype[key])
                this.prototype[key] = ins[key];
        }*/
        this.prototype.constructor = this; //*** @ note
    }
}

/**
* @ require ExtendJs.js
* @ means NL Naruto & Luffy
* @ author peichao01
* @ date 2011-12-28
* @ last-change 2012-01-30 23:01
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
****** NL.exec
****** NL.console
*/
(function (win, undefined) { 
    var doc = win.document, docEl = doc.documentElement,
        isTagReg = /<\w+.*>/;
    var inner_cache = {
        static_fn:{},
        instance_fn:{}
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////
    ///////////////   NL 核心
    ///////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var _NL = (function(){
		var $ = function(selector, context){
			return new $.fn.init(selector, context);
		}

        $.addProto({
            init: function(selector, context, results, seed){
                if(!NL.$) throw new Error('custom : must load NL_sizzle.js first!');
                if(selector.nodeType !== undefined || selector == win) this.doms = new Array(selector);//如果传进来的是一个Element
                else if(staticMethod.utils.isArray(selector) && selector[0].nodeType!==undefined) this.doms = selector;
                else if(isTagReg.test(selector)) this.doms = staticMethod.elements.create(selector);
				else if(selector.isNLObject == true) return selector;
				else this.doms = NL.$(selector, context);
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
        /*getJsonP 使用*/
        cache: {},
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
            //1. Object.construct 用一个空函数做中介，打乱了对象与构造器的关系
            /*args.unshift(instance);
            return Object.construct.apply(win, args);*/
            //2. 比较简单的方法
            if(instance.Main)
                instance.Main.apply(instance, args);
            return instance;
        },
        elements: {
            /**
            * @ target 创建节点
            * @ property TagOrHtml : String 
            *       1. 含有'<..>'的，认为是HTML字符串
            *       2. 其余的，认为是 tag 标签名
            * @ return Element || Array[ EL, EL... ]
            * @ e.g.
            *      create('div');
            *      create('<div>content</div>');
            */
            // NL('<div>..</div>') 是一个简化版的 create
            create: function (TagOrHtml) {
                if (isTagReg.test(TagOrHtml)) {
                    var div = this.create('div');
                    div.innerHTML = TagOrHtml;
                    var c = this.getChildren(div); div = null;
                    return c;
                } else {
                    return document.createElement(TagOrHtml);
                }
            },
            /*
            * @ target 判断是否是 空白文本节点
            */
            isWhiteTextNode: function (node) {
                //return node.nodeType === 3 && /^\s*$/.test(node.nodeValue);
                return node.nodeType === 3 && !(/\S/.test(node.nodeValue));
            },
            /**
            * @ target 获取 dom 元素的第 index 个子元素
            * @ property dom: Element 
            * @ property index: Number 
            
            * @ property filters: Object 参见 nodeListFilter

            * @ property [ notCareTextNode : Boolean  ]
            * @ return child : Element
            */
            getChild: function (dom, index, filters, notCareTextNode) {
                var ch = this.getChildren(dom, filters, !notCareTextNode);
                return staticMethod.utils.getItem(ch,index);
            },
            /**
            * @ target 获取 dom 元素的所有子节点
            * @ property dom: Element 
            
            * @ property filters: Object 参见 nodeListFilter

            * @ property keepTextNode = true : Boolean 是否保留 文本节点元素（nodeType == 3）|| 默认 true
            * @ return children : Array 
            */
            getChildren: function (dom, filters, keepTextNode) {
                if (keepTextNode == undefined) keepTextNode = true;
                var children = (function (self) {
                    var c = dom.childNodes, len = c.length, kt = keepTextNode, t = [], j = 0;
                    for (i = 0; i < len; i++) {
                        /*
                        * 因为空白文本节点 是毫无用处的，所以，此函数永远会过滤掉它
                        * 如果不保留文本节点，则要筛选 nodeType 是否 为 3
                        * 如果保留，则，同时判断 是否是空白的文本节点
                        */
                        if (!kt && c[i].nodeType !== 3) {
                            t[j] = c[i];
                            j++;
                        } else if (kt && !self.isWhiteTextNode(c[i])) {
                            t[j] = c[i];
                            j++;
                        }
                    }
                    return t;
                })(this);

                return this.nodeListFilter(children, filters);
            },
            /**
            * @ target 获取第一个非text元素的子元素
            * @ property dom: Element 
            * @ return dom: Element
            */
            firstChild: function (dom) {
                return (this.getChildren(dom))[0];
            },
            lastChild: function (dom) {
                var c = this.getChildren(dom);
                return c[c.length - 1];
            },
            prevElement: function (dom) {
                var p = dom.previousSibling;
                return n===null ? n : (this.isWhiteTextNode(p) ? arguments.callee(p) : p);
            },
            nextElement: function (dom) {
                var n = dom.nextSibling;
                return n===null ? n : (this.isWhiteTextNode(n) ? arguments.callee(n) : n);
            },
            /**
            * @ target 过滤结果集 className tagName
            * @ property doms: Array of Elements
            * @ property [ filters: Object ] 
            *       {
            *           tagName: tagName || Array ,  //只在标签都为此tagName的元素中选择
            *           className: className || Array,  //只在类名都为此className的元素中选择
            *           noTag: tagName || Array,  //不包含的 tag
            *           noClass: className || Array  //不包含的 className
            *       }
            *
            * @ return doms: Array of Elements
            */
            nodeListFilter: function(doms, filters){
                filters = filters || {};
                var tag = filters.tagName,
                    cls = filters.className,
                    noTag = filters.noTag,
                    noClass = filters.noClass,
                    i,temp;
                if (tag) {
                    var tags = NL.utils.isArray(tag) ? tag : [tag];
                    tags.map(function(el){return el.toLowerCase();});
                    temp = [];
                    doms.forEach(function(dom){
                        if(NL.utils.isInArray(dom.tagName.toLowerCase(), tags))
                            temp.push(dom);
                    });
                    doms = temp;
                }
                if(noTag){
                    var noTags = NL.utils.isArray(noTag) ? noTag : [noTag];
                    noTags.map(function(el){return el.toLowerCase();});
                    temp = [];
                    doms.forEach(function(dom,index){
                        if(!NL.utils.isInArray(dom.tagName.toLowerCase(), noTags))
                            temp.push(dom);
                    });
                    doms = temp;
                }
                if (cls) {
                    var classes = NL.utils.isArray(cls) ? cls : [cls];
                    temp = [];
                    doms.forEach(function(dom){
                        classes.forEach(function(_class){
                            if(NL(dom).hasClass(_class))
                                temp.push(dom);
                        });
                    });
                    doms = temp;
                }
                if(noClass){
                    var noClasses = NL.utils.isArray(noClass) ? noClass : [noClass];
                    temp = [];
                    doms.forEach(function(dom){
                        noClasses.forEach(function(_class){
                            if(!NL(dom).hasClass(_class))
                                temp.push(dom);
                        });
                    });
                    doms = temp;
                }
                return doms;
            },
            /**
            * @ target 获取参数节点的兄弟节点
            * @ property dom: Element 要查看的元素
            * @ property [ filters: Object ] 
            *       {
            *           tagName: tagName,  //只在标签都为此tagName的元素中选择
            *           className: className  //只在类名都为此className的元素中选择
            *       }
            *
            * @ note 在遇到 script 标签时，有错误：无法获取 script 标签下面的兄弟节点
            *
            * @ return siblings: Array
            */
            getUsBrothers: function (dom, filters) {
                var children = NL.utils.toRealArray(this.getChildren(dom.parentNode));
                
                return this.nodeListFilter(children, filters);
            },
            getSiblings: function (dom, filters) {
                var siblings = this.getUsBrothers(dom, filters);
                for (var i = 0; i < siblings.length; i++) {
                    if (siblings[i] === dom)
                        break;
                }
                siblings.splice(i, 1);
                return siblings;
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
                var siblings = this.getUsBrothers(dom, options);
                return staticMethod.utils.getIndex(dom, siblings);
            },
            /**
            * @ target 检查是否是祖先节点
            * @ property childEl: Element 需要检查的子节点
            * @ property forefatherEl: Element （可能的）参数1的祖先节点
            */
            isChildNode: function (childEl, parentsEl) {
                if (childEl === win || childEl === doc)
                    throw new TypeError('custom: the first argument must be a child Element of document.');
                while (childEl.parentNode !== doc) {
                    if (parentsEl === childEl)
                        return true;
                    childEl = childEl.parentNode;
                }
                return false;
            },
            /**
            * @ target 往节点的末尾追加内容
            * @ property El_Arr_Html: Element || Array || String
            *       1. 含有 '<..>' 的字符串
            *       2. 数组 [ El, '<div>..</div>', El... ]
            *       3. Element 元素
            */
            append: function (dom, El_Arr_Html) {
                this.insert(dom, El_Arr_Html);
            },
            /**
            * @ target 往节点的首部追加内容
            * @ property ElementOrHtmlString: Element || String
            */
            prepend: function (dom, El_Arr_Html) {
                this.insert(dom, El_Arr_Html, 0);
            },
            /*
            * @ target 往 dom 节点中第 index 位插入子节点
            *
            * @ note 此为基础方法，常用的为 prepend || append 往首部和末尾追加元素
            *
            * @ property dom : Element
            * @ property El_Arr_Html: Element || Array || String
            *       1. 含有 '<..>' 的字符串
            *       2. 数组 [ El, '<div>..</div>', El... ]
            *       3. Element 元素
            * @ property index: Number 要插入的位置 || 如果省略，为 undefined，则在末尾追加，相当于 appendChild
            * @ e.g.
            *       insert(dom, '<div>1</div>2<b>o3</b>', 2);
            *       insert(dom, ['div'], 0);
            *       insert(dom, El);
            */
            insert: function (dom, El_Arr_Html, index) {
                var isString = staticMethod.utils.isString(El_Arr_Html);
                var isArray = staticMethod.utils.isArray(El_Arr_Html);
                if (isString) {
                    var c = this.create(El_Arr_Html);
                    this.insert(dom, c, index);
                } else if (isArray) {
                    for (var i = 0, len = El_Arr_Html.length; i < len; i++) {
                        index === undefined ? this.insert(dom, El_Arr_Html[i]) : this.insert(dom, El_Arr_Html[i], index + i);
                    }
                } else {
                    var isIndexNumber = staticMethod.utils.isNumber(index);
                    var isIndexUndefined = staticMethod.utils.isUndefined(index);
                    if (isIndexNumber) {
                        var f = this.getChild(dom, index);
                        dom.insertBefore(El_Arr_Html, f);
                    } else if (isIndexUndefined) {
                        //dom.insertBefore(El_Arr_Html);//FF && Opera 必须有两个参数
                        dom.appendChild(El_Arr_Html);
                    }
                }
            }
        },
        /**
        * @ target 判断DOM加载完毕
        * @ property cssPath: String CSS文件的路径
        * @ property [ isPath: Boolean ] 是文件路径，或者 直接写 CSS 内容
        */
        addCss: function(cssPath, isPath){
            if(NL.utils.isUndefined(isPath)) isPath = true;
            var head = doc.getElementsByTagName('head')[0];
            if(isPath){
                if(doc.createStyleSheet){
                    document.createStyleSheet(cssPath,1);
                }else{
                    var link = doc.createElement('link');
                    link.setAttribute('rel','stylesheet');
                    link.setAttribute('type', 'text/css');
                    link.setAttribute('href', cssPath);
                    head.appendChild(link);
                }
            }else{
                var style = document.createElement('style');
                style.type="text/css";
                try{
                    style.appendChild(doc.createTextNode(cssPath));
                }catch(e){
                    style.styleSheet.cssText = cssPath;
                }
                head.appendChild(style);
            }
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
                NL(win).on('load', doReady);
            } else if (this.browser.isWebkit && this.browser.webkitVersion < 525) {
                (function () {
                    if (isReady) return;
                    if (/load|complete/.test(document.readyState))
                        doReady();
                    else
                        setTimeout(arguments.callee, 0);
                })();
                NL(win).on('load', doReady);
            } else {
                if (!this.browser.isFF || this.browser.version != 2 || enableFF2) {
                    var id = NL(doc).on('DOMContentLoaded',function(e){
                        staticMethod_events.off(id);
                        doReady();
                    });
                }
                NL(win).on('DOMContentLoaded',doReady);
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
        cookie: {
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
        * @ target AJAX 异步请求
        *
        * @ property method: String GET || POST
        * @ property url: String 请求的地址
        * @ property callback: Fucntion 回调
        * @ property data: Object 发送的数据
        *
        * @ return ID: Object { xhr: xhr, stop: fn }
        */
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
                    callback.call(xhr, xhr.responseText, xhr.responseXML);
                }
            }
            if (method == 'GET') {
                url = staticMethod.utils.dataToUrl(data || {}, url);
                data = null;
            } else if (method == 'POST') {
                data = staticMethod.utils.dataToUrl(data);
            }
            xhr.open(method, url, true);
            if(method == 'POST') xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhr.send(data);

            return {
                'xhr':xhr,
                'stop': function(){
                    xhr.abort();
                }
            };
        },
        getJson: function(url,fn,data){
            var self = this;
            var ID = this.ajax('get',url,function(data){
                fn.call(this, self.JSON.parse(data));
            },data);

            return {
                'xhr': ID.xhr,
                'stop':ID.stop
            }
        },
        /*
        * @ server code: PHP: 
        *       $script = $_GET['callback'];
        *       .......//the content of the Script 
        *   at last: 
        *       echo $script.'('.sth.')';
        */
        getJsonP: function(url, fn){
            if(!NL.cache.getScript) NL.cache.getScript = {};
            var name = (new Date).getTime();
            NL.cache.getScript[name] = fn;

            url = staticMethod.utils.dataToUrl({callback: "NL.cache.getScript['"+name+"']"}, url);
            var sc = document.createElement('script');
            sc.type = 'text/javascript';
            sc.src = url;
            document.getElementsByTagName('head')[0].appendChild(sc);
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
                } catch (ex) {
                    try{
                        eval('var temp = ' + jsonStr);
                    }catch(ex){
                        throw new Error('NL: custom: Json is not in the correct format, the details is: ' + ex.Description);
                    }
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
                        if (staticMethod.utils.isArray(s)) {
                            result += '[';
                            for (var i = 0, len = s.length; i < len; i++) {
                                result += arguments.callee(s[i]) + ',';
                            }
                            result = result.substr(0, result.length - 1);
                            result += ']';
                        } else if (staticMethod.utils.isOriginObject(s)) {
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
        /*
         * -------- From jQuery 1.7.1 ------------------------
         * Create a callback list using the following parameters:
         *
         *	flags:	an optional list of space-separated flags that will change how
         *			the callback list behaves
         *
         * By default a callback list will act like an event callback list and can be
         * "fired" multiple times.
         *
         * Possible flags:
         *
         *	once:			will ensure the callback list can only be fired once (like a Deferred)
         *
         *	memory:			will keep track of previous values and will call any callback added
         *					after the list has been fired right away with the latest "memorized"
         *					values (like a Deferred)
         *
         *	unique:			will ensure a callback can only be added once (no duplicate in the list)
         *
         *	stopOnFalse:	interrupt callings when a callback returns false
         *
         */
        Callbacks : (function(){
            // String to Object flags format cache
            var flagsCache = {};

            // Convert String-formatted flags into Object-formatted ones and store in cache
            function createFlags( flags ) {
	            var object = flagsCache[ flags ] = {},
		            i, length;
	            flags = flags.split( /\s+/ );
	            for ( i = 0, length = flags.length; i < length; i++ ) {
		            object[ flags[i] ] = true;
	            }
	            return object;
            }
            return function( flags ) {

	            // Convert flags from String-formatted to Object-formatted
	            // (we check in cache first)
	            flags = flags ? ( flagsCache[ flags ] || createFlags( flags ) ) : {};

	            var // Actual callback list
		            list = [],
		            // Stack of fire calls for repeatable lists
		            stack = [],
		            // Last fire value (for non-forgettable lists)
		            memory,
		            // Flag to know if list is currently firing
		            firing,
		            // First callback to fire (used internally by add and fireWith)
		            firingStart,
		            // End of the loop when firing
		            firingLength,
		            // Index of currently firing callback (modified by remove if needed)
		            firingIndex,
		            // Add one or several callbacks to the list
		            add = function( args ) {
			            var i,
				            length,
				            elem,
				            type,
				            actual;
			            for ( i = 0, length = args.length; i < length; i++ ) {
				            elem = args[ i ];
				            type = NL.utils.getType(elem).toLowerCase();//jQuery.type( elem );
				            if ( type === "array" ) {
					            // Inspect recursively
					            add( elem );
				            } else if ( type === "function" ) {
					            // Add if not in unique mode and callback is not in
					            if ( !flags.unique || !self.has( elem ) ) {
						            list.push( elem );
					            }
				            }
			            }
		            },
		            // Fire callbacks
		            fire = function( context, args ) {
			            args = args || [];
			            memory = !flags.memory || [ context, args ];
			            firing = true;
			            firingIndex = firingStart || 0;
			            firingStart = 0;
			            firingLength = list.length;
			            for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				            if ( list[ firingIndex ].apply( context, args ) === false && flags.stopOnFalse ) {
					            memory = true; // Mark as halted
					            break;
				            }
			            }
			            firing = false;
			            if ( list ) {
				            if ( !flags.once ) {
					            if ( stack && stack.length ) {
						            memory = stack.shift();
						            self.fireWith( memory[ 0 ], memory[ 1 ] );
					            }
				            } else if ( memory === true ) {
					            self.disable();
				            } else {
					            list = [];
				            }
			            }
		            },
		            // Actual Callbacks object
		            self = {
			            // Add a callback or a collection of callbacks to the list
			            add: function() {
				            if ( list ) {
					            var length = list.length;
					            add( arguments );
					            // Do we need to add the callbacks to the
					            // current firing batch?
					            if ( firing ) {
						            firingLength = list.length;
					            // With memory, if we're not firing then
					            // we should call right away, unless previous
					            // firing was halted (stopOnFalse)
					            } else if ( memory && memory !== true ) {
						            firingStart = length;
						            fire( memory[ 0 ], memory[ 1 ] );
					            }
				            }
				            return this;
			            },
			            // Remove a callback from the list
			            remove: function() {
				            if ( list ) {
					            var args = arguments,
						            argIndex = 0,
						            argLength = args.length;
					            for ( ; argIndex < argLength ; argIndex++ ) {
						            for ( var i = 0; i < list.length; i++ ) {
							            if ( args[ argIndex ] === list[ i ] ) {
								            // Handle firingIndex and firingLength
								            if ( firing ) {
									            if ( i <= firingLength ) {
										            firingLength--;
										            if ( i <= firingIndex ) {
											            firingIndex--;
										            }
									            }
								            }
								            // Remove the element
								            list.splice( i--, 1 );
								            // If we have some unicity property then
								            // we only need to do this once
								            if ( flags.unique ) {
									            break;
								            }
							            }
						            }
					            }
				            }
				            return this;
			            },
			            // Control if a given callback is in the list
			            has: function( fn ) {
				            if ( list ) {
					            var i = 0,
						            length = list.length;
					            for ( ; i < length; i++ ) {
						            if ( fn === list[ i ] ) {
							            return true;
						            }
					            }
				            }
				            return false;
			            },
			            // Remove all callbacks from the list
			            empty: function() {
				            list = [];
				            return this;
			            },
			            // Have the list do nothing anymore
			            disable: function() {
				            list = stack = memory = undefined;
				            return this;
			            },
			            // Is it disabled?
			            disabled: function() {
				            return !list;
			            },
			            // Lock the list in its current state
			            lock: function() {
				            stack = undefined;
				            if ( !memory || memory === true ) {
					            self.disable();
				            }
				            return this;
			            },
			            // Is it locked?
			            locked: function() {
				            return !stack;
			            },
			            // Call all callbacks with the given context and arguments
			            fireWith: function( context, args ) {
				            if ( stack ) {
					            if ( firing ) {
						            if ( !flags.once ) {
							            stack.push( [ context, args ] );
						            }
					            } else if ( !( flags.once && memory ) ) {
						            fire( context, args );
					            }
				            }
				            return this;
			            },
			            // Call all the callbacks with the given arguments
			            fire: function() {
				            self.fireWith( this, arguments );
				            return this;
			            },
			            // To know if the callbacks have already been called at least once
			            fired: function() {
				            return !!memory;
			            }
		            };

	            return self;
            }
        })(),
        utils : {
            /*
            * @ target 获得窗口的高度
            */
            getWindowHeight: function(){
                return win.innerHeight || docEl.clientHeight || doc.body.clientHeight;
            },
            /*
            * @ target 获得窗口的宽度
            */
            getWindowWidth: function(){
                return win.innerWidth || docEl.clienWidth || doc.body.clientWidth;
            },
            /*
            * @ target 角度弧度转换
            */
            angleToRadian: function(angleNum){
                return (2 * Math.PI) / 360 * angleNum;
            },
            radianToAngle: function(radianNum){
                return 360 / (2 * Math.PI) * radianNum;
            },
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
            /*
            * @ target 把字符串根据 空格（任何 >1 个连续的空格） 分割为数组
            * @ return new String
            */
            strSplitByWhitespace: function(str){
                if(NL.utils.isString(str))
                    return str.replace(/\s+/g, function () {return ' ';}).split(' ');
                else
                    return str;
            },
            /**
            * @ target 获取对象的 键 作为数组返回
            * @ return keys: Array
            * @ e.g. { left: 40, top: 50} => [left, top]
            */
            getKeys: function(obj){
                var temp = [];
                for(var key in obj){
                    temp.push(key);
                }
                return temp;
            },
            /**
            * @ target 把color值转换为 10进制值
            * @ return color: Array
            * @ e.g. 
            *       rgb(255,00,00) => [255,00,00]
            *       #ff0000 => [255,00,00]
            */
            parseColor: function(color){
                color = color.toLowerCase();
                var colors = [];
                if(color.match(/rgb\(/)){
                    colors = color.substring(4,color.length-1).split(',').map(function(el){return parseInt(el);});
                }else if(color.indexOf('#') != -1){
                    colors[0] = parseInt(color.substr(1,2),16);
                    colors[1] = parseInt(color.substr(3,2),16);
                    colors[2] = parseInt(color.substr(5,2),16);
                }
                return colors;
            },
            /**
            * @ target 把数组转换为 color 值
            * @ return color: String
            * @ e.g. [255,102,0] => #ff6600
            */
            toColor: function(colorArr, withSharp){
                withSharp = withSharp===undefined ? true : withSharp;
                colorArr = colorArr.map(function(el){
                    if(255< el || el<0) throw new Error('NL custom: color value should between 255 - 0.');
                    var color16 = _NL.utils.parseInt16(el, false);
                    return color16 < 10 ? '0' + color16 : color16; // e.g. 08,ff,a9
                });
                colorArr = colorArr.join('')
                return withSharp ? '#'.concat(colorArr) : colorArr;
            },
			/*
			* @ target 把10进制整数转换为16进制整数
			* @ property int10: Int 需要转换的十进制数
			* @ property with0x: Boolean 返回值是否需要 0x 开头
            * @ return NumberIn16: String 十六位数字，但是是字符串的形式
            * @ e.g. 256 -> 0x100; 255 -> 0xff
			*/
			parseInt16: function(int10, with0x){
                with0x = with0x===undefined ? true : with0x;
				var parseInt16 = arguments.callee,
					allNum = '0 1 2 3 4 5 6 7 8 9 a b c d e f'.split(' '),
					int16 = [],
					last = Math.floor(int10%16),
					non_last = Math.floor(int10/16);
				int16.unshift(allNum[last]);
				if(non_last >= 16) {
					var temp = parseInt16(non_last, false).split('');
					temp.combine(int16);
					int16 = temp;
				}else if(non_last > 0)// 15 >= x >= 1
					int16.unshift(allNum[non_last]);
				int16 = int16.join('');
				return with0x ? '0x'.concat(int16) : int16;
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
			/**
            * @ target 查找url变量
            * @ property urlVar: String 需要查找的变量
			* @ return value || -1
            * @ e.g. http://xx.xx.xx?email=aa@aa.com  => $_GET('email')
            */
            $_GET: function (urlVar) {
				var urlObj={},
					urlArr = location.search.substring(1).split('#');
				urlArr.forEach(function(ele, index, arr){
					var temp = ele.split('=');
					urlObj[temp[0]] = temp[1];
				})
				if(urlVar in urlObj){
					return urlObj[urlVar];
				}else{
					return -1;
				}
            },
			/**
			//**字符串处理
            * @ target 翻转字符串，可能没啥用，一个PHP原生函数而已 
            * @ property string: String 需要查找的变量
			* @ return string: String
            */
			strrev: function(string){
				return this.array_reverse(string.split('')).join('');
			},
			/**
			//**字符串处理
            * @ target 把单词按空格分割为数组，中文无效，可能没啥用，一个PHP原生函数而已
            * @ property string: String 需要查找的变量
			* @ return string: String
            */
			explode: function(string){
				return string.split(' ');
			},
			/**
			//**字符串处理
            * @ target 把语句首字母大写，一个PHP原生函数而已
            * @ property string: String 需要转换的变量
			* @ return string: String
            */
			ucfirst: function(string){
				var after = string.substr(1),first = string.substr(0,1);
				return first.toUpperCase().concat(after);
			},
			/**
			//**字符串处理
            * @ target 把每个单词首字母大写，一个PHP原生函数而已
            * @ property string: String 需要转换的变量
			* @ return string: String
            */
			ucword: function(string){
				var temp = string.split(' '),temp2 = [];
				for(var i = 0,j=0,len=temp.length; i<len; i++){
					if(temp[i] != ''){
						temp2[j] = this.ucfirst(temp[i]);
						j++;
					}
				}
				return temp2.join(' ');
			},
			/**
			//**数组处理
            * @ target 翻转数组，可能没啥用，一个PHP原生函数而已
            * @ property string: String 需要查找的变量
			* @ return string: String
            */
			array_reverse: function(arr){
				var temp = [];
				for(var i=0,len=arr.length; i<len; i++){
					temp.unshift(arr[i]);
				}
				return temp;
			},
            /*
            * @ target get请求时，把data对象添加到 url 的末尾
            * @ property url: String URL
            * @ property data: Object 请求参数
            */
            dataToUrl: function(data, url) {
                if (url) {
                    url += url.indexOf('?') == -1 ? '?' : '';
                } else {
                    url = '';
                }
                for (var key in data) {
                    if(data.hasOwnProperty(key))
                        url += key + '=' + data[key] + '&';
                }
                return url.substring(0, url.length - 1);
            },
            /*
            * @ target 获取数组中指定index的元素
            */
            getItem: function (array, index) {
                return array.splice(index, 1)[0];
            },
            isInArray: function (item, array) {
                return this.getIndex(item, array) === -1 ? false : true;
            },
            getIndex: function(item, array){
                //Array 已经被扩展了 indexOf 方法
                return array.indexOf(item);
            },
			/*
            * @ target 矩阵转换 -- 数组维度转化
			* e.g.
			*		[[0,1],                    ||   | 0  1  |       |         |
			*		 [1,1], ==> [ [0,1,1,0],   ||   | 1  1  | ==>   | 0 1 1 0 |
			*		 [1,0], 	  [1,1,0,0] ]  ||   | 1  0  |       | 1 1 0 0 |
			*		 [0,0]]                    ||   | 0  0  |       |         |
            */
			matrixTransposition: function(arr){
				var elemLen = arr[0].length, temp = [];
				arr.forEach(function(subArr, index){
                    if(subArr.length != elemLen) throw new Error('NL custom: Please be sure all the subArr length is the same.');
					subArr.forEach(function( subArrEle, subIndex){
						if(!_NL.utils.isArray(temp[subIndex]))
                            temp[subIndex] = [];
                        temp[subIndex][index] = arr[index][subIndex];
                    })
                })
                return temp;
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
            isFunction: function(sth){
                return this.getType(sth) === 'Function';
            },
            isRegExp: function (sth) {
                return this.getType(sth) === 'RegExp';
            },
            isDate: function (sth) {
                return this.getType(sth) === 'Date';
            },
            isUndefined: function(sth){
                return sth === undefined;
            },
            isNull: function(sth){
                return sth === null;
            },
            /**
            * @ target 返回当前时间的标准格式
            * @ return 2012-1-11 23:01:25
            */
            getFullDate: function () {
                return this.getStdDate() + ' ' + this.getStdTime();
            },
            /**
            * @ target 返回当前时间的标准格式
            * @ return 23:01:25
            */
            getStdTime: function () {
                var d = new Date().toString();
                return d.substr(d.indexOf(':')-2,8);
            },
            /**
            * @ target 返回当前时间的标准格式
            * @ return 2012-1-11
            */
            getStdDate: function () {
                var d = new Date();
                return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
            }
        },
        console : {
            _log: function(msg, full){
                if (win.console && console.log) {
                    if(!_NL.browser.isWebkit && full){
                        if(_NL.utils.isArray(msg)){
                            console.log('Array(');
                            msg.forEach(function(el){
                                console.log('    ' + el + ' : ' + _NL.utils.getType(el));
                            });
                            console.log(');');
                        }else if(_NL.utils.isOriginObject(msg) || msg.nodeName){
                            console.log('Object (');
                            Object.forEach(msg, function(key,value){
                                console.log('    ' + key + ' => ' + value + ' : ' + _NL.utils.getType(value));
                            });
                            console.log(');');
                        }else{
                            console.log(msg + ' : ' + _NL.utils.getType(msg));
                        }
                        return;
                    }
                    console.log(msg);
                }else{
                    var dom = doc.getElementById('$$console');
                    if (!dom) {
                        dom = document.createElement('div');
                        dom.setAttribute('id', '$$console');
                        _NL(dom).setStyle({
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
                    _NL(p).setStyle({
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
                } else if (staticMethod.utils.isOriginObject(obj)) {
                    for (var key in obj) {
                        NL.console._log(key + ' : ' + obj[key], full);
                    }
                } else {
                    NL.console._log(obj, full);
                }
            },
            setHeight: function (height) {
                if (!win.console) {
                    var dom = doc.getElementById('$$console');
                    if (!dom)
                        NL.console.log('');
                    NL.CSS.setStyle(dom, {
                        'height': height + 'px'
                    });
                }
            },
            clear: function () {
                doc.getElementById('$$console').innerHTML = '';
            }
        }
    };
    _NL.addStatic({
        windowResize: (function(){
            var stacks = [], ignoreTimes = 50, resizeId;
            var add = function(handler){
                if(stacks.length == 0){
                    resizeId = NL(win).on('resize', function(e){
                        //避免连续的执行
                        clearTimeout(stacks.tId);
                        stacks.tId = setTimeout(function(){
                            stacks.forEach(function(handler, index){
                                handler(e);
                            });
                        }, ignoreTimes);
                    });
                }
                stacks.push(handler);
                return handler;
            };

            var remove = function(id){
                stacks.remove(id);
                if(stacks.length == 0)
                    NL.off(resizeId);
            };

            var removeAll = function(){ 
                stacks = [];
                NL.off(resizeId);
            };

            var setIgnoreTimes = function(ms){
                ignoreTimes = ms;
            };

            return {
                'addHandler': add,
                'removeHandler': remove,
                'removeAll': removeAll,
                'setIgnoreTimes' :setIgnoreTimes
            }
        })()
    });
    /*_NL.addStatic({
        //鸡巴，受不了了...
		animate: (function(){
            //动画函数，形式类似 Array.map
            //
            //用函数的返回值替换原来的值
            var animationFilters = {
                //匀速运动
                normal: function(valuesArr){
                    
                },
                //
                slowIn: function(valuesArr){
                    
                },
                slowOut: function(valuesArr){
                    var startAngle = 0, endAngle = 90,
                        arr = [], shouldReverse,
                        i,len = valuesArr.length;

                    if(valuesArr[0] > valuesArr[len-1]){
                        startAngle = 90, endAngle = 180;
                        shouldReverse = true;
                    }
                    
                    var dis = (endAngle - startAngle)/len;

                    for (var i = 1; i <= len; i++) {
                        arr.push(i * dis + startAngle);
                    }
                    arr = arr.map(function(angle){
                        var radian = _NL.utils.angleToRadian(angle);
                        return Math.abs(Math.sin(radian));
                    });
                    //if(shouldReverse) arr = arr.reverse();

                    valuesArr = valuesArr.map(function(elem, index, originalArr){
                        //return elem * (arr[index] / (elem/valuesArr[len]));
                        var v = arr[index] * originalArr[len-1] + (shouldReverse ? originalArr[len-1] : originalArr[0]);
                        return parseInt(v);
                    });
                    return valuesArr;
                },
                slowInSlowOut: function(valuesArr){
                    
                }
            }

            var times, delay, FPS, duration;

			//*
            * @ target 仿flash的动画函数
			* @ property NL_ele: NLObject instance
			* @ property toStyle: Object 
			* @ property duration: Number 持续时间 ms
			* @ property FPS: Int
            * @ property filterFn: Function 过滤动画值的函数，比如 sin 生成慢入慢出的值
			* @ property 
            //*
            function flash(NL_ele, toStyle, duration, FPS, filterFn){
				var fromStyleObj = {}, tempStyleArr,
                    keys = _NL.utils.getKeys(toStyle);
                setParams(FPS, duration);

                if(typeof filterFn =='string') filterFn = animationFilters[filterFn];
                else if(typeof filterFn == 'function') filterFn = filterFn;
                else filterFn = animationFilters['slowOut'];

                keys.forEach(function(key){
                    fromStyleObj[key] = NL_ele.getStyle(key);
                });
                
                tempStyleArr = getAnimStyle(FPS, duration, fromStyleObj, toStyle, filterFn);

                _NL.exec(function(style){
                    NL_ele.setStyle(style);
                }, times, tempStyleArr, delay);
			}

            function setParams(_FPS, _duration){
                duration = _duration;
                FPS = _FPS;
                times = duration*FPS/1000;
                delay = 1000/FPS;
            }

            //e.g. { left:0 } -> { left:30 }( FPS:6, duration:5000 ) ==> [{ left:1 },{ left:2 }...{ left:30 }]
            function getAnimStyle(FPS, duration, fromStyleObj, toStyleObj, filterFn){
                var temp = [];
                Object.forEach(fromStyleObj, function(key, value){
                    var isPx = isPxValue(value),
                        isColor = isColorValue(value),
                        toValue = toStyleObj[key];
                    if(times === undefined) setParams(FPS, duration);
                    //1. 把 px color 转换为纯数字
                    if(isPx) {
                        value = parseFloat(value);
                        toValue = parseFloat(toValue);
                    }else if(isColor){
                        value = _NL.utils.parseColor(value);
                        toValue = _NL.utils.parseColor(toValue);
                    }
                    //2. 计算中间动画的值
                    var valuesInAnim = getValues(FPS, duration, value, toValue, filterFn);
                    //3. 把值转换为 px color 的形式
                    if(isPx)
                        valuesInAnim = valuesInAnim.map(function(elem, index){
                            return elem + 'px';
                        });
                    else if(isColor)
                        valuesInAnim = valuesInAnim.map(function(elem, index){
                            return _NL.utils.toColor(elem,true);
                        });
                    //4. 给 temp 赋值，形式 ： [{ left:1, top:1 },{left:2, top:2 }...]
                    valuesInAnim.forEach(function(animValue, index){
                        if(temp[index] === undefined) temp[index] = {};
                        temp[index][key] = animValue;
                    });
                });
                return temp;
            }
            //e.g. left:0 -- left:30 ( FPS:6, duration:5000 ) ==> left:[1,2,3,....29,30]
            function getValues(FPS, duration, startNum, endNum, filterFn) {
                if(_NL.utils.getType(startNum) != _NL.utils.getType(endNum))
                    throw new Error('NL custom: the type of the startNum and endNum must be same.');
                if(times === undefined) setParams(FPS, duration);
                startNum = startNum === undefined ? 0 :startNum;
                endNum = endNum === undefined ? 90 : endNum;
                var interval = (endNum-startNum) / times,
                    needMatrixTrasposition = false,
                    arr = [], temp = [], _getValues = arguments.callee;

                if(_NL.utils.isArray(startNum)){//color 的形式 start:[0,0,0], end:[255,255,255]
                    startNum.forEach(function(el, index){
                        temp.push(_getValues(FPS, duration, startNum[index], endNum[index], filterFn));
                    });
                    needMatrixTrasposition = true;
                }else{
                    for (var i = 1; i <= times; i++)
                        arr.push(i * interval + startNum);
                }

                // 动画函数过滤 -- 默认即为匀速运动
                if(filterFn != animationFilters['normal']){
                    arr = (function(){
                        var selfFn = arguments.callee;
                        if(_NL.utils.isArray(arr[0])){
                            arr = arr.map(function(_arr){
                                return filterFn(_arr);
                            });
                        }else{
                            return filterFn(arr);
                        }
                    })();
                }
                
                if(needMatrixTrasposition) arr = _NL.utils.matrixTransposition(temp);
                return arr;
            }

            function anim(fn, times, FPS){
                var _times = 0,per_frame_ms = 1000/FPS;
                var id = setTimeout(function(){
                    if(_times < times){
                        fn.call(win, _times);
                        id = setTimeout(arguments.callee,per_frame_ms);
                        _times++;
                    }
                }, per_frame_ms);
            }

            function _filterNum(styleObj){
                styleObj = Object.map(styleObj, function(el){
                    if(isPxValue(el))
                        return parseFloat(el);
                    else if(isColorValue(el))
                        return _NL.utils.parseColor(el);//返回数组
                });
                return styleObj;
            }

            function isPxValue(value){
                return (/\d+px/g).test(value);
            }

            function isColorValue(value){
                return (/rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)/g).test(value) || (/#\d{3}/g).test(value);
            }


            return {
			    flash: flash,
                anim: anim,
                getAnimStyle: getAnimStyle,
                getValues: getValues
		    }
        })(),
    });*/
    _NL.addStatic((function(){
        var fns = {}, utils = staticMethod.utils;

        return {
            /**
            * @ target 执行函数,同一个 IDstr 重复的 exec 会被忽略
            * @ property fn: Function (timeNum) 需要执行的函数，执行时会有一个参数，即目前是执行的第几次
            * @ property [ argsEachTime: Array ] 每次执行时使用的参数, 数组的个数 1.1个，每次都是用相同的参数； 2. 与times个数相同
            * @ property [ delay = 100: int ] 每次执行的间隔时间 ，默认为 100 毫秒
            * @ property [ times = 1: int ] 执行的次数，默认为 1
            * @ property [ IDstr = ...: String ] 自定义字符串，本次的 exec 的ID，默认为当前时间戳--即每次都会执行新的 exec
            * @ property [ delay = 100: int ] 每次执行的间隔时间 ，默认为 100 毫秒
            *
            * @ return IDstr: String 把 IDstr 原样返回，可以用来 clear ID 为 IDstr 的 exec 操作
            */
            exec: function(fn, times, argsEachTime, delay, IDstr, thisObj){
                times = times || 1;
                argsEachTime = argsEachTime || [undefined];
                delay = delay || 100;
                IDstr = IDstr || (new Date()).getTime().toString();
                if(!utils.isInArray(IDstr, utils.getKeys(fns))){
                    fns[IDstr] = {};
                    fns[IDstr]['fn'] = fn;
                    fns[IDstr]['shouldTimes'] = times;
                    fns[IDstr]['execTimes'] = 0;
                    fns[IDstr]['delay'] = delay;
                    fns[IDstr]['timeoutId'] = setTimeout(function(){
                        var index = fns[IDstr]['execTimes'];
                        var arg = argsEachTime.length == 1 ? argsEachTime[0] : argsEachTime[index];

                        fn.call(thisObj||win, arg, index);

                        if(fns[IDstr] && fns[IDstr]['execTimes'] < fns[IDstr]['shouldTimes']-1/*因为在外层已经执行一次了*/){
                            fns[IDstr]['timeoutId'] = setTimeout(arguments.callee, delay);
                        }
                        fns[IDstr]['execTimes']++;
                    },delay);
                }
                return IDstr;
            },
            clear: function(IDstr){
                if(utils.isInArray(IDstr, utils.getKeys(fns))){
                    clearTimeout(fns[IDstr]['timeoutId']);
                    delete fns[IDstr];
                }
            }
        }
    })());
    
    /**
    * @ target Event Bus 事件管理 non-DOM
    * @ method on(listen) --------------- 监听事件的方法
    * @ method off(remove|removeAll) ---- 移除事件的方法
    * @ method fire --------------------- 发出事件
    * 
    * @ note ---------------------------- DOM 事件 见 NL() 的实例方法
    */
    var staticMethod_events = new function(){
        var events = {};
        /*
        * @ target non-DOM 的监听事件的方法
        * @ property eventType: String 监听的事件类型
        * @ property callback: Function 监听的事件
        *
        * e.g.
        *   NL.on('customEvent', fn);
        *   NL.on({ 'customEvent': fn, 'loaded': fn2 })
        *
        * @ return ID: Array
        *
        *   回调函数中会有 1||2 个参数
        */
        this.on = function (eventType, callback, fnParams) {
            //callback.id = 'NLLibraryEventBusHandlerId:' + (new Date).getTime();
            var ID = [],args;
            if(staticMethod.utils.isOriginObject(eventType)){
                args = [].slice.call(arguments,1);
                Object.forEach(eventType, function(key,value,self){
                    bind(key, value);
                });
            }else{
                args = [].slice.call(arguments,2);
                bind(eventType, callback);
            }
            function bind(type, fn){
                if (!events[type])
                    events[type] = [];  
                fn['fnParams'] = args;// fn['fnParams'] = fnParams;
                events[type].push(fn);
                ID.push({
                    'type':eventType,
                    'handler': callback
                });
            }
            return ID;
        };
        /*
        * @ target 移除事件的方法( DOM && non-DOM )
        * @ property ID:Array
        * @ property removeAll: Boolean 是否全部移除，只适用于 non-DOM 事件
        */
        this.off = function(ID, removeAll){
            if(staticMethod.utils.isOriginObject(ID))
                ID = new Array(ID);
            if(ID[0].dom)
                offDomEvent(ID);
            else 
                offBusEvent(ID, removeAll);
        };
        function offBusEvent(ID, removeAll){
            for(var i=0,len=ID.length; i<len; i++){
                var type = ID[i]['type'], handler = ID[i]['handler'];
                if(!events[type])
                    continue;
                if(staticMethod.utils.isBoolean(removeAll)){
                    delete events[type];
                }else{ 
                    for(var j=0,len2=events[type].length; i<len2; i++){
                        if(events[type][j] === handler){
                            events[type].splice(i, 1);
                            break;
                        }
                    }
                }
            }
        }
        function offDomEvent(ID){
            for(var i=0,len=ID.length; i<len; i++){
                removeEvent(ID[i].dom, ID[i].type, ID[i].handler);
            }
        }
        /*
        * @ target 发出事件
        * @ property eventType: String 事件的名字
        * @ property [ fnParams: Mixin ] 执行函数时，传递的参数
        * @ property [ fnScope: Object ] 执行函数时，可以传递作用域内 this 对象
        * @ e.g.
        *       NL.fire('customEvent', { msg:.. }, scope);
        */
        this.fire = function (eventType, fnParams, fnScope) {
            fnScope = fnScope || window;
            if (events[eventType]) {
                for (var i = 0, len = events[eventType].length; i < len; i++) {
                    var fn = events[eventType][i], args = [];
                    if(fn['fnParams'])
                        args.combine(fn['fnParams']);//args.push(fn['fnParams']);
                    args.push(fnParams);
                    fn.apply(fnScope, args);
                }
            }
        };
        function removeEvent(dom, type, fn) {
            if (dom.removeEventListener) {
                dom.removeEventListener(type, fn);
            } else {
                dom.detachEvent('on' + type, fn);
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
        //var events=[];
        /*
        * @ target 针对 DOM 的 添加 || 委托 事件的方法
        * @ property type: String 事件的名字
        * @ property fn: Function 侦听函数
        *
        * @ e.g. 
        *       NL('li').on('click', fn);
        *       NL('li').on({ click: fn, mouseout: fn })
        *       NL('#id').on('.li', 'click', fn)
        *       NL('#id').on('.li', { click: fn, mouseover: fn })
        *
        * @ property [ isChildOk： Boolean ] 默认为false，只为 selector 元素委托事件； true ：只要是 selector 的子节点，即委托事件 ---- 只用于委托事件时
        *
        * @ return ID: Array
        *
        *       如果是 ('',fn)的形式，返回的数组是按照 NL('') 里面 doms 的顺序来的
        *       如果是（{'':fn}）的形式，返回的数组，是 先NL('')的顺序，然后是({'':fn})的顺序
        *           即：e.g.① 的 li.index(2) 的手柄在返回ID的位置为：ID[2]
        *               e.g.② 的 li.index(2)['mouseout'] 的手柄在: ID[li.length + 2] //也可以先把ID按照 元素type过滤一次
        */
        this.on = function (selector, type, fn, isChildOk) {
            var u = staticMethod.utils;//,s = u.isString,f = u.isFunction, o = u.isOriginObject, u=u.isUndefined;
            var is_selector_str = u.isString(selector),
                is_selector_obj = is_selector_str || u.isOriginObject(selector),
                is_type_str = u.isString(type),
                is_type_obj = is_type_str|| u.isOriginObject(type),
                is_type_fn = is_type_str || is_type_obj || u.isFunction(type),
                is_fn_fn = u.isFunction(fn);

            if((is_selector_str && is_type_str && is_fn_fn)||(is_selector_str && is_type_obj)){
                return _delegate(selector, type, fn, this, isChildOk);
            }else if((is_selector_str && is_type_fn)||(is_selector_obj)){
                fn = type;
                type = selector;
                return _on(type, fn, this);
            }
        };
        function _on(type, fn, self){
            if(typeof type === 'string'){
                //events.push(fn);
                var ID = [];
                self.each(function(dom, index){
                    var realHandler = addEvent(dom, type, fn);
                    ID.push({
                        'dom': dom,
                        'type': type,
                        'handler': realHandler
                    });
                });
                return ID;
            }else if(staticMethod.utils.isOriginObject(type)){
                var _events = type,ID = [];
                for(type in _events){
                    fn = _events[type];
                    //events.push(fn);
                    self.each(function(dom, index){
                        var realHandler = addEvent(dom, type, fn);
                        ID.push({
                            'dom': dom,
                            'type': type,
                            'handler': realHandler
                        });
                    });
                }
                return ID;
            }else
                throw new Error(' custom: Please check the Format of the Parameters of "on" method');
        }
        /*
        * @ note 委托事件的回调函数中， this 始终是被委托的 selector 节点
        *   e.g. callback(e, xxx) 暂时忘了 里面的 this 指向谁了，得查看 addEvent 方法
        */
        function _delegate(selector, type, fn, self, isChildOk){
            var nodes;
            var ID = _on(type, function(e){
                updateNodes();
                var index = staticMethod.utils.getIndex(e.target, nodes);
                //目标节点不是 selector 元素
                if(index !== -1){
                    fn.call(e.target, e, this);
                //判断是否是 selector 的子元素
                }else if(isChildOk){
                    //弊端： Array.forEach 无法中途 break
                    for(var i=0,len=nodes.length; i<len; i++){
                        var dom = nodes[i];
                        if(staticMethod.elements.isChildNode(e.target, dom)){
                            fn.call(dom, e, this);
                        }
                    }
                }
            }, self);

            return ID;

            function updateNodes(){
                nodes = [];
                self.doms.forEach(function(dom){
                    nodes.combine(NL.$(selector, dom));
                });
            }
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
        /*function removeEvent(dom, type, fn) {
            if (dom.removeEventListener) {
                dom.removeEventListener(type, fn.realHandler);
            } else {
                dom.detachEvent('on' + type, fn.realHandler);
            }
        }*/
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
                keyCode: getKeyCode(event),
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
        /*
        * @ target 获取 event 的键盘按键的ASCII
        */
        function getKeyCode(event){
            return event.keyCode;
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
		isNLObject: true,
        each: function(fn){
            var arr = this.doms;
            arr.forEach(fn);
            return this;
        },
        eq: function(index){
            return index === -1 ?
                   NL(this.doms.slice(index)):
                   NL(this.doms.slice(index, index+1));
        },
        first: function(){
            return this.eq(0);
        },
        last: function(){
            return this.eq(-1);
        },
        slice: function(start, end){
            return NL([].slice.apply(this.doms, arguments));
        },
        getStyle: function(styleName){
            var styles = [];
            this.each(function(element){
                var style = '';
                if (window.getComputedStyle) {//W3C
                    style = element.ownerDocument.defaultView.getComputedStyle(element, null).getPropertyValue(staticMethod.utils.toHyphens(styleName));
                } else if (element.currentStyle) {//IE
                    style = element.currentStyle[staticMethod.utils.toCamelCase(styleName)];
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
            //var classNames = this.getClassNames();
            this.each(function(element, index){
                var classNames = NL(element).getClassNames();
                for (var i = 0, len = classNames.length; i < len; i++) {
                    if (className == classNames[i]) {
                        classNames.splice(i, 1);
                        break;
                    }
                }
                element.className = classNames.join(' ');
            });
            return this;
        },
        toggleClass: function(className){
            //var self = this;
            this.each(function(dom, index){
                var d = NL(dom);
                if(d.hasClass(className))
                    d.removeClass(className);
                else
                    d.addClass(className);
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
        toggleFn: function(fn1, fn2){
            if(!inner_cache.instance_fn.toggleFn){
                inner_cache.instance_fn.toggleFn = {};
                inner_cache.instance_fn.toggleFn[fn1] = 0;
            }
            if(inner_cache.instance_fn.toggleFn[fn1] == 0){
                inner_cache.instance_fn.toggleFn[fn1] = 1;
                fn1.call(this.doms);
            }else{
                inner_cache.instance_fn.toggleFn[fn1] = 0;
                fn2.call(this.doms);
            }
            return this;
        },
        hasClass: function (className, isAllHas) {
            //其实在 each 函数中 只需 match++ 也可，但下面的判断 是为了 快速 return 而不用等待 forEach 全部循环
            var match = 0;
            this.each(function(dom, index){
                var classNames = NL(dom).getClassNames();
                if(staticMethod.utils.isInArray(className, classNames)){
                    match++;
                    if(!isAllHas)
                        return true;
                }else if(isAllHas)
                    return false;
            });
            if(match==0)
                return false;
            else if(match == this.doms.length)
                return true;
            else
                return !isAllHas ? true : false;
            /*var classNames = this.getClassNames(), match = 0;
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
                return !isAllHas ? true : false;*/
        },
        show: function(){
            this.setStyle({display:'block'});
            return this;
        },
        hide: function(){
            this.setStyle({display:'none'});
            return this;
        },
        /*
        * @ target 滚动 滚动条 到 pxNum 的位置，默认为滚动到底部,0为滚动到顶部
        * @ property pxNum: Number 需要滚动的像素数
        * @ property [ isVertical = true: Boolean ] 是否是垂直滚动 或 水平滚动
        * @ note 一般在有滚动条的地方使用
        */
        scrollTo: function(pxNum, isVertical){
            this.each(function(dom){
                if(isVertical || isVertical===undefined)
                    dom.scrollTop = pxNum || dom.scrollHeight;
                else
                    dom.scrollLeft = pxNum || dom.scrollWidth;
            });
            return this;
        },
        /*
        * @ target 设置 NLDom 的属性
        * @ property name: String 属性的名字
        * @ property value: String 属性的值
        */
        setAttr: function(name, value){
            this.each(function(dom){
                dom.setAttribute(name, value);
            });
            return this;
        },
        /*
        * @ target 获取 NLDom 的属性
        * @ property name: String 属性的名字
        * @ property all: Boolean 是否获取所有的 节点的属性，默认为首个节点的属性值
        *
        * @ return value || Array of value
        */
        getAttr: function(name, all){
            var temp = [];
            this.each(function(dom){
                var attr = dom.getAttribute(name);
                if(all)
                    temp.push(attr);
                else if(temp.length==0)
                    temp.push(attr);
            });
            return temp.length==1 ? temp[0] : temp;
        },
        //////////==========================================================================
        //////////
        ////////// 事件 on off
        //////////
        //////////==========================================================================
        /*
        * @ target 针对 DOM 的 添加 事件的方法
        * @ property [ isChildOk： Boolean ] 默认为false，只为 selector 元素委托事件； true ：只要是 selector 的子节点，即委托事件
        * @ return handlerId
        * @ note 详见 tempEventContainter
        */
        on: function(selector, type, fn, isChildOk){
            return tempEventContainter.on.call(this, selector, type, fn, isChildOk);
        },
        /* 直接使用 NL.off(ID) 移除事件
        off: function(ID){
            tempEventContainter.off.call(this, ID);
        },*/
        //////////==========================================================================
        //////////
        ////////// Elements
        //////////
        //////////==========================================================================
        /*
        * @ target 向已有的NLObject 里面添加元素
        * @ e.g.
        *   add(selector);
        *   add(Element);
        *   add(NL Object);
        *   add(Array);
        */
        add: function(selector_element_NLobj_arr){
            var self = this;
            if(typeof selector_element_NLobj_arr === 'string'){
                var _doms = NL.$(selector_element_NLobj_arr);
                _doms.forEach(function(ele){
                    self.doms.push(ele);
                });
            }else if(selector_element_NLobj_arr.nodeType){
                this.doms.push(selector_element_NLobj_arr);
            }else if(selector_element_NLobj_arr.doms){
                selector_element_NLobj_arr.forEach(function(ele){
                    self.doms.push(ele);
                });
            }else if(staticMethod.utils.isArray(selector_element_NLobj_arr)){
                selector_element_NLobj_arr.forEach(function(ele){
                    self.add(ele);
                });
            }
            return this;
        },
        /**
        * @ target 拷贝 NL 对象
        * @ property deep: Boolean 是否深度拷贝
        * @ return NL Object
        */
        clone: function(deep){
            var doms = [];
            this.each(function(dom, index){
                doms.push(dom.cloneNode(deep));
            });
            return NL(doms);
        },
        /**
        * @ target 移除子节点
        * @ property dom: Element 属性名称，如id、class，或自定义的属性
        */
        removeChild: function(dom){
            this.each(function(_dom){
                _dom.removeChild(dom);
            });
            return this;
        },
        /**
        * @ target 根据属性移除子节点
        * @ property attrName: String 属性名称，如id、class，或自定义的属性
        * @ property value: String 值
        */
        removeChildBy: function(attrName, attrValue){
            this.each(function(dom, index){
                var childs = _NL.elements.getChildren(dom);
                childs.forEach(function(_dom, _index){
                    var attrValues = NL.utils.strSplitByWhitespace(_dom.getAttribute(attrName));
                    if(NL.utils.isInArray(attrValue, attrValues))
                        dom.removeChild(_dom);
                });
            });
            return this;
        },
        /**
        * @ target 追加子节点
        * @ property Dom_Html_Arr: Element || HTMLString || Array 
        * @ property [ returnNewNode: Boolean ]  返回前面的NLObject 还是 新添加的 NLObject
        * @ return originalNL || insertedNL
        */
        append: function(Dom_Html_Arr, returnNewNode){
            return this.insert(Dom_Html_Arr, undefined, returnNewNode);
        },
        /**
        * @ target 头部添加子节点
        * @ property Dom_Html_Arr: Element || HTMLString || Array 
        * @ property [ returnNewNode: Boolean ]  返回前面的NLObject 还是 新添加的 NLObject
        * @ return originalNL || insertedNL
        */
        prepend: function(Dom_Html_Arr, returnNewNode){
            return this.insert(Dom_Html_Arr, 0, returnNewNode);
        },
        /**
        * @ target 根据属性移除子节点
        * @ property Dom_Html_Arr: Element || HTMLString || Array 
        * @ property index: Int
        ///////////////////////* @ property [ options: Object ]   { returnContent: 'front'(default) || 'back' }
        * @ property [ returnNewNode: Boolean ]  返回前面的NLObject 还是 新添加的 NLObject
        * @ return originalNL || insertedNL
        */
        insert: function(Dom_Html_Arr, index, returnNewNode){
            var deepClone = true, returnBack = returnNewNode,returnNL;
            if(typeof Dom_Html_Arr === 'string')
                Dom_Html_Arr = staticMethod.elements.create(Dom_Html_Arr);
            else if(Dom_Html_Arr.doms)
                Dom_Html_Arr = Dom_Html_Arr.doms;
            this.each(function(dom){
                var insertDom = tempEventContainter2.getNodeClone(Dom_Html_Arr, deepClone);
                if(returnBack) returnNL ? returnNL.add(insertDom) : returnNL = NL(insertDom);
                staticMethod.elements.insert(dom, insertDom, index);
            });
            return returnBack? returnNL: this;
        },
        appendTo: function(NLDom){
            return NLDom.insert(this, undefined, { returnContent:'back' });
        },
        prependTo: function(NLDom){
            return NLDom.insert(this, 0, { returnContent:'back' });
        },
        after: function(){
            
        },
        before: function(){

        },
        /*
        * @ target 获取指定索引的子元素（集合）
        * @ property filters: Object 参见 NL.elements.nodeListFilter
        * @ return Node | Array
        */
        getChild: function(index, filters, notCareTextNode){
            var temp = [], doms = NL.utils.isArray(this.doms) ? this.doms : [this.doms];
            doms.forEach(function(dom){
                temp.push(staticMethod.elements.getChild(dom, index, filters, notCareTextNode));
            });
            return NL(temp);
        },
        getChildren: function(filters){
            var temp=[], doms = NL.utils.isArray(this.doms) ? this.doms : [this.doms];
            doms.forEach(function(dom, index){
                temp.combine(staticMethod.elements.getChildren(dom, filters));
            });
            return NL(temp);
        },
        getSiblings: function(filters){
            var temp=[], doms = NL.utils.isArray(this.doms) ? this.doms : [this.doms];
            doms.forEach(function(dom){
                temp.combine(staticMethod.elements.getSiblings(dom, filters));
            });
            return NL(temp);
        },
        /*
        * @ target 查看是否有这个对象
        */
        isEmpty: function(){
            return this.doms.length == 0 ? true : false;
        },
        /*
        * @ target 设置或获取节点的HTML内容
        */
        html: function(html){
            var htmls = [], attr = 'innerHTML',
                ishtmlUndefined = NL.utils.isUndefined(html) ? true : false;
            this.each(function(dom){
                var isValDom = 'textarea input'.split(' ');//暂时想起来这两个，以后在扩充
                if(NL.utils.isInArray(dom.tagName.toLowerCase(), isValDom))
                    attr = 'value';
                (!ishtmlUndefined) ? (dom[attr]=html) : (htmls.push(dom[attr]));
            });
            return (!ishtmlUndefined) ? this : (htmls.length==1 ? htmls[0] : htmls);
        },
        /*
        * @ target 设置或获取节点的 Text 文本内容
        */
        text: function(text){
            var texts = [];
            //FF : dom.textContent
            this.each(function(dom){
                (text) ? 
                (dom.innerText ? dom.innerText = text : dom.textContent = text) : 
                (texts.push(dom.innerText||dom.textContent));
            });
            return text ? this : (texts.length==1 ? texts[0] : texts);
        }
    });
    //这些不需要添加到
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////   临时使用的 存储容器 2 
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var tempEventContainter2 = new function(){
        /*
        * @ target 获取节点的一个cloneNode
        * @ return Node | Array
        */
        this.getNodeClone = function(dom_arr, deep){
            var cloneNode;
            if(staticMethod.utils.isArray(dom_arr)){
                cloneNode=[];
                for(var i=0,len=dom_arr.length;i<len;i++)
                    cloneNode.push(dom_arr[i].cloneNode(deep));
            }else if(dom_arr.nodeType){
                cloneNode = dom_arr.cloneNode(deep);
            }
            return cloneNode;
        }
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////
    ///////////////   NL 最后的操作
    ///////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    _NL.addStatic(staticMethod);
    _NL.addStatic(staticMethod_events);
    window.NL = _NL;

})(window);
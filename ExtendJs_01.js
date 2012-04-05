/**
 * @ target Extends the basic Javascript Language
 * @ author peichao01
 * @ date 2011-12-28
 * @ last-change 2012-01-11
 *
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
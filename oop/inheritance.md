---
title: 继承
layout: page
date: 2012-12-12
modifiedOn: 2013-05-04
category: oop
---

## \__proto__属性

除了IE浏览器，其他浏览器都在Object对象的实例上，部署了一个非标准的\__proto__属性（前后各两个下划线），指向该对象的原型对象prototype。

{% highlight javascript %}

var o = new Object();

o.__proto__ === o.constructor.prototype 
// true

{% endhighlight %}

上面代码说明，对象o的\__proto__属性，直接指向它的原型对象constructor.prototype（这是间接获取原型对象的方法）。

可以用下面的代码，检查浏览器是否支持该属性。

{% highlight javascript %}

Object.getPrototypeOf({ __proto__: null }) === null

{% endhighlight %}

下面是一个实例，通过\__proto__属性与constructor.prototype两种方法，分别读取定义在原型对象上的属性。

{% highlight javascript %}

Array.prototype.p = 'abc';
var a = new Array();

a.__proto__.p // abc
a.constructor.prototype.p // abc	

{% endhighlight %}

显然，\__proto__看上去更简洁一些。

因为这个属性目前还不是标准，所以不应该在生产代码中使用。我们这里用它，只是因为它可以帮助理解继承。

{% highlight javascript %}

var a = { x: 1};

var b = { __proto__: a};

b.x 
// 1

{% endhighlight %}

上面代码中，b对象本身并没有x属性，但是JavaScript引擎通过\__proto__属性，找到它的原型对象a，然后读取a的x属性。

原型对象自己的\__proto__属性，也可以指向其他对象，从而一级一级地形成“原型链”（prototype chain）。

{% highlight javascript %}

var a = { x: 1};

var b = { __proto__: a};

var c = { __proto__: b};

c.x
// 1

{% endhighlight %}

空对象的\__proto__属性，默认指向Object.prototype。

{% highlight javascript %}

var a = {};

a.__proto__ === Object.prototype
// true

{% endhighlight %}

通过构造函数生成实例对象时，实例对象的\__proto__属性自动指向构造函数的prototype对象。

{% highlight javascript %}

var f = function (){};

var a = {};

f.prototype = a;

var o = new f();

o.__proto__ === a
// true

{% endhighlight %}

## 属性的继承

属性分成两种。一种是对象自身的原生属性，另一种是继承自原型的继承属性。

### 对象的原生属性

对象本身的所有属性，可以用Object.getOwnPropertyNames方法获得。

{% highlight javascript %}

Object.getOwnPropertyNames(Date)
// ["parse", "arguments", "UTC", "caller", "name", "prototype", "now", "length"]

{% endhighlight %}

对象本身的属性之中，有的是可以枚举的（enumerable），有的是不可以枚举的。只获取那些可以枚举的属性，使用Object.keys方法。

{% highlight javascript %}

Object.keys(Date)
// []

{% endhighlight %}

判断对象是否具有某个属性，使用hasOwnProperty方法。

{% highlight javascript %}

Date.hasOwnProperty('length')
// true

Date.hasOwnProperty('toString')
// false

{% endhighlight %}

### 对象的继承属性

用Object.create方法创造的对象，会继承所有原型对象的属性。

{% highlight javascript %}

var proto = { p1: 123 };
var o = Object.create(proto);

o.p1
// 123

o.hasOwnProperty("p1")
// false

{% endhighlight %}

### 获取所有属性

判断一个对象是否具有某个属性（不管是自身的还是继承的），使用in运算符。

{% highlight javascript %}

"length" in Date
// true

"toString" in Date
// true

{% endhighlight %}

获得对象的所有可枚举属性（不管是自身的还是继承的），可以使用for-in循环。

{% highlight javascript %}

var o1 = {p1:123};

var o2 = Object.create(o1,{
        p2: { value: "abc", enumerable: true }
});

for (p in o2) {console.info(p);}
// p2
// p1

{% endhighlight %}

为了在for...in循环中获得对象自身的属性，可以采用hasOwnProperty方法判断一下。

{% highlight javascript %}

for ( var name in object ) {
    if ( object.hasOwnProperty(name) ) {
        /* loop code */
    }
}

{% endhighlight %}

获得对象的所有属性（不管是自身的还是继承的，以及是否可枚举），可以使用下面的函数。

{% highlight javascript %}

 function inheritedPropertyNames(obj) {
        var props = {};
        while(obj) {
            Object.getOwnPropertyNames(obj).forEach(function(p) {
                props[p] = true;
            });
            obj = Object.getPrototypeOf(obj);
        }
        return Object.getOwnPropertyNames(props);
 }

{% endhighlight %}

用法如下：

{% highlight javascript %}

inheritedPropertyNames(Date)
// ["caller", "constructor", "toString", "UTC", "call", "parse", "prototype", "__defineSetter__", "__lookupSetter__", "length", "arguments", "bind", "__lookupGetter__", "isPrototypeOf", "toLocaleString", "propertyIsEnumerable", "valueOf", "apply", "__defineGetter__", "name", "now", "hasOwnProperty"]

{% endhighlight %}

## 对象的拷贝

如果要拷贝一个对象，需要做到下面两件事情。

- 确保拷贝后的对象，与原对象具有同样的prototype原型对象。

- 确保拷贝后的对象，与原对象具有同样的属性。

下面就是根据上面两点，编写的对象拷贝的函数。

{% highlight javascript %}

function copyObject(orig) {

	var copy = Object.create(Object.getPrototypeOf(orig));
    copyOwnPropertiesFrom(copy, orig);
    return copy;
}

function copyOwnPropertiesFrom(target, source) {
    Object.getOwnPropertyNames(source) 
    .forEach(function(propKey) { 
        var desc = Object.getOwnPropertyDescriptor(source, propKey);
        Object.defineProperty(target, propKey, desc);
    });
    return target;
};

{% endhighlight %}

## 参考链接

- Dr. Axel Rauschmayer, [JavaScript properties: inheritance and enumerability](http://www.2ality.com/2011/07/js-properties.html)

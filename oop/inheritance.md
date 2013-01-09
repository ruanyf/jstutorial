---
title: 继承
layout: page
date: 2012-12-12
modifiedOn: 2013-01-08
category: oop
---

## \__proto__属性

每个对象都有一个内部属性\__proto__（注意，前后各两个下划线），指向这个对象的原型对象。通过这个内部属性，可以从实例对象读取原型对象的属性。

{% highlight javascript %}

var a = { x: 1};

var b = { __proto__: a};

b.x
// 1

{% endhighlight %}

上面的代码中，b对象本身并没有x属性，但是解释器通过\__proto__属性，找到它的原型对象a，然后读取a的x属性。

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

## instanceof运算符

该运算符用来确定一个对象是否是另一个对象的实例。

{% highlight javascript %}

123 instanceof Object
// false

{} instanceof Object
// true

var f = function (){};
var o = new f();

o instanceof f
// true

{% endhighlight %}

## 属性的继承

属性分成两种。一种是对象自身的原生属性，另一种是继承自原型的继承属性。

### 对象的原生属性

对象本身可枚举的属性，可以用Object.keys方法取得。

{% highlight javascript %}

Object.keys(obj)

{% endhighlight %}

对象本身的所有属性，不管是否可枚举，可以用下面的方法取得

{% highlight javascript %}

Object.getOwnPropertyNames(object)
object.hasOwnProperty(property)

{% endhighlight %}

### 对象的继承属性

对象所有可枚举的属性，可以用for-in循环得到。

{% highlight javascript %}

for (property in object)

{% endhighlight %}

不管是否可枚举，都可以用下面的方法判断，对象是否包括某个属性

{% highlight javascript %}

property in object

{% endhighlight %}

用法如下

{% highlight javascript %}

> "valueOf" in {}
true

> "toString" in {}
true

{% endhighlight %}

用Object.create方法创造的对象，它会继承所有原型对象的属性。

{% highlight javascript %}

> var proto = { p1: 123 };
> var o = Object.create(proto);
> o.hasOwnProperty("p1")
  false

{% endhighlight %}

所有的继承属性，默认都是不可枚举的。

{% highlight javascript %}

> var proto = { p1: 123 };
> var o = Object.create(proto);
> 'p1' in Object.keys(o)
  false

{% endhighlight %}

## 参考链接

- Dr. Axel Rauschmayer, [JavaScript properties: inheritance and enumerability](http://www.2ality.com/2011/07/js-properties.html)

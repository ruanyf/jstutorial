---
title: 对象
layout: page
category: grammar
date: 2012-12-12
modifiedOn: 2013-04-30
---

## 概述

对象（object）是一种数据结构，由若干个“键值对”（key-value）构成。

{% highlight javascript %}

var o = {

	p: "Hello World"

};

{% endhighlight %}

上面代码中，大括号就代表一个对象，被赋值给变量o。这个对象内部包含一个键值对（又称为“成员”），p是“键”（成员的名称），“Hello World”是“值”（成员的值）。

“键”又称为“属性”（property），它的“值”可以是任何数据类型。如果一个属性的值为函数，通常把这个属性称为“方法”。

{% highlight javascript %}

var o = {

	p: function(x) {return 2*x;}

};

o.p(1)
// 2

{% endhighlight %}

属性之间用逗号分隔，最后一个属性后面可以加逗号（trailing comma），也可以不加。

{% highlight javascript %}

   var obj = {
        foo: 123,
        bar: function () { ... },
    }

{% endhighlight %}

上面的代码中bar属性后面的那个逗号，有或没有都不算错。

### 生成方法

对象用大括号{}表示。生成一个对象，可以直接用{}，可以用new Object()命令。

{% highlight javascript %}

var o = {};

// or

var o = new Object();

{% endhighlight %}

### 读取属性

读取一个属性，有两种方法，一种是点结构，还有一种是方括号。

{% highlight javascript %}

var o = {

	p: "Hello World"

};

// 点结构
console.log(o.p); // Hello World

// 方括号
console.log(o["p"]); // Hello World

{% endhighlight %}

这两种方法，不仅可以引用到该属性对应的值，还可以用来赋值。

{% highlight javascript %}

o.p = "abc";
o["p"] = "abc";

{% endhighlight %}

查看一个对象本身的所有属性，可以使用Object.keys方法。

{% highlight javascript %}

var o = {
	key1: 1,
	key2: 2
};

Object.keys(o);
// ["key1", "key2"]

{% endhighlight %}

### 属性的增加与删除

JavaScript允许属性的“后绑定”，也就是说，你可以在任意时刻新增属性，没必要在定义对象的时候，就定义好属性。
isExtensible
{% highlight javascript %}

var o = { p:1 };

// 等价于

var o = {};
o.p = 1;

{% endhighlight %}

delete命令可以删除属性。

{% highlight javascript %}

var o = { p:1 };

delete o.p

o.p
// undefined

{% endhighlight %}

### 对象的引用

如果不同的变量名指向同一个对象，那么它们都是这个对象的引用，也就是说指向同一个内存地址。修改其中一个变量，会影响到其他所有变量。

{% highlight javascript %}

var v1 = {};

var v2 = v1;

v1.a = 1;

v2.a
// 1

{% endhighlight %}

这种引用只局限于对象，对于原始类型的数据，则是传值引用，也就是说，都是值的拷贝。

{% highlight javascript %}

var x = 1;

var y = x;

y
// 1

x = 2;
y
// 2

{% endhighlight %}

上面的代码中，当x的值发生变化后，y的值并不变，这就表示y和x并不是指向同一个内存地址。

## 类似数组的对象

在JavaScript中，有些对象被称为“类似数组的对象”（array-like object）。意思是，它们看上去很像数组，可以使用length属性，但是它们并不是数组，所以无法使用一些数组的方法。典型的例子是arguments对象，以及大多数DOM元素集。

## with语句

它的格式如下，其中的括号不是必需的：

{% highlight javascript %}

 with (object)
        statement

{% endhighlight %}

作用是当操作同一个对象的多个属性时，提供一些书写的方便。

{% highlight javascript %}

o.p1 = 1;
o.p2 = 2;

// 等同于

with (o){
	p1 = 1;
	p2 = 2;
}
	
{% endhighlight %}

这里需要注意的是，在with区块内部依然是全局作用域。

{% highlight javascript %}

with ({}){
	var x = "abc";
}

x
// "abc"
	
{% endhighlight %}

with语句有很大的弊病，主要问题是绑定对象不明确，会产生意想不到的结果，并且在浏览器编译时无法优化。

{% highlight javascript %}

var x = 1;

var o = {};

with (o) {
	console.log(x);
}
// 1

{% endhighlight %}

上面代码的with区块中的x，表面上应该属于o对象，但是实际上属于全局对象，这非常不利于代码的除错和模块化。因此，建议不要使用with语句，可以考虑用一个临时变量代替。

{% highlight javascript %}

with(o1.o2.o3) {
        console.log(p1 + p2);
    }

// 可以写成

var b = o1.o2.o3;
console.log(b.p1 + b.p2);

{% endhighlight %}

## 属性模型

ECMAScript 5对于对象的属性，提出了一个更精确的模型。

### 存取函数（accessor）

除了直接定义值以外，属性还可以用存取函数（accessor）定义。其中，存值函数称为setter，使用set关键字；取值函数称为getter，使用getter关键字。

{% highlight javascript %}

var o = {

	get p() {
		return "getter";
    },

    set p(value) {
        console.log("setter: "+value);
    }
}

{% endhighlight %}

定义存取函数之后，引用该属性时，取值函数会自动调用；赋值该属性时，存值函数会自动调用。

{% highlight javascript %}

o.p
// getter

o.p = 123;
// setter: 123

{% endhighlight %}

### 属性的attributes对象

在JavaScript内部，每个属性都有一个对应的attributes对象，保存该属性的一些元信息。

attributes对象包含如下属性：

- value：表示该属性的值，默认为undefined。
- writable：表示该属性的值（value）是否可以改变，默认为true。
- enumerable： 表示该属性是否可枚举，默认为true，也就是该属性会出现在for...in和Object.keys()等操作中。
- configurable：该属性是否可配置，默认为true，也就是你可以删除该属性，可以改变该属性的各种性质（比如writable和enumerable）。configurable控制该属性“元数据”的可写状态。
- get：表示该属性的取值函数（getter），默认为undefined。
- set：表示该属性的存值函数（setter），默认为undefined。

有了attributes对象，就可以描述其对应的属性。

{% highlight javascript %}

    {
        value: 123,
        writable: false,
        enumerable: true,
        configurable: false
    }

{% endhighlight %}

### Object.defineProperty方法

该方法允许通过定义attributes对象，来定义一个属性，然后返回修改后的对象。它的格式是

{% highlight javascript %}

Object.defineProperty(object, propertyName, attributesObject)

{% endhighlight %}

比如，定义o对象的p属性可以这样写：

{% highlight javascript %}

var o = Object.defineProperty({}, "p", {
        value: 123,
        writable: false,
        enumerable: true,
        configurable: false
});

o.p
// 123

o.p = 246;
o.p
// 123
// 因为writable为false，所以无法改变该属性的值

{% endhighlight %}

如果一次性定义多个属性，可以使用Object.defineProperties方法。

{% highlight javascript %}

var o = Object.defineProperties({}, {
		p1: { value: 123, enumerable: true },
        p2: { value: "abc", enumerable: true }
});

o.p1
// 123

o.p2
// "abc"

{% endhighlight %}

### 控制对象的可写性

(1) Object.preventExtensions方法，可以使得一个对象无法再添加新的属性。

{% highlight javascript %}

var o = new Object();

Object.preventExtensions(o);

Object.defineProperty(o, "t", { value: "hello" });

// TypeError: Cannot define property:t, object is not extensible.

{% endhighlight %}

Object.isExtensible方法用于检查一个对象是否使用了preventExtensions方法。

{% highlight javascript %}

var o = new Object();

Object.preventExtensions(o);

Object.isExtensible(o)
// false

{% endhighlight %}

(2) Object.seal方法，可以使得一个对象即无法添加新属性，也无法删除旧属性，处于被封闭状态。

{% highlight javascript %}

var o = {t:"hello"};

Object.seal(o);

delete o.t;
// false

{% endhighlight %}

Object.isSealed()用于检查一个对象是否使用了Object.seal方法。

(3) Object.freeze方法，可以使得一个对象无法添加新属性、无法删除旧属性、也无法改变属性的值，使得这个对象实际上变成了常量。

{% highlight javascript %}

var o = {t:"hello"};

Object.freeze(o);

o.t = "world";

console.info(o.t);
// hello

{% endhighlight %}

Object.isFrozen方法用于检查一个对象是否使用了Object.freeze()方法。

需要注意的是，即使使用上面这些方法锁定对象的可写性，我们依然可以通过改变该对象的原型对象，来为它增加属性。

{% highlight javascript %}

var o = new Object();

Object.preventExtensions(o);

var proto = Object.getPrototypeOf(o);

proto.t = "hello";

o.t
// hello

{% endhighlight %}

### Object.getOwnPropertyDescriptor方法

该方法返回属性的attributes对象，格式如下

{% highlight javascript %}

Object.getOwnPropertyDescriptor(object, property)

{% endhighlight %}

使用方法如下:

{% highlight javascript %}

> var o = Object.defineProperty({}, "p", {
        value: 123,
        enumerable: true
});

> Object.getOwnPropertyDescriptor(o, "p")
{
	configurable: false
	enumerable: true
	value: 123
	writable: false
}

{% endhighlight %}

### 可枚举性

可枚举性（enumerable）与两个操作有关：for-in和Object.keys。如果某个属性的可枚举性为true，则前面两个操作的返回结果都包括该属性；如果为false，就不包括。

假定，对象o有两个属性p1和p2，可枚举性分别为true和false。

{% highlight javascript %}

var o = Object.defineProperties({}, {
        p1: { value: 1, enumerable: true },
        p2: { value: 2, enumerable: false }
});

{% endhighlight %}

那么，for-in操作和Object.keys操作的返回结果，将不包括p2。

{% highlight javascript %}

> for (var x in o) console.log(x);
  p1

> Object.keys(o)
  ["p1"]

{% endhighlight %}

除了上面两个操作，其他操作都不受可枚举性的影响。

{% highlight javascript %}

 > Object.getOwnPropertyNames(o)
 ["p1", "p2"]

{% endhighlight %}

一般来说，系统原生的属性（即非用户自定义的属性）都是不可枚举的。

{% highlight javascript %}

  > Object.keys([])
  []
 
  > Object.getOwnPropertyNames([])
  [ 'length' ]

  > Object.keys(Object.prototype)
  []

  > Object.getOwnPropertyNames(Object.prototype)
  [ 'hasOwnProperty',
    'valueOf',
    'constructor',
    'toLocaleString',
    'isPrototypeOf',
    'propertyIsEnumerable',
    'toString' ]

{% endhighlight %}

for...in循环会列出对象自身的可枚举属性，以及对象继承的可枚举属性。

{% highlight javascript %}

for (name in object) { 
	if (object.hasOwnProperty(name)) { .... } 
}

{% endhighlight %}

Object.keys则只会列出对象自身的可枚举属性。

{% highlight javascript %}

Object.keys(obj).forEach( function(key) {
    console.log(key);
});

{% endhighlight %}

propertyIsEnumerable方法用来判断一个属性是否可枚举。

{% highlight javascript %}

Object.prototype.propertyIsEnumerable("toString")
// false

{% endhighlight %}

## 参考链接

- Dr. Axel Rauschmayer，[Object properties in JavaScript](http://www.2ality.com/2012/10/javascript-properties.html)
- Lakshan Perera, [Revisiting JavaScript Objects](http://www.laktek.com/2012/12/29/revisiting-javascript-objects/)
- Angus Croll, [The Secret Life of JavaScript Primitives](http://javascriptweblog.wordpress.com/2010/09/27/the-secret-life-of-javascript-primitives/)i
- Dr. Axel Rauschmayer, [JavaScript’s with statement and why it’s deprecated](http://www.2ality.com/2011/06/with-statement.html)

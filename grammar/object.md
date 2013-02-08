---
title: 对象
layout: page
category: grammar
date: 2012-12-12
modifiedOn: 2013-02-08
---

## 概述

### 字典结构

对象（object）是Javascript语言对字典结构（dictionary）的实现，由若干个“键值对”（key-value）构成。

{% highlight javascript %}

var o = {

	p: "Hello World"

};

{% endhighlight %}

上面代码中的o被定义为对象，里面包含一个键值对，这个键值对就是对象o的成员。其中，p是“键”（成员的名称），“Hello World”是“值”（成员的值）。

“键”又称为“属性”（property）。它的“值”可以是数值、字符串，也可以是函数或其他对象。属性之间用逗号分隔，最后一个属性后面可以加逗号（trailing comma），也可以不加。

{% highlight javascript %}

   var obj = {
        foo: 123,
        bar: function () { ... },
    }

{% endhighlight %}

上面的代码中bar属性后面的那个逗号，有或没有都不算错。

### 生成方法

对象用大括号{}表示。

生成一个对象，可以直接用{}，可以用new Object()命令。

{% highlight javascript %}

var o = {};

// or

var o = new Object();

{% endhighlight %}

### 引用方法

引用一个属性，有两种方法，一种是点结构，还有一种是方括号。

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

### 变量名是对象的引用

如果不同的变量名指向同一个对象，那么它们都是这个对象的引用。修改其中一个变量，会影响到其他所有变量。

{% highlight javascript %}

var v1 = {};

var v2 = v1;

v1.a = 1;

v2.a
// 1

{% endhighlight %}

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

## 原始类型的包装对象

Javascript的三种原始类型的值（数字、字符串、布尔值），都有对应的包装对象。也就是说，可以用对象形式获得这些值。它们对应的对象名分别是Number、String、Boolean。

以下分别用原始类型和包装对象两种形式，获取同一个值。

{% highlight javascript %}

var v = 123;
var v = new Number(123);

var v = "abc";
var v = new String("abc");

var v = true;
var v = new Boolean(true);

{% endhighlight %}

这两种类型的变量，虽然都对应同一个值，但是类型不一样。包装对象属于Object类型，用typeof运算符就可以看出来。

{% highlight javascript %}

typeof "abc"
//  'string'
 
typeof new String("abc")
// 'object'

{% endhighlight %}

原始类型的值不是Object对象的实例，但是包装对象是Object对象的实例。

{% highlight javascript %}

"abc" instanceof Object
// false
 
new String("abc") instanceof Object
// true

{% endhighlight %}

### 包装对象的目的

它提供了一系列方法，使得Javascript可以使用同样的一套规范，描述所有的值。

首先，包装对象有一些原生方法可以使用。

valueOf方法，返回该对象对应的原始类型的值。

{% highlight javascript %}

new Number(123).valueOf()
// 123

new String("abc").valueOf()
// "abc"

new Boolean("true").valueOf()
// true

{% endhighlight %}

toString方法，返回该对象的值的字符串形式。

{% highlight javascript %}

new Number(123).toString()
// "123"

new String("abc").toString()
// "abc"

new Boolean("true").toString()
// "true"

{% endhighlight %}

如果不加new关键字，直接调用包装对象，则相当于生成实例后再调用valueOf方法。

{% highlight javascript %}

Number(123)
// 123

String("abc")
// "abc"

Boolean(true)
// true

{% endhighlight %}

除了valueOf和toString方法，字符串对象还有length属性，返回字符串的长度。

{% highlight javascript %}

var v = new String("abc");

v.length
// 3

"abc".length
// 3

{% endhighlight %}

其次，可以包装对象的原型上添加自定义方法。比如，我们可以新增一个double方法，使得字符串和数字翻倍。

{% highlight javascript %}

String.prototype.double = function (){

	return this.valueOf() + this.valueOf();

};

"abc".double()
// abcabc

Number.prototype.double = function (){

	return this.valueOf() + this.valueOf();

};

(123).double()
// 246

{% endhighlight %}

### 自动转化

如果对原始类型的值使用原生方法或自定义方法，原始类型会自动转化成包装对象。

{% highlight javascript %}

var v = 123;

v.valueOf()
// 123

{% endhighlight %}

如果使用的是未定义的方法或属性，原始类型不会自动转化。

{% highlight javascript %}

var v = 123;

v.x = 246;

v.x
// undefined

v.x = function (){};

v.x()
// 报错

{% endhighlight %}

如果包装对象与原始类型进行混合运算，包装对象会转化为原始类型（实际是调用自身的valueOf方法）。

{% highlight javascript %}

new Number(123) + 123
// 246

new String("abc") + "abc"
// "abcabc"

{% endhighlight %}

特别要注意的是，如果要获取布尔对象的值，必须显式引用。

{% highlight javascript %}

if (new Boolean(false)) {

    console.info("true"); 

}
// true

if (new Boolean(false).valueOf()) {

    console.info("true"); 

}
// 无输出

{% endhighlight %}

如果要求一个变量对应的布尔值，规范的写法如下：

{% highlight javascript %}

var a = "";

new Boolean(a).valueOf()
//false

{% endhighlight %}

简洁的写法是：

{% highlight javascript %}

var a = "";

Boolean(a)
//false

{% endhighlight %}

还有更简洁的写法：

{% highlight javascript %}

var a = "";

!!a
//false

{% endhighlight %}

## 类似数组的对象

在JavaScript中，有些对象被称为“类似数组的对象”（array-like object）。意思是，它们看上去很像数组，可以使用length属性，但是它们并不是数组，所以无法使用一些数组的方法。典型的例子是arguments对象，以及大多数DOM元素集。

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
- writable：表示该属性的值（value）是否可以改变，默认为false。
- enumerable： 该属性是否可枚举，默认为false。
- configurable：该属性是否可配置，false。当为false时，你无法删除该属性，除了value，无法改变该属性的其他性质。Configurable控制该属性元数据的可写状态。
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

Object.preventExtensions方法，可以使得一个对象无法再添加新的属性。

{% highlight javascript %}

var o = new Object();

Object.preventExtensions(o);

Object.defineProperty(o, "t", { value: "hello" });

// TypeError: Cannot define property:t, object is not extensible.

{% endhighlight %}

Object.seal方法，可以使得一个对象即无法添加新属性，也无法删除旧属性，处于被封闭状态。

{% highlight javascript %}

var o = {t:"hello"};

Object.seal(o);

delete o.t;
// false

{% endhighlight %}

Object.freeze方法，可以使得一个对象无法添加新属性、无法删除旧属性、也无法改变属性的值，使得这个对象实际上变成了常量。

{% highlight javascript %}

var o = {t:"hello"};

Object.freeze(o);

o.t = "world";

console.info(o.t);
// hello

{% endhighlight %}

你可以使用Object.isSealed、Object.isFrozen、Object.isExtensible检查某个对象目前的状态。

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

## 参考链接

- Dr. Axel Rauschmayer，[Object properties in JavaScript](http://www.2ality.com/2012/10/javascript-properties.html)
- Lakshan Perera, [Revisiting JavaScript Objects](http://www.laktek.com/2012/12/29/revisiting-javascript-objects/)
- Angus Croll, [The Secret Life of JavaScript Primitives](http://javascriptweblog.wordpress.com/2010/09/27/the-secret-life-of-javascript-primitives/)i
- Dr. Axel Rauschmayer, [JavaScript’s with statement and why it’s deprecated](http://www.2ality.com/2011/06/with-statement.html)

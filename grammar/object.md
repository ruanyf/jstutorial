---
title: 对象
layout: page
category: grammar
date: 2012-12-12
modifiedOn: 2013-08-28
---

## 概述

对象（object）是一种数据结构，由若干个“键值对”（key-value）构成。

{% highlight javascript %}

var o = {
	p: "Hello World"
};

{% endhighlight %}

上面代码中，大括号就代表一个对象，被赋值给变量o。这个对象内部包含一个键值对（又称为“成员”），p是“键名”（成员的名称），字符串“Hello World”是“键值”（成员的值）。键名与键值之间用逗号分隔。

键名加不加引号都可以，上面的代码也可以写成下面这样：

{% highlight javascript %}

var o = {
	"p": "Hello World"
};

{% endhighlight %}

但是如果键名不符合标识名的条件（即包含数字、字母、下划线以外的字符，且第一个字符不是数字），则必须加上引号。

{% highlight javascript %}

var o = {
	"1p": "Hello World",
	"h w": "Hello World",
	"p+q": "Hello World"
};

{% endhighlight %}

“键名”又称为“属性”（property），它的“键值”可以是任何数据类型。如果一个属性的值为函数，通常把这个属性称为“方法”。

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

对象的生成方法，除了像上面那样直接使用{}，还可以用new Object()命令。

{% highlight javascript %}

var o = {};

// or

var o = new Object();

{% endhighlight %}

上面两行语句是等价的。

### 读取属性

读取一个属性，有两种方法，一种是使用点运算符，还有一种是使用方括号运算符。

{% highlight javascript %}

var o = {
	p: "Hello World"
};

// 点运算符
o.p
// "Hello World"

// 方括号运算符
o["p"]
// "Hello World"

{% endhighlight %}

可以看到，如果使用方括号，键名必须放在引号里面，否则会被当作变量处理。

{% highlight javascript %}

var o = {
	p: "Hello World"
};

o[p]
// undefined

{% endhighlight %}

上面代码中的o[p]的值之所以是undefined，是因为p被当作变量，而这个变量是不存在的，所以等同于读取o[undefined]，也就是读取对象中一个没有定义的键。

{% highlight javascript %}

o[undefined]
// undefined

{% endhighlight %}

上面代码说明，如果读取一个不存在的键，会返回undefined，而不是报错。可以利用这一点，来检查一个变量是否被声明。

{% highlight javascript %}

// 报错
if(a) {
	a += 1;
}
// ReferenceError: a is not defined	

// 不报错
if(window.a) {
	a += 1;
}
// undefined

{% endhighlight %}

上面的第二种写法之所以不报错，是因为在浏览器环境，所有全局变量都是window对象的成员。window.a的含义就是读取window对象的a键，如果该键不存在，就返回undefined，而不会报错。

点运算符和方括号运算符，不仅可以用来读取值，还可以用来赋值。

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

with语句的格式如下：

{% highlight javascript %}

with (object)
	statement

{% endhighlight %}

它的作用是操作同一个对象的多个属性时，提供一些书写的方便。

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

var o = {};

with (o){
	x = "abc";
}

o.x
// undefined

x
// "abc"
	
{% endhighlight %}

这意味着，如果你要在with语句内部，赋值对象某个属性，这个属性必须已经存在，否则你就是声明了一个全局变量。

{% highlight javascript %}

var o = {};

o.x = 1;

with (o){
	x = 2;
}

o.x
// 2
	
{% endhighlight %}

with语句有很大的弊病，主要问题是绑定对象不明确。

{% highlight javascript %}

with (o) {
	console.log(x);
}

{% endhighlight %}

单纯从上面的代码块，根本无法判断x到底是全局变量，还是o对象的一个属性。这非常不利于代码的除错和模块化。因此，建议不要使用with语句，可以考虑用一个临时变量代替with。

{% highlight javascript %}

with(o1.o2.o3) {
        console.log(p1 + p2);
    }

// 可以写成

var temp = o1.o2.o3;
console.log(temp.p1 + temp.p2);

{% endhighlight %}

## 属性模型

ECMAScript 5对于对象的属性，提出了一个更精确的模型。

### 存取函数（accessor）

除了直接定义以外，属性还可以用存取函数（accessor）定义。其中，存值函数称为setter，使用set关键字；取值函数称为getter，使用get关键字。

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

attributes对象包含如下元信息：

- value：表示该属性的值，默认为undefined。
- writable：表示该属性的值（value）是否可以改变，默认为true。
- enumerable： 表示该属性是否可枚举，默认为true，也就是该属性会出现在for...in和Object.keys()等操作中。
- configurable：该属性是否可配置，默认为true，也就是你可以删除该属性，可以改变该属性的各种性质（比如writable和enumerable）。configurable控制该属性“元信息”的读写状态。
- get：表示该属性的取值函数（getter），默认为undefined。
- set：表示该属性的存值函数（setter），默认为undefined。

有了attributes对象，就可以精确描述其对应的属性。前面代码中o对象的p属性，它的attributes对像就是像下面这样：

{% highlight javascript %}

    {
        value: 123,
        writable: false,
        enumerable: true,
        configurable: false
    }

{% endhighlight %}

### Object.defineProperty方法

defineProperty方法允许通过定义attributes对象，来定义一个属性，然后返回修改后的对象。它的格式如下

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

Object.getOwnPropertyDescriptor方法可以读取attributes对象。

{% highlight javascript %}

var o = { p: 'a' };

Object.getOwnPropertyDescriptor(o, 'p') 
// Object {value: "a", writable: true, enumerable: true, configurable: true}

{% endhighlight %}

### 控制对象的可写性

(1) Object.preventExtensions方法

该方法可以使得一个对象无法再添加新的属性。

{% highlight javascript %}

var o = new Object();

Object.preventExtensions(o);

o.p = 1;

o.p
// undefined

Object.defineProperty(o, "p", { value: "hello" });

// TypeError: Cannot define property:p, object is not extensible.

{% endhighlight %}

如果是在严格状态，则会抛出一个错误。

{% highlight javascript %}

(function () { 'use strict'; o.p = '1' }());
// TypeError: Can't add property bar, object is not extensible

{% endhighlight %}

不过，对于使用了preventExtensions方法的对象，可以用delete命令删除它的现有属性。

{% highlight javascript %}

var o = new Object();

o.p = 1;

Object.preventExtensions(o);

delete o.p;

o.p
// undefined

{% endhighlight %}

Object.isExtensible方法用于检查一个对象是否使用了preventExtensions方法。

{% highlight javascript %}

var o = new Object();

Object.preventExtensions(o);

Object.isExtensible(o)
// false

{% endhighlight %}

(2) Object.seal方法

该方法可以使得一个对象既无法添加新属性，也无法删除旧属性。

{% highlight javascript %}

var o = { p:"hello" };

Object.seal(o);

delete o.p;

o.p
// "hello"

{% endhighlight %}

Object.seal还把现有属性的元信息对象attributes的configurable设为false，使得attributes对象不再能改变（只读属性保持只读，可枚举属性保持可枚举）。

{% highlight javascript %}

var o = { p: 'a' };

// seal方法之前
Object.getOwnPropertyDescriptor(o, 'p')
// Object {value: "a", writable: true, enumerable: true, configurable: true}

Object.seal(o);

// seal方法之后
Object.getOwnPropertyDescriptor(o, 'p') 
// Object {value: "a", writable: true, enumerable: true, configurable: false}

Object.defineProperty(o, 'p', { enumerable: false })
// TypeError: Cannot redefine property: p

{% endhighlight %}

从上面代码可以看到，使用seal方法之后，attributes对象的configurable就变成了false，然后如果想改变enumerable就会报错。（但是，出于历史原因，这时依然可以将writable从true变成false。）

需要注意的是，使用seal方法之后，依然可以对现有属性重新赋值。

{% highlight javascript %}

var o = { p: 'a' };

Object.seal(o);

o.p = 'b';

o.p
// 'b'

{% endhighlight %}

Object.isSealed方法用于检查一个对象是否使用了Object.seal方法。

{% highlight javascript %}

var o = { p: 'a' };

Object.seal(o);

Object.isSealed(o)
// true

{% endhighlight %}

另外，这时isExtensible方法也返回false。

{% highlight javascript %}

var o = { p: 'a' };

Object.seal(o);

Object.isExtensible(o)
// false

{% endhighlight %}		

(3) Object.freeze方法

该方法可以使得一个对象无法添加新属性、无法删除旧属性、也无法改变属性的值，使得这个对象实际上变成了常量。

{% highlight javascript %}

var o = {p:"hello"};

Object.freeze(o);

o.p = "world";

o.p
// hello

{% endhighlight %}

上面代码中，对现有代码重新赋值，并不会报错，只是默默地失败。但是，如果是在严格模式下，就会报错。

{% highlight javascript %}

var o = {p:"hello"};

Object.freeze(o);

(function () { 'use strict'; o.p = "world";}())
// TypeError: Cannot assign to read only property 'p' of #<Object>

(function () { 'use strict'; o.t = 123;}())
// TypeError: Can't add property t, object is not extensible

{% endhighlight %}

Object.isFrozen方法用于检查一个对象是否使用了Object.freeze()方法。

{% highlight javascript %}

var o = {p:"hello"};

Object.freeze(o);

Object.isFrozen(o)
// true

{% endhighlight %}

需要注意的是，即使使用上面这些方法锁定对象的可写性，我们依然可以通过改变该对象的原型对象，来为它增加属性。

{% highlight javascript %}

var o = new Object();

Object.preventExtensions(o);

var proto = Object.getPrototypeOf(o);

proto.t = "hello";

o.t
// hello

{% endhighlight %}

### 可枚举性

可枚举性（enumerable）与两个操作有关：for...in和Object.keys。如果某个属性的可枚举性为true，则这两个操作的循环过程都包括该属性；如果为false，就不包括。

假定，对象o有两个属性p1和p2，可枚举性分别为true和false。

{% highlight javascript %}

var o = Object.defineProperties({}, {
        p1: { value: 1, enumerable: true },
        p2: { value: 2, enumerable: false }
});

{% endhighlight %}

那么，for...in操作和Object.keys操作的循环过程，将不包括p2。

{% highlight javascript %}

for (var x in o) console.log(x);
// p1

Object.keys(o)
// ["p1"]

{% endhighlight %}

除了上面两个操作，其他操作都不受可枚举性的影响。

{% highlight javascript %}

Object.getOwnPropertyNames(o)
// ["p1", "p2"]

{% endhighlight %}

一般来说，系统原生的属性（即非用户自定义的属性）都是不可枚举的。

{% highlight javascript %}

Object.keys([])
// []
 
Object.getOwnPropertyNames([])
// [ 'length' ]

Object.keys(Object.prototype)
// []

Object.getOwnPropertyNames(Object.prototype)
// ['hasOwnProperty',
    'valueOf',
    'constructor',
    'toLocaleString',
    'isPrototypeOf',
    'propertyIsEnumerable',
    'toString']

{% endhighlight %}

上面代码可以看到，空数组（[]）没有可枚举属性，不可枚举属性有length；Object.prototype对象也没有可枚举属性，但是有不少不可枚举属性。

需要注意的是，Object.keys只会列出对象自身的可枚举属性，不包括对象继承的可枚举属性；for...in循环则会列出所有的可枚举属性，包括对象继承的可枚举属性。

{% highlight javascript %}

for (key in []){
	console.log(key);
}
// copy
// first
// fitIndex
// scramble
// add
// remove
// toJSON

for (key in Object.prototype){
	console.log(key);
}
// undefined

{% endhighlight %}

上面代码可以看到，空数组（[]）继承的可枚举属性有不少，而Object.prototype对象处于继承链的顶部，没有可枚举的属性。

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

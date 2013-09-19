---
title: Object对象
layout: page
category: stdlib
date: 2013-04-30
modifiedOn: 2013-09-19
---

## 概述

JavaScript原生提供一个Object对象（注意起首的O是大写），它本身是一个构造函数，可以直接通过它来生成新对象。

{% highlight javascript %}

var o = new Object();

// 或者

var o = {};

typeof o
// "object"

{% endhighlight %}

通过new Object() 的写法生成新对象，与字面量的写法 o = {} 是等价的。建议采用前者，因为这能更清楚地显示一行语句的目的。

与Object对象相关的方法，分成两种。一种是Object对象本身的方法，比如在Object对象上面定义一个print方法，显示其他对象的内容。

{% highlight javascript %}

Object.print = function(o){ console.log(o) };

var o = {p:"abc"};

Object.print(o)
// Object {p: "abc"}

{% endhighlight %}

还有一种是Object实例对象的方法。因为Object也是一个构造函数，有些方法是定义在构造函数里面的，或者定义在Object的原型上面（详细解释参见后面的《面向对象编程》一章）。这时，Object本身不能使用这些方法，但是它的实例对象可以使用。

{% highlight javascript %}

Object.prototype.print = function(){ console.log(this)};

var o = {p:"abc"};

o.print()
// Object {p: "abc", print: function}

{% endhighlight %}

JavaScript的所有其他对象，都是继承自Object对象。也就是说，所有其他对象都是从Object衍生出来的（详细介绍见《面向对象编程》一章），都是object的实例对象。因此，Object实例对象的方法会被衍生对象继承，即所有其他对象都可以直接调用Object的实例方法。

## Object实例对象的方法

Object实例对象提供的两种最主要的方法是valueOf()和toString()。前者将一个对象转化为原始类型的值，后者将一个对象转化为字符串。

除非自定义这两种方法，否则，调用valueOf方法，返回Object对象本身；调用toString方法，返回“[object Object]”字符串。

{% highlight javascript %}

var o = {p:1};

o.valueOf()
// Object {p: 1}

o.toString()
// "[object Object]"

{% endhighlight %}

这两种方法的意义在于，某些场合JavaScript需要自动将对象转化为原始类型，转化的结果就取决于这两个方法，具体请参见上一章的《数据类型转换》。

另外，定义在Object.prototype对象上面的toString方法会返回某些对象的详细类型，比如数组会返回“[object Array]”，正则对象会返回“[object RegExp]”，比typeof运算符更详细。注意，只有定义在Object.prototype对象上面的toString方法，才有这个特性，因为其他对象往往部署了自己的toString方法。

{% highlight javascript %}

var proto = Object.prototype;

proto.toString.call([1,2,3])
// '[object Array]'

proto.toString.call(/xyz/)
// '[object RegExp]'

{% endhighlight %}

利用这一点，可以写一个更准确的toType函数，返回各种对象的类型。

{% highlight javascript %}

var toType = function(obj) {
      return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
};

toType({a: 4}) // "object"
toType([1, 2, 3]) // "array"
(function() { return toType(arguments) }()) // "arguments"
toType(new ReferenceError()) // "error"
toType(new Date()) // "date"
toType(/a-z/) // "regexp"
toType(Math) // "math"
toType(JSON) // "json"
toType(new Number(4)) // "number"
toType(new String("abc")) // "string"
toType(new Boolean(true)) // "boolean"

{% endhighlight %}

## 对象的属性模型

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

- **value**：表示该属性的值，默认为undefined。

- **writable**：表示该属性的值（value）是否可以改变，默认为true。

- **enumerable**： 表示该属性是否可枚举，默认为true，也就是该属性会出现在for...in和Object.keys()等操作中。

- **configurable**：该属性是否可配置，默认为true，也就是你可以删除该属性，可以改变该属性的各种性质（比如writable和enumerable）。configurable控制该属性“元信息”的读写状态。

- **get**：表示该属性的取值函数（getter），默认为undefined。

- **set**：表示该属性的存值函数（setter），默认为undefined。

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

defineProperty方法允许通过定义attributes对象，来定义或修改一个属性，然后返回修改后的对象。它的格式如下

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

### Object.defineProperties方法

如果一次性定义或修改多个属性，可以使用Object.defineProperties方法。

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

### Object.getOwnPropertyDescriptor方法

Object.getOwnPropertyDescriptor方法可以读取attributes对象。

{% highlight javascript %}

var o = { p: 'a' };

Object.getOwnPropertyDescriptor(o, 'p') 
// Object {value: "a", writable: true, enumerable: true, configurable: true}

{% endhighlight %}

### 可枚举性enumerable

**（1）for...in和Object.keys**

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

**（2）Object.getOwnPropertyNames方法**

该方法返回直接定义在某个对象上面的全部属性的名称，而不管该属性是否可枚举。

{% highlight javascript %}

var o = Object.defineProperties({}, {
        p1: { value: 1, enumerable: true },
        p2: { value: 2, enumerable: false }
});

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

**（3）propertyIsEnumerable方法**

该方法用来判断一个属性是否可枚举。

{% highlight javascript %}

Object.prototype.propertyIsEnumerable("toString")
// false

{% endhighlight %}

### 可配置性configurable

可配置性（configurable）决定了是否可以删除（delete）某个属性，以及是否可以更改该属性的writable和enumerable性质。

{% highlight javascript %}

var o = Object.defineProperty({}, 'p', {value: 1, enumerable: false, configurable: false});

Object.defineProperty(o,'p', {enumerable: true})
// TypeError: Cannot redefine property: p

Object.defineProperties(o,'p',{configurable: true})
// TypeError: Cannot redefine property: p

{% endhighlight %}

上面代码首先生成对象o，并且定义它的属性p为不可枚举，也不可配置。然后，更改属性p为可枚举，这时解释引擎就会报错，表示不能更改该属性的enumerable性质，甚至也不能更改configurable性质。

但是，如果生成属性的时候，将可配置性configurable设为true，一切就不一样了。

{% highlight javascript %}

var o = Object.defineProperty({}, 'p', {value: 1, enumerable: false, configurable: true});

Object.defineProperty(o,'p', {enumerable: true})
// Object {p: 1}

{% endhighlight %}

上面代码表示，当可配置性改为true以后，更改可枚举性就能成功。

可配置性决定了一个变量是否可以被删除（delete）。

{% highlight javascript %}

var o = Object.defineProperties({}, {
        p1: { value: 1, configurable: true },
        p2: { value: 2, configurable: false }
});

delete o.p1 // true
delete o.p2 // false

o.p1 // undefined
o.p2 // 2

{% endhighlight %}

上面代码中的对象o有两个属性，p1是可配置的，p2是不可配置的。结果，p1就无法删除。

需要注意的是，当使用var命令声明变量时（实际上是声明当前作用域的属性），变量的可配置性为false。

{% highlight javascript %}

var a1 = 1;

Object.getOwnPropertyDescriptor(this,'a1')
// Object {value: 1, writable: true, enumerable: true, configurable: false}

{% endhighlight %}

而不使用var命令声明变量时（或者使用属性赋值的方式声明变量），变量的可配置性为true。

{% highlight javascript %}

a2 = 1;

Object.getOwnPropertyDescriptor(this,'a2')
// Object {value: 1, writable: true, enumerable: true, configurable: true}

// or

this.a3 = 1;

Object.getOwnPropertyDescriptor(this,'a3')
// Object {value: 1, writable: true, enumerable: true, configurable: true}

{% endhighlight %}

上面代码中的this.a3 = 1，与a3 =1 是等价的写法。this指的是当前的作用域，更多关于this的解释，参见《面向对象编程》一章。

这种差异意味着，如果一个变量是使用var命令生成的，就无法用delete命令删除，否则就可以。

{% highlight javascript %}

var a1 = 1;
a2 = 1;

delete a1 // false
delete a2 // true

a1 // 1
a2 // ReferenceError: a2 is not defined

{% endhighlight %}

### 控制对象的可写性

**(1) Object.preventExtensions方法**

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

**(2) Object.seal方法**

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

**(3) Object.freeze方法**

该方法可以使得一个对象无法添加新属性、无法删除旧属性、也无法改变属性的值，使得这个对象实际上变成了常量。

{% highlight javascript %}

var o = {p:"hello"};

Object.freeze(o);

o.p = "world";

o.p
// hello

{% endhighlight %}

上面代码中，对现有属性重新赋值（o.p = "world"），并不会报错，只是默默地失败。但是，如果是在严格模式下，就会报错。

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

## 参考链接

- Axel Rauschmayer, [Protecting objects in JavaScript](http://www.2ality.com/2013/08/protecting-objects.html)
- kangax, [Understanding delete](http://perfectionkills.com/understanding-delete/)

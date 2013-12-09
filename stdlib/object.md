---
title: Object对象
layout: page
category: stdlib
date: 2013-04-30
modifiedOn: 2013-11-08
---

## 概述

JavaScript原生提供一个Object对象（注意起首的O是大写），所有其他对象都继承自这个对象。Object本身也是一个构造函数，可以直接通过它来生成新对象。

{% highlight javascript %}

var o = new Object();

typeof o // "object"

{% endhighlight %}

上面代码表示，通过Object构造函数生成的新对象（又称“实例”），类型就是object。

> 注意，通过new Object() 的写法生成新对象，与字面量的写法 o = {} 是等价的。建议采用前者，因为这能更清楚地显示目的。

与其他构造函数一样，如果要在Object对象上面部署一个方法，有两种做法。

**（1）部署在Object对象本身**

比如，在Object对象上面定义一个print方法，显示其他对象的内容。

{% highlight javascript %}

Object.print = function(o){ console.log(o) };

var o = new Object();

Object.print(o)
// Object

{% endhighlight %}

**（2）部署在Object.prototype对象**

所有构造函数都有一个prototype属性，指向一个原型对象。凡是定义在Object.prototype对象上面的属性和方法，将被所有实例对象共享。（关于prototype属性的详细解释，参见《面向对象编程》一章。）

{% highlight javascript %}

Object.prototype.print = function(){ console.log(this)};

var o = new Object();

o.print() // Object 

{% endhighlight %}

上面代码在Object.prototype定义了一个print方法，然后生成一个Object的实例o。o直接继承了Object.prototype的属性和方法，可以在自身调用它们，也就是说，o对象的print方法实质上是调用Object.prototype.print方法。。

可以看到，尽管上面两种写法的print方法功能相同，但是用法是不一样的，因此必须区分“构造函数的方法”和“实例对象的方法”。

## Object实例对象的方法

Object实例对象继承的两种最主要的方法是valueOf和toString。

### valueOf方法

valueOf方法的作用是返回一个对象本身。

{% highlight javascript %}

var o = new Object();

o.valueOf() === o // true 

{% endhighlight %}

上面代码比较o的valueOf方法返回值与o本身，两者是一样的。

valueOf方法的主要用途是，JavaScript自动类型转换时会默认调用这个方法（详见上一章《数据类型转换》一节）。

{% highlight javascript %}

var o = new Object();

1 + o // "1[object Object]"

{% endhighlight %}

上面代码将对象o与数字1相加，这时JavaScript就会默认调用valueOf()方法。所以，如果自定义valueOf方法，就可以得到想要的结果。

{% highlight javascript %}

var o = new Object();
o.valueOf = function (){return 2;};

1 + o // 3

{% endhighlight %}

上面代码自定义了o对象的valueOf方法，于是1 + o就得到了3。这种方法就相当于用o.valueOf覆盖Object.prototype.valueOf。

### toString方法

toString方法的作用是返回一个对象的字符串形式。

{% highlight javascript %}

var o = new Object();

o.toString()

{% endhighlight %}

上面代码表示，对于一个对象调用toString方法，会返回[object Object]字符串。

通过自定义toString方法，可以让对象在自动类型转换时，得到想要的字符串形式。

除了将对象转为字符串，toString方法还有一个重要的作用，就是判断一个值的类型。使用call方法，可以在任意值上调用Object.prototype.toString方法，会返回这个值的构造函数，从而帮助我们判断这个值的类型。具体的返回值如下：

- 对于数值，返回[object Number]。
- 对于字符串，返回[object String]。
- 对于布尔值，返回[object Boolean]。
- 对于undefined，返回[object Undefined]。
- 对于null，返回[object Null]。
- 对于各种对象，返回"[object " + 构造函数的名称 + "]" 。

{% highlight javascript %}

Object.prototype.toString.call(2) // "[object Number]"
Object.prototype.toString.call('') // "[object String]"
Object.prototype.toString.call(true) // "[object Boolean]"
Object.prototype.toString.call(undefined) // "[object Undefined]"
Object.prototype.toString.call(null) // "[object Null]"
Object.prototype.toString.call(Math) // "[object Math]"
Object.prototype.toString.call({}) // "[object Object]"
Object.prototype.toString.call([]) // "[object Object]"

{% endhighlight %}

可以利用这个特性，写出一个比typeof运算符更准确的类型判断函数。

{% highlight javascript %}

var type = function (o){
	var s = Object.prototype.toString.call(o);
		return s.match(/\[object (.*?)\]/)[1].toLowerCase();
};

type({}); // "object"
type([]); // "array"
type(5); // "number"
type(null); // "null"
type(); // "undefined"
type(/abcd/); // "regex"
type(new Date()); // "date"

{% endhighlight %}

在上面这个type函数的基础上，还可以加上专门判断某种类型数据的方法。

{% highlight javascript %}

['Null',
 'Undefined',
 'Object',
 'Array',
 'String',
 'Number',
 'Boolean',
 'Function',
 'RegExp',
 'Element',
 'NaN',
 'Infinite'
].forEach(function (t) {
    type['is' + t] = function (o) {
        return type(o) === t.toLowerCase();
    };
});

type.isObject({}); // true
type.isNumber(NaN); // false
type.isElement(document.createElement('div')); // true
type.isRegExp(/abc/); // true

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

- **configurable**：该属性是否可配置，默认为true，也就是你可以删除该属性，可以改变该属性的各种性质（比如writable和enumerable等），即configurable控制该属性“元信息”的读写状态。

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

### Object.defineProperty方法，Object.defineProperties方法

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

对于没有定义的属性特征，Object.defineProperty() 和Object.defineProperties() 的默认设置为enumerable、configurable、writeable都为true。

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

可配置性（configurable）决定了是否可以删除（delete）某个属性，以及是否可以更改该属性attributes对象中除了value以外的性质。

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

上面代码中的对象o有两个属性，p1是可配置的，p2是不可配置的。结果，p2就无法删除。

需要注意的是，当使用var命令声明变量时（实际上是声明当前作用域的属性），变量的可配置性为false。

{% highlight javascript %}

var a1 = 1;

Object.getOwnPropertyDescriptor(this,'a1')
// Object {
//	value: 1, 
//	writable: true, 
//	enumerable: true, 
//	configurable: false
// }

{% endhighlight %}

而不使用var命令声明变量时（或者使用属性赋值的方式声明变量），变量的可配置性为true。

{% highlight javascript %}

a2 = 1;

Object.getOwnPropertyDescriptor(this,'a2')
// Object {
//	value: 1, 
//	writable: true, 
//	enumerable: true, 
//	configurable: true
// }

// or

this.a3 = 1;

Object.getOwnPropertyDescriptor(this,'a3')
// Object {
//	value: 1, 
//	writable: true, 
//	enumerable: true, 
//	configurable: true
// }

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

### 可写性writable

可写性（writable）决定了属性的值（value）是否可以被改变。

{% highlight javascript %}

var o = {}; 

Object.defineProperty(o, "a", { value : 37, writable : false });

o.a
// 37

o.a = 25;

o.a
// 37

{% endhighlight %}

上面代码将o对象的a属性可写性设为false，然后改变这个属性的值，就不会有任何效果。

这里需要注意的是，当对a属性重新赋值的时候，并不会抛出错误，只是静静地失败。但是，如果在严格模式下，这里就会抛出一个错误，即使是对a属性重新赋予一个同样的值。

### 控制对象状态

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

**（2）Object.isExtensible方法**

Object.isExtensible方法用于检查一个对象是否使用了preventExtensions方法。也就是说，该方法可以用来检查是否可以为一个对象添加属性。

{% highlight javascript %}

var o = new Object();

Object.isExtensible(o)
// true

Object.preventExtensions(o);
Object.isExtensible(o)
// false

{% endhighlight %}

上面代码新生成了一个o对象，对该对象使用Object.isExtensible方法，返回true，表示可以添加新属性。对该对象使用Object.preventExtensions方法以后，再使用Object.isExtensible方法，返回false，表示已经不能添加新属性了。

**(3) Object.seal方法**

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

**(4) Object.freeze方法**

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
- Jon Bretman, [Type Checking in JavaScript](http://techblog.badoo.com/blog/2013/11/01/type-checking-in-javascript/)

---
title: Object对象
layout: page
category: stdlib
date: 2013-04-30
modifiedOn: 2013-12-15
---

## 概述

JavaScript原生提供一个Object对象（注意起首的O是大写），所有其他对象都继承自这个对象。Object本身也是一个构造函数，可以直接通过它来生成新对象。

{% highlight javascript %}

var o = new Object();

{% endhighlight %}

Object作为构造函数使用时，可以接受一个参数。如果该参数是一个对象，则直接返回这个对象；如果是一个原始类型的值，则返回该值对应的包装对象。

{% highlight javascript %}

var o1 = {a:1};
var o2 = new Object(o1);
o1 === o2 // true

new Object(123) instanceof Number
// true

{% endhighlight %}

> 注意，通过new Object() 的写法生成新对象，与字面量的写法 o = {} 是等价的。

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

## Object对象的方法

### Object函数

Object本身当作工具方法使用时，可以将任意值转为对象。其中，原始类型的值转为对应的包装对象（参见《原始类型的包装对象》一节）。

{% highlight javascript %}

Object() // 返回一个空对象
Object(undefined) // 返回一个空对象
Object(null) // 返回一个空对象

Object(1) // 等同于 new Number(1)
Object('foo') // 等同于 new String('foo')
Object(true) // 等同于 new Boolean(true)

Object([]) // 返回原数组
Object({}) // 返回原对象
Object(function(){}) // 返回原函数

{% endhighlight %}

上面代码表示Object函数将各种值，转为对应的对象。

如果Object函数的参数是一个对象，它总是返回原对象。利用这一点，可以写一个判断变量是否为对象的函数。

{% highlight javascript %}

function isObject(value) {
    return value === Object(value);
}

{% endhighlight %}

### Object.keys方法，Object.getOwnPropertyNames方法

这两个方法很相似，它们的参数都是一个对象，都返回一个数组，成员都是是对象自身的（而不是继承的）所有属性名。它们的区别在于，Object.keys方法只返回可枚举的属性（关于可枚举性的详细解释见后文），Object.getOwnPropertyNames方法还返回不可枚举的属性名。

{% highlight javascript %}

var o = {
	p1: 123,
	p2: 456
}; 

Object.keys(o)
// ["p1", "p2"]

Object.getOwnPropertyNames(o)
// ["p1", "p2"]

{% endhighlight %}

上面的代码表示，对于一般的对象来说，这两个方法返回的结果是一样的。只有涉及不可枚举属性时，才会有不一样的结果，具体的例子请看下文《对象的属性模型》一节。

由于JavaScript没有提供计算对象属性个数的方法，所以可以用这两个方法代替。

{% highlight javascript %}

Object.keys(o).length

Object.getOwnPropertyNames(o).length

{% endhighlight %}

### Object.observe方法

Object.observe方法用于观察对象属性的变化。

{% highlight javascript %}

var o = {};

Object.observe(o, function(changes) {
  changes.forEach(function(change) {
    console.log(change.type, change.name, change.oldValue);
  });
});

o.foo = 1; // add, 'foo', undefined
o.foo = 2; // update, 'foo', 1
delete o.foo; // delete, 'foo', 2

{% endhighlight %}

上面代码表示，通过Object.observe函数，对o对象指定回调函数。一旦o对象的属性出现任何变化，就会调用回调函数，回调函数通过一个参数对象读取o的属性变化的信息。

该方法非常新，只有Chrome浏览器的最新版本才部署。

### 其他方法

除了上面提到的方法，Object还有不少其他方法，将在后文逐一详细介绍。

**（1）对象属性模型的相关方法**

- Object.getOwnPropertyDescriptor：获取某个属性的attributes对象。

- Object.defineProperty：通过attributes对象，定义某个属性。

- Object.defineProperties：通过attributes对象，定义多个属性。

- Object.getOwnPropertyNames：返回直接定义在某个对象上面的全部属性的名称。

**（2）控制对象状态的方法**

- Object.preventExtensions：防止对象扩展。

- Object.isExtensible：判断对象是否可扩展。

- Object.seal：禁止对象配置。

- Object.isSealed方法：判断一个对象是否可配置。

- Object.freeze：冻结一个对象。

- Object.isFrozen：判断一个对象是否被冻结。

**（3）原型链相关方法**

- Object.create：生成一个新对象，并该对象的原型。

- Object.getPrototypeOf：获取对象的Prototype对象。

## Object实例对象的方法

除了Object对象本身的方法，还有不少方法是部署在Object.prototype对象上的，所有Object的实例对象都继承了这些方法。

Object实例对象的方法，主要有以下六个。

- valueOf：返回当前对象对应的值。

- toString：返回当前对象对应的字符串形式。

- toLocalString：返回当前对象对应的本地字符串形式。

- hasOwnProperty：判断某个属性是否为当前对象自身的属性，还是继承自原型对象的属性。

- isPrototypeOf：判断当前对象是否为另一个对象的原型。

- propertyIsEnumerable：判断某个属性是否可枚举。

本节介绍前两个方法，其他方法将在后文相关章节介绍。

### valueOf方法

valueOf方法的作用是返回一个对象的值，默认情况下返回对象本身。

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

var o1 = new Object();
o1.toString() // "[object Object]"

var o2 = {a:1};
o2.toString() // "[object Object]"

{% endhighlight %}

上面代码表示，对于一个对象调用toString方法，会返回字符串[object Object]。

字符串[object Object]本身没有太大的用处，但是通过自定义toString方法，可以让对象在自动类型转换时，得到想要的字符串形式。

{% highlight javascript %}

var o = new Object();

o.toString = function (){ return 'hello' }; 

o + ' ' + 'world' // "hello world"

{% endhighlight %}

上面代码表示，当对象用于字符串加法时，会自动调用toString方法。由于自定义了toString方法，所以返回字符串hello world。

数组、字符串和函数都分别部署了自己版本的toString方法。

{% highlight javascript %}

[1,2,3].toString() // "1,2,3"

'123'.toString() // "123"

(function (){return 123}).toString() // "function (){return 123}"

{% endhighlight %}

### toString方法的应用：判断数据类型

toString方法的主要用途是返回对象的字符串形式，除此之外，还有一个重要的作用，就是判断一个值的类型。

{% highlight javascript %}

var o = {};
o.toString() // "[object Object]"

{% endhighlight %}

上面代码调用空对象的toString方法，结果返回一个字符串“object Object”，其中第二个Object表示该值的准确类型。这是一个十分有用的判断数据类型的方法。

实例对象的toString方法，实际上是调用Object.prototype.toString方法。使用call方法，可以在任意值上调用Object.prototype.toString方法，从而帮助我们判断这个值的类型。不同数据类型的toString方法返回值如下：

- 数值：返回[object Number]。
- 字符串：返回[object String]。
- 布尔值：返回[object Boolean]。
- undefined：返回[object Undefined]。
- null：返回[object Null]。
- 对象：返回"[object " + 构造函数的名称 + "]" 。

{% highlight javascript %}

Object.prototype.toString.call(2) // "[object Number]"
Object.prototype.toString.call('') // "[object String]"
Object.prototype.toString.call(true) // "[object Boolean]"
Object.prototype.toString.call(undefined) // "[object Undefined]"
Object.prototype.toString.call(null) // "[object Null]"
Object.prototype.toString.call(Math) // "[object Math]"
Object.prototype.toString.call({}) // "[object Object]"
Object.prototype.toString.call([]) // "[object Array]"

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

ECMAScript 5对于对象的属性，提出了一个精确的描述模型。

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

存取函数往往用于，某个属性的值需要依赖对象内部数据的场合。

{% highlight javascript %}

var o ={
	$n:5,
	get next(){return this.$n++ },
	set next(n) {
		if (n >= this.$n) this.$n = n;
		else throw "新的值必须大于当前值";
	}
};

o.next // 5

o.next = 10;
o.next //10

{% endhighlight %}

上面代码中，next属性的存值函数和取值函数，都依赖于对内部属性$n的操作。

存取函数也可以使用Object.create方法定义。

{% highlight javascript %}

var o = Object.create(
    Object.prototype, {  
        foo: { 
            get: function () {
                return 'getter';
            },
            set: function (value) {
                console.log('setter: '+value);
            }
        }
    }
);

{% endhighlight %}

### 属性的attributes对象，Object.getOwnPropertyDescriptor方法

在JavaScript内部，每个属性都有一个对应的attributes对象，保存该属性的一些元信息。使用Object.getOwnPropertyDescriptor方法，可以读取attributes对象。

{% highlight javascript %}

var o = { p: 'a' };

Object.getOwnPropertyDescriptor(o, 'p') 
// Object { value: "a", 
//			writable: true, 
//			enumerable: true, 
//			configurable: true
//	}

{% endhighlight %}

上面代码表示，使用Object.getOwnPropertyDescriptor方法，读取o对象的p属性的attributes对象。

attributes对象包含如下元信息：

- **value**：表示该属性的值，默认为undefined。

- **writable**：表示该属性的值（value）是否可以改变，默认为true。

- **enumerable**： 表示该属性是否可枚举，默认为true，也就是该属性会出现在for...in和Object.keys()等操作中。

- **configurable**：表示“可配置性”，默认为true。如果设为false，表示无法删除该属性，也不得改变attributes对象（value属性除外），也就是configurable属性控制了attributes对象的可写性。

- **get**：表示该属性的取值函数（getter），默认为undefined。

- **set**：表示该属性的存值函数（setter），默认为undefined。

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
        p2: { value: "abc", enumerable: true },
		p3: {
				get: function() { return this.p1+this.p2 },
				enumerable:true,
				configurable:true
		}
});

o.p1 // 123
o.p2 // "abc"
o.p3 // "123abc"

{% endhighlight %}

对于没有定义的属性特征，Object.defineProperty() 和Object.defineProperties() 的默认设置为enumerable、configurable、writeable都为true。

### 可枚举性enumerable

可枚举性（enumerable）与两个操作有关：for...in和Object.keys。如果某个属性的可枚举性为true，则这两个操作过程都会包括该属性；如果为false，就不包括。总体上，设计可枚举性的目的就是，告诉for...in循环，哪些属性应该被忽视。

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

除了上面两个操作，其他操作都不受可枚举性的影响。这两个操作的区别在于，for...in循环包括对象继承自原型对象的属性，而Object.keys方法只包括对象本身的属性。

### Object.getOwnPropertyNames方法

Object.getOwnPropertyNames方法返回直接定义在某个对象上面的全部属性的名称，而不管该属性是否可枚举。

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
//  'valueOf',
//  'constructor',
//  'toLocaleString',
//  'isPrototypeOf',
//  'propertyIsEnumerable',
//  'toString']

{% endhighlight %}

上面代码可以看到，数组的实例对象（[]）没有可枚举属性，不可枚举属性有length；Object.prototype对象也没有可枚举属性，但是有不少不可枚举属性。

### 对象实例的propertyIsEnumerable方法

对象实例的propertyIsEnumerable方法用来判断一个属性是否可枚举。

{% highlight javascript %}

var o = {};
o.p = 123;

o.propertyIsEnumerable("p") // true
o.propertyIsEnumerable("toString") // false

{% endhighlight %}

上面代码中，用户自定义的p属性是可枚举的，而继承自原型对象的toString属性是不可枚举的。

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

这种差异意味着，如果一个变量是使用var命令生成的，就无法用delete命令删除。也就是说，delete只能删除对象的属性。

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

o.a // 37
o.a = 25;
o.a // 37

{% endhighlight %}

上面代码将o对象的a属性可写性设为false，然后改变这个属性的值，就不会有任何效果。

这里需要注意的是，当对a属性重新赋值的时候，并不会抛出错误，只是静静地失败。但是，如果在严格模式下，这里就会抛出一个错误，即使是对a属性重新赋予一个同样的值。

关于可写性，还有一种特殊情况。就是如果原型对象的某个属性的可写性为false，那么派生对象将无法自定义这个属性。

{% highlight javascript %}

var proto = Object.defineProperty({}, 'foo', {
    value: 'a',
    writable: false
});

var o = Object.create(proto);

o.foo = 'b';
o.foo // 'a'

{% endhighlight %}

上面代码中，对象proto的foo属性不可写，结果proto的派生对象o，也不可以再自定义这个属性了。在严格模式下，这样做还会抛出一个错误。但是，有一个规避方法，就是通过覆盖attributes对象，绕过这个限制，原因是这种情况下，原型链会被完全忽视。

{% highlight javascript %}

Object.defineProperty(o, 'foo', { value: 'b' });

o.foo // 'b'

{% endhighlight %}

## 控制对象状态

JavaScript提供了三种方法，精确控制一个对象的读写状态，防止对象被改变。最弱一层的保护是preventExtensions，其次是seal，最强的freeze。 

###  Object.preventExtensions方法

Object.preventExtensions方法可以使得一个对象无法再添加新的属性。

{% highlight javascript %}

var o = new Object();

Object.preventExtensions(o);

Object.defineProperty(o, "p", { value: "hello" });
// TypeError: Cannot define property:p, object is not extensible.

o.p = 1;
o.p // undefined

{% endhighlight %}

如果是在严格模式下，则会抛出一个错误。

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
o.p // undefined

{% endhighlight %}

### Object.isExtensible方法

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

###  Object.seal方法

Object.seal方法使得一个对象既无法添加新属性，也无法删除旧属性。

{% highlight javascript %}

var o = { p:"hello" };

Object.seal(o);

delete o.p;
o.p // "hello"

o.x = 'world';
o.x // undefined

{% endhighlight %}

Object.seal还把现有属性的attributes对象的configurable属性设为false，使得attributes对象不再能改变。

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

从上面代码可以看到，使用seal方法之后，attributes对象的configurable就变成了false，然后如果想改变enumerable就会报错。

但是，出于历史原因，这时依然可以将writable从true变成false，即可以对现有属性重新赋值。

{% highlight javascript %}

var o = { p: 'a' };

Object.seal(o);

o.p = 'b';
o.p // 'b'

{% endhighlight %}

### Object.isSealed方法

Object.isSealed方法用于检查一个对象是否使用了Object.seal方法。

{% highlight javascript %}

var o = { p: 'a' };

Object.seal(o);
Object.isSealed(o) // true

{% endhighlight %}

另外，这时isExtensible方法也返回false。

{% highlight javascript %}

var o = { p: 'a' };

Object.seal(o);
Object.isExtensible(o) // false

{% endhighlight %}		

### Object.freeze方法

Object.freeze方法可以使得一个对象无法添加新属性、无法删除旧属性、也无法改变属性的值，使得这个对象实际上变成了常量。

{% highlight javascript %}

var o = {p:"hello"};

Object.freeze(o);

o.p = "world";
o.p // hello

o.t = "hello";
o.t // undefined

{% endhighlight %}

上面代码中，对现有属性重新赋值（o.p = "world"）或者添加一个新属性，并不会报错，只是默默地失败。但是，如果是在严格模式下，就会报错。

{% highlight javascript %}

var o = {p:"hello"};

Object.freeze(o);

// 对现有属性重新赋值
(function () { 'use strict'; o.p = "world";}())
// TypeError: Cannot assign to read only property 'p' of #<Object>

// 添加不存在的属性
(function () { 'use strict'; o.t = 123;}())
// TypeError: Can't add property t, object is not extensible

{% endhighlight %}

### Object.isFrozen方法

Object.isFrozen方法用于检查一个对象是否使用了Object.freeze()方法。

{% highlight javascript %}

var o = {p:"hello"};

Object.freeze(o);
Object.isFrozen(o) // true

{% endhighlight %}

### 局限性

需要注意的是，使用上面这些方法锁定对象的可写性，但是依然可以通过改变该对象的原型对象，来为它增加属性。

{% highlight javascript %}

var o = new Object();

Object.preventExtensions(o);

var proto = Object.getPrototypeOf(o);

proto.t = "hello";

o.t
// hello

{% endhighlight %}

一种解决方案是，把原型也冻结住。

{% highlight javascript %}

var o = Object.seal(
			Object.create(Object.freeze({x:1}),
				{y: {value: 2, writable: true}})
);

Object.getPrototypeOf(o).t = "hello";
o.hello // undefined

{% endhighlight %}

## 参考链接

- Axel Rauschmayer, [Protecting objects in JavaScript](http://www.2ality.com/2013/08/protecting-objects.html)
- kangax, [Understanding delete](http://perfectionkills.com/understanding-delete/)
- Jon Bretman, [Type Checking in JavaScript](http://techblog.badoo.com/blog/2013/11/01/type-checking-in-javascript/)
- Cody Lindley, [Thinking About ECMAScript 5 Parts](http://tech.pro/tutorial/1671/thinking-about-ecmascript-5-parts)

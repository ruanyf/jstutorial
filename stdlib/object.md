---
title: Object对象
layout: page
category: stdlib
date: 2013-04-30
modifiedOn: 2013-12-15
---

## 概述

JavaScript原生提供一个Object对象（注意起首的O是大写），所有其他对象都继承自这个对象。Object本身也是一个构造函数，可以直接通过它来生成新对象。

```javascript
var o = new Object();
```

Object作为构造函数使用时，可以接受一个参数。如果该参数是一个对象，则直接返回这个对象；如果是一个原始类型的值，则返回该值对应的包装对象。

```javascript
var o1 = {a:1};
var o2 = new Object(o1);
o1 === o2 // true

new Object(123) instanceof Number
// true
```

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

### Object()

Object本身当作工具方法使用时，可以将任意值转为对象。其中，原始类型的值转为对应的包装对象（参见《原始类型的包装对象》一节）。

```javascript
Object() // 返回一个空对象
Object(undefined) // 返回一个空对象
Object(null) // 返回一个空对象

Object(1) // 等同于 new Number(1)
Object('foo') // 等同于 new String('foo')
Object(true) // 等同于 new Boolean(true)

Object([]) // 返回原数组
Object({}) // 返回原对象
Object(function(){}) // 返回原函数
```

上面代码表示Object函数将各种值，转为对应的对象。

如果Object函数的参数是一个对象，它总是返回原对象。利用这一点，可以写一个判断变量是否为对象的函数。

{% highlight javascript %}

function isObject(value) {
    return value === Object(value);
}

{% endhighlight %}

### Object.keys()，Object.getOwnPropertyNames()

Object.keys方法和Object.getOwnPropertyNames方法很相似，一般用来遍历对象的属性。它们的参数都是一个对象，都返回一个数组，该数组的成员都是对象自身的（而不是继承的）所有属性名。它们的区别在于，Object.keys方法只返回可枚举的属性（关于可枚举性的详细解释见后文），Object.getOwnPropertyNames方法还返回不可枚举的属性名。

```javascript
var o = {
	p1: 123,
	p2: 456
};

Object.keys(o)
// ["p1", "p2"]

Object.getOwnPropertyNames(o)
// ["p1", "p2"]
```

上面的代码表示，对于一般的对象来说，这两个方法返回的结果是一样的。只有涉及不可枚举属性时，才会有不一样的结果。

```javascript
var a = ["Hello", "World"];

Object.keys(a)
// ["0", "1"]

Object.getOwnPropertyNames(a)
// ["0", "1", "length"]
```

上面代码中，数组的length属性是不可枚举的属性，所以只出现在Object.getOwnPropertyNames方法的返回结果中。

由于JavaScript没有提供计算对象属性个数的方法，所以可以用这两个方法代替。

```javascript
Object.keys(o).length
Object.getOwnPropertyNames(o).length
```

一般情况下，几乎总是使用Object.keys方法，遍历数组的属性。

### Object.observe()

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

- Object.getOwnPropertyDescriptor()：获取某个属性的attributes对象。
- Object.defineProperty()：通过attributes对象，定义某个属性。
- Object.defineProperties()：通过attributes对象，定义多个属性。
- Object.getOwnPropertyNames()：返回直接定义在某个对象上面的全部属性的名称。

**（2）控制对象状态的方法**

- Object.preventExtensions()：防止对象扩展。
- Object.isExtensible()：判断对象是否可扩展。
- Object.seal()：禁止对象配置。
- Object.isSealed()：判断一个对象是否可配置。
- Object.freeze()：冻结一个对象。
- Object.isFrozen()：判断一个对象是否被冻结。

**（3）原型链相关方法**

- Object.create()：生成一个新对象，并该对象的原型。
- Object.getPrototypeOf()：获取对象的Prototype对象。

## Object实例对象的方法

除了Object对象本身的方法，还有不少方法是部署在Object.prototype对象上的，所有Object的实例对象都继承了这些方法。

Object实例对象的方法，主要有以下六个。

- valueOf()：返回当前对象对应的值。
- toString()：返回当前对象对应的字符串形式。
- toLocalString()：返回当前对象对应的本地字符串形式。
- hasOwnProperty()：判断某个属性是否为当前对象自身的属性，还是继承自原型对象的属性。
- isPrototypeOf()：判断当前对象是否为另一个对象的原型。
- propertyIsEnumerable()：判断某个属性是否可枚举。

本节介绍前两个方法，其他方法将在后文相关章节介绍。

### Object.prototype.valueOf()

valueOf方法的作用是返回一个对象的值，默认情况下返回对象本身。

{% highlight javascript %}

var o = new Object();

o.valueOf() === o // true

{% endhighlight %}

上面代码比较o的valueOf方法返回值与o本身，两者是一样的。

valueOf方法的主要用途是，JavaScript自动类型转换时会默认调用这个方法（详见上一章《数据类型转换》一节）。

```javascript
var o = new Object();

1 + o // "1[object Object]"
```

上面代码将对象o与数字1相加，这时JavaScript就会默认调用valueOf()方法。所以，如果自定义valueOf方法，就可以得到想要的结果。

{% highlight javascript %}

var o = new Object();
o.valueOf = function (){return 2;};

1 + o // 3

{% endhighlight %}

上面代码自定义了o对象的valueOf方法，于是1 + o就得到了3。这种方法就相当于用o.valueOf覆盖Object.prototype.valueOf。

### Object.prototype.toString()

toString方法的作用是返回一个对象的字符串形式。

```javascript
var o1 = new Object();
o1.toString() // "[object Object]"

var o2 = {a:1};
o2.toString() // "[object Object]"
```

上面代码表示，对于一个对象调用toString方法，会返回字符串`[object Object]`。

字符串`[object Object]`本身没有太大的用处，但是通过自定义toString方法，可以让对象在自动类型转换时，得到想要的字符串形式。

```javascript
var o = new Object();

o.toString = function (){ return 'hello' };

o + ' ' + 'world' // "hello world"
```

上面代码表示，当对象用于字符串加法时，会自动调用toString方法。由于自定义了toString方法，所以返回字符串hello world。

数组、字符串和函数都分别部署了自己版本的toString方法。

```javascript
[1,2,3].toString() // "1,2,3"

'123'.toString() // "123"

(function (){return 123}).toString() // "function (){return 123}"
```

### toString()的应用：判断数据类型

`toString`方法的主要用途是返回对象的字符串形式，除此之外，还有一个重要的作用，就是判断一个值的类型。

```javascript
var o = {};
o.toString() // "[object Object]"
```

上面代码调用空对象的`toString`方法，结果返回一个字符串`object Object`，其中第二个`Object`表示该值的准确类型。这是一个十分有用的判断数据类型的方法。

实例对象的`toString`方法，实际上是调用`Object.prototype.toString`方法。使用`call`方法，可以在任意值上调用`Object.prototype.toString`方法，从而帮助我们判断这个值的类型。不同数据类型的`toString`方法返回值如下：

- 数值：返回`[object Number]`。
- 字符串：返回`[object String]`。
- 布尔值：返回`[object Boolean]`。
- undefined：返回`[object Undefined]`。
- null：返回`[object Null]`。
- 数组：返回`[object Array]`。
- arguments对象：返回`[object Arguments]`。
- 函数：返回`[object Function]`。
- Error对象：返回`[object Error]`。
- Date对象：返回`[object Date]`。
- RegExp对象：返回`[object RegExp]`。
- 其他对象：返回`[object " + 构造函数的名称 + "]`。

```javascript
Object.prototype.toString.call(2) // "[object Number]"
Object.prototype.toString.call('') // "[object String]"
Object.prototype.toString.call(true) // "[object Boolean]"
Object.prototype.toString.call(undefined) // "[object Undefined]"
Object.prototype.toString.call(null) // "[object Null]"
Object.prototype.toString.call(Math) // "[object Math]"
Object.prototype.toString.call({}) // "[object Object]"
Object.prototype.toString.call([]) // "[object Array]"
```

可以利用这个特性，写出一个比`typeof`运算符更准确的类型判断函数。

```javascript
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
```

在上面这个`type`函数的基础上，还可以加上专门判断某种类型数据的方法。

```javascript
['Null',
 'Undefined',
 'Object',
 'Array',
 'String',
 'Number',
 'Boolean',
 'Function',
 'RegExp',
 'NaN',
 'Infinite'
].forEach(function (t) {
    type['is' + t] = function (o) {
        return type(o) === t.toLowerCase();
    };
});

type.isObject({}) // true
type.isNumber(NaN) // true
type.isRegExp(/abc/) // true
```

## 对象的属性模型

ECMAScript 5对于对象的属性，提出了一个精确的描述模型。

### 属性的attributes对象，Object.getOwnPropertyDescriptor()

在JavaScript内部，每个属性都有一个对应的attributes对象，保存该属性的一些元信息。使用`Object.getOwnPropertyDescriptor`方法，可以读取attributes对象。

```javascript
var o = { p: 'a' };

Object.getOwnPropertyDescriptor(o, 'p')
// Object { value: "a",
//   writable: true,
//   enumerable: true,
//   configurable: true
// }
```

上面代码表示，使用`Object.getOwnPropertyDescriptor`方法，读取`o`对象的`p`属性的attributes对象。

`attributes`对象包含如下元信息。

- `value`：表示该属性的值，默认为`undefined`。
- `writable`：表示该属性的值（value）是否可以改变，默认为`true`。
- `enumerable`： 表示该属性是否可枚举，默认为`true`。如果设为`false`，会使得某些操作（比如`for...in`循环、`Object.keys()`）跳过该属性。
- `configurable`：表示“可配置性”，默认为true。如果设为false，将阻止某些操作改写该属性，比如，无法删除该属性，也不得改变该属性的attributes对象（value属性除外），也就是说，configurable属性控制了attributes对象的可写性。
- `get`：表示该属性的取值函数（getter），默认为`undefined`。
- `set`：表示该属性的存值函数（setter），默认为`undefined`。

### Object.defineProperty()，Object.defineProperties()

`Object.defineProperty`方法允许通过定义`attributes`对象，来定义或修改一个属性，然后返回修改后的对象。它的格式如下：

```javascript
Object.defineProperty(object, propertyName, attributesObject)
```

`Object.defineProperty`方法接受三个参数，第一个是属性所在的对象，第二个是属性名（它应该是一个字符串），第三个是属性的描述对象。比如，新建一个`o`对象，并定义它的`p`属性，写法如下。

```javascript
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
```

需要注意的是，`Object.defineProperty`方法和后面的`Object.defineProperties`方法，都有性能损耗，会拖慢执行速度，不宜大量使用。

如果一次性定义或修改多个属性，可以使用`Object.defineProperties`方法。

```javascript
var o = Object.defineProperties({}, {
  p1: { value: 123, enumerable: true },
  p2: { value: 'abc', enumerable: true },
  p3: { get: function() { return this.p1+this.p2 },
    enumerable:true,
    configurable:true
  }
});

o.p1 // 123
o.p2 // "abc"
o.p3 // "123abc"
```

上面代码中的`p3`属性，定义了取值函数`get`。这时需要注意的是，一旦定义了取值函数`get`（或存值函数`set`），就不能将`writable`设为`true`，或者同时定义`value`属性，否则会报错。

```javascript
var o = {};

Object.defineProperty(o, 'p', {
  value: 123,
    get: function() { return 456; }
});
// TypeError: Invalid property.
// A property cannot both have accessors and be writable or have a value,
```

上面代码同时定义了`get`属性和`value`属性，结果就报错。

Object.defineProperty() 和Object.defineProperties() 的第三个参数，是一个属性对象。它的writable、configurable、enumerable这三个属性的默认值都为false。

writable属性为false，表示对应的属性的值将不得改写。

```javascript

var o = {};

Object.defineProperty(o, "p", {
    value: "bar"
});

o.p // bar

o.p = "foobar";
o.p // bar

Object.defineProperty(o, "p", {
    value: "foobar",
});
// TypeError: Cannot redefine property: p

```

上面代码由于writable属性默认为false，导致无法对p属性重新赋值，但是不会报错（严格模式下会报错）。不过，如果再一次使用Object.defineProperty方法对value属性赋值，就会报错。

configurable属性为false，将无法删除该属性，也无法修改attributes对象（value属性除外）。

```javascript

var o = {};

Object.defineProperty(o, "p", {
    value: "bar",
});

delete o.p
o.p // bar

```

上面代码中，由于configurable属性默认为false，导致无法删除某个属性。

enumerable属性为false，表示对应的属性不会出现在for...in循环和Object.keys方法中。

```javascript
var o = {
    p1: 10,
    p2: 13,
};

Object.defineProperty(o, "p3", {
  value: 3,
});

for (var i in o) {
  console.log(i, o[i]);
}
// p1 10
// p2 13
```

上面代码中，p3属性是用Object.defineProperty方法定义的，由于enumerable属性默认为false，所以不出现在for...in循环中。

### 可枚举性（enumerable）

可枚举性（enumerable）用来控制所描述的属性，是否将被包括在`for...in`循环之中。具体来说，如果一个属性的`enumerable`为`false`，下面三个操作不会取到该属性。

- `for..in`循环
- `Object.keys`方法
- `JSON.stringify`方法

因此，`enumerable`可以用来设置“秘密”属性。

```javascript
var o = {a: 1, b: 2};

o.c = 3;
Object.defineProperty(o, 'd', {
  value: 4,
  enumerable: false
});

o.d
// 4

for( var key in o ) console.log( o[key] );
// 1
// 2
// 3

Object.keys(o)  // ["a", "b", "c"]

JSON.stringify(o // => "{a:1,b:2,c:3}"
```

上面代码中，`d`属性的`enumerable`为`false`，所以一般的遍历操作都无法获取该属性，使得它有点像“秘密”属性，但还是可以直接获取它的值。

至于`for...in`循环和`Object.keys`方法的区别，在于前者包括对象继承自原型对象的属性，而后者只包括对象本身的属性。如果需要获取对象自身的所有属性，不管enumerable的值，可以使用`Object.getOwnPropertyNames`方法，详见下文。

考虑到`JSON.stringify`方法会排除`enumerable`为`false`的值，有时可以利用这一点，为对象添加注释信息。

```javascript
var car = {
  id: 123,
  color: 'red',
  ownerId: 12
};

var owner = {
  id: 12,
  name: 'Jack'
};

Object.defineProperty(car, 'ownerInfo', {value: owner, enumerable: false});
car.ownerInfo // {id: 12, name: "Jack"}

JSON.stringify(car) //  '{id: 123, color: "red", owner: 12}'
```

上面代码中，`owner`对象作为注释，加入`car`对象。由于`ownerInfo`属性的`enumerable`为`false`，所以`JSON.stringify`最后正式输出`car`对象时，会忽略`ownerInfo`属性。

这提示我们，如果你不愿意某些属性出现在JSON输出之中，可以把它的`enumerable`属性设为`false`。

### Object.getOwnPropertyNames()

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

// 比如，数组实例自带length属性是不可枚举的
Object.keys([]) // []
Object.getOwnPropertyNames([]) // [ 'length' ]

// Object.prototype对象的自带属性也都是不可枚举的
Object.keys(Object.prototype) // []
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

### Object.prototype.propertyIsEnumerable()

对象实例的propertyIsEnumerable方法用来判断一个属性是否可枚举。

{% highlight javascript %}

var o = {};
o.p = 123;

o.propertyIsEnumerable("p") // true
o.propertyIsEnumerable("toString") // false

{% endhighlight %}

上面代码中，用户自定义的p属性是可枚举的，而继承自原型对象的toString属性是不可枚举的。

### 可配置性（configurable）

可配置性（configurable）决定了是否可以修改属性的描述对象。也就是说，当configure为false的时候，value、writable、enumerable和configurable都不能被修改了。

```javascript

var o = Object.defineProperty({}, 'p', {
        value: 1,
        writable: false, 
        enumerable: false, 
        configurable: false
});

Object.defineProperty(o,'p', {value: 2})
// TypeError: Cannot redefine property: p

Object.defineProperty(o,'p', {writable: true})
// TypeError: Cannot redefine property: p

Object.defineProperty(o,'p', {enumerable: true})
// TypeError: Cannot redefine property: p

Object.defineProperties(o,'p',{configurable: true})
// TypeError: Cannot redefine property: p

```

上面代码首先生成对象o，并且定义属性p的configurable为false。然后，逐一改动value、writable、enumerable、configurable，结果都报错。

需要注意的是，writable只有在从false改为true会报错，从true改为false则是允许的。

```javascript

var o = Object.defineProperty({}, 'p', {
        writable: true
});

Object.defineProperty(o,'p', {writable: false})
// 修改成功

```

至于value，只要writable和configurable有一个为true，就可以改动。

```javascript

var o1 = Object.defineProperty({}, 'p', {
        value: 1,
        writable: true,
        configurable: false
});

Object.defineProperty(o1,'p', {value: 2})
// 修改成功

var o2 = Object.defineProperty({}, 'p', {
        value: 1,
        writable: false,
        configurable: true
});

Object.defineProperty(o2,'p', {value: 2}) 
// 修改成功

```

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

需要注意的是，当使用var命令声明变量时，变量的configurable为false。

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

// 或者写成

this.a3 = 1;

Object.getOwnPropertyDescriptor(this,'a3')
// Object {
//	value: 1, 
//	writable: true, 
//	enumerable: true, 
//	configurable: true
// }

{% endhighlight %}

上面代码中的`this.a3 = 1`与`a3 = 1`是等价的写法。this指的是当前的作用域，更多关于this的解释，参见《面向对象编程》一章。

这种差异意味着，如果一个变量是使用var命令生成的，就无法用delete命令删除。也就是说，delete只能删除对象的属性。

{% highlight javascript %}

var a1 = 1;
a2 = 1;

delete a1 // false
delete a2 // true

a1 // 1
a2 // ReferenceError: a2 is not defined

{% endhighlight %}

### 可写性（writable）

可写性（writable）决定了属性的值（value）是否可以被改变。

{% highlight javascript %}

var o = {}; 

Object.defineProperty(o, "a", { value : 37, writable : false });

o.a // 37
o.a = 25;
o.a // 37

{% endhighlight %}

上面代码将o对象的a属性可写性设为false，然后改变这个属性的值，就不会有任何效果。

这实际上将某个属性的值变成了常量。在ES6中，constant命令可以起到这个作用，但在ES5中，只有通过writable达到同样目的。

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

### 存取器（accessor）

除了直接定义以外，属性还可以用存取器（accessor）定义。其中，存值函数称为setter，使用set命令；取值函数称为getter，使用get命令。

```javascript
var o = {
  get p() {
    return "getter";
  },
  set p(value) {
    console.log("setter: "+value);
  }
}
```

上面代码中，o对象内部的get和set命令，分别定义了p属性的取值函数和存值函数。定义了这两个函数之后，对p属性取值时，取值函数会自动调用；对p属性赋值时，存值函数会自动调用。

```javascript
o.p // "getter"
o.p = 123 // "setter: 123"
```

存取器往往用于，某个属性的值需要依赖对象内部数据的场合。

```javascript
var o ={
  $n : 5,
  get next(){return this.$n++ },
  set next(n) {
    if (n >= this.$n) this.$n = n;
    else throw "新的值必须大于当前值";
  }
};

o.next // 5

o.next = 10;
o.next // 10
```

上面代码中，next属性的存值函数和取值函数，都依赖于对内部属性$n的操作。

下面是另一个存取器的例子。

```javascript
var d = new Date();

Object.defineProperty(d, 'month', {
  get: function() {
    return d.getMonth();
  },
  set: function(v) {
    d.setMonth(v);
  }
});
```

上面代码为Date的实例对象d，定义了一个可读写的month属性。

存取器也可以使用Object.create方法定义。

```javascript
var o = Object.create(Object.prototype, {
  foo: {
    get: function () {
      return 'getter';
    },
    set: function (value) {
      console.log('setter: '+value);
    }
  }
});
```

如果使用上面这种写法，属性foo必须定义一个属性描述对象。该对象的get和set属性，分别是foo的取值函数和存值函数。

利用存取器，可以实现数据对象与DOM对象的双向绑定。

```javascript
Object.defineProperty(user, 'name', {
  get: function() {
    return document.getElementById("foo").value;
  },
  set: function(newValue) {
    document.getElementById("foo").value = newValue;
  },
  configurable: true
});
```

上面代码使用存取函数，将DOM对象foo与数据对象user的name属性，实现了绑定。两者之中只要有一个对象发生变化，就能在另一个对象上实时反映出来。

### 对象的拷贝

有时，我们需要将一个对象的所有属性，拷贝到另一个对象。ES5没有提供这个方法，必须自己实现。

```javascript
var extend = function (to, from) {
  for (var property in from) {
    to[property] = from[property];
  }

  return to;
}

extend({}, {a: 1})
// {a: 1}
```

上面这个方法的问题在于，如果遇到存取器定义的属性，会只拷贝值。

```javascript
extend({}, { get a(){ return 1 } })
// {a: 1}
```

为了解决这个问题，我们可以通过`Object.defineProperty`方法来拷贝属性。

```javascript
var extend = function (to, from) {
  for (var property in from) {
    Object.defineProperty(to, property, Object.getOwnPropertyDescriptor(from, property));
  }

  return to;
}

extend({}, { get a(){ return 1 } })
// { get a(){ return 1 } })
```

这段代码还是有问题，拷贝某些属性时会失效。

```javascript
extend(document.body.style, {
  backgroundColor: "red"
});
```

上面代码的目的是，设置`document.body.style.backgroundColor`属性为`red`，但是实际上网页的背景色并不会变红。但是，如果用第一种简单拷贝的方法，反而能够达到目的。这提示我们，可以把两种方法结合起来，对于简单属性，就直接拷贝，对于那些通过描述对象设置的属性，则使用`Object.defineProperty`方法拷贝。

```javascript
var extend = function (to, from) {
  var descriptor = Object.getOwnPropertyDescriptor(from, property);

  if (descriptor && ( !descriptor.writable
    || !descriptor.configurable
    || !descriptor.enumerable
    || descriptor.get
    || descriptor.set)) {
    Object.defineProperty(to, property, descriptor);
  } else {
    to[property] = from[property];
  }
}
```

上面的这段代码，可以很好地拷贝任意属性。

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

(function () {
  'use strict';
  o.p = '1'
}());
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

可写性（writable）有点特别。如果writable为false，使用Object.seal方法以后，将无法将其变成true；但是，如果writable为true，依然可以将其变成false。

{% highlight javascript %}

var o1 = Object.defineProperty({}, 'p', {writable: false});
Object.seal(o1);
Object.defineProperty(o1,'p',{writable:true}) 
// Uncaught TypeError: Cannot redefine property: p 

var o2 = Object.defineProperty({}, 'p', {writable: true});
Object.seal(o2);
Object.defineProperty(o2,'p',{writable:false}) 

Object.getOwnPropertyDescriptor(o2, 'p')
/* { value: '',
  writable: false,
  enumerable: true,
  configurable: false } */

{% endhighlight %}

上面代码中，同样是使用了Object.seal方法，如果writable原为false，改变这个设置将报错；如果原为true，则不会有问题。

至于属性对象的value是否可改变，是由writable决定的。

```javascript

var o = { p: 'a' };
Object.seal(o);
o.p = 'b';
o.p // 'b'

```

上面代码中，Object.seal方法对p属性的value无效，是因为此时p属性的writable为true。

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
- Bjorn Tipling, [Advanced objects in JavaScript](http://bjorn.tipling.com/advanced-objects-in-javascript)
- Javier Márquez, [Javascript properties are enumerable, writable and configurable](http://arqex.com/967/javascript-properties-enumerable-writable-configurable)
- Sella Rafaeli, [Native JavaScript Data-Binding](http://www.sellarafaeli.com/blog/native_javascript_data_binding): 使用存取函数实现model与view的双向绑定
- Lea Verou, [Copying object properties, the robust way](http://lea.verou.me/2015/08/copying-properties-the-robust-way/)

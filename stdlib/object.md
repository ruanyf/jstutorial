---
title: Object对象
layout: page
category: stdlib
date: 2013-04-30
modifiedOn: 2013-12-15
---

## 概述

JavaScript原生提供一个`Object`对象（注意起首的`O`是大写），所有其他对象都继承自这个对象。`Object`本身也是一个构造函数，可以直接通过它来生成新对象。

```javascript
var o = new Object();
```

`Object`作为构造函数使用时，可以接受一个参数。如果该参数是一个对象，则直接返回这个对象；如果是一个原始类型的值，则返回该值对应的包装对象。

```javascript
var o1 = {a: 1};
var o2 = new Object(o1);
o1 === o2 // true

new Object(123) instanceof Number
// true
```

> 注意，通过`new Object()`的写法生成新对象，与字面量的写法`o = {}`是等价的。

与其他构造函数一样，如果要在`Object`对象上面部署一个方法，有两种做法。

**（1）部署在`Object`对象本身**

比如，在`Object`对象上面定义一个`print`方法，显示其他对象的内容。

```javascript
Object.print = function(o){ console.log(o) };

var o = new Object();

Object.print(o)
// Object
```

**（2）部署在`Object.prototype`对象**

所有构造函数都有一个prototype属性，指向一个原型对象。凡是定义在Object.prototype对象上面的属性和方法，将被所有实例对象共享。（关于prototype属性的详细解释，参见《面向对象编程》一章。）

```javascript
Object.prototype.print = function(){ console.log(this)};

var o = new Object();

o.print() // Object
```

上面代码在Object.prototype定义了一个print方法，然后生成一个Object的实例o。o直接继承了Object.prototype的属性和方法，可以在自身调用它们，也就是说，o对象的print方法实质上是调用Object.prototype.print方法。。

可以看到，尽管上面两种写法的`print`方法功能相同，但是用法是不一样的，因此必须区分“构造函数的方法”和“实例对象的方法”。

## Object()

`Object`本身当作工具方法使用时，可以将任意值转为对象。这个方法常用于保证某个值一定是对象。

如果参数是原始类型的值，`Object`方法返回对应的包装对象的实例（参见《原始类型的包装对象》一节）。

```javascript
Object() // 返回一个空对象
Object() instanceof Object // true

Object(undefined) // 返回一个空对象
Object(undefined) instanceof Object // true

Object(null) // 返回一个空对象
Object(null) instanceof Object // true

Object(1) // 等同于 new Number(1)
Object(1) instanceof Object // true
Object(1) instanceof Number // true

Object('foo') // 等同于 new String('foo')
Object('foo') instanceof Object // true
Object('foo') instanceof String // true

Object(true) // 等同于 new Boolean(true)
Object(true) instanceof Object // true
Object(true) instanceof Boolean // true
```

上面代码表示`Object`函数可以将各种值转为对应的构造函数生成的对象。

如果`Object`方法的参数是一个对象，它总是返回原对象。

```javascript
var arr = [];
Object(arr) // 返回原数组
Object(arr) === arr // true

var obj = {};
Object(obj) // 返回原对象
Object(obj) === obj // true

var fn = function () {};
Object(fn) // 返回原函数
Object(fn) === fn // true
```

利用这一点，可以写一个判断变量是否为对象的函数。

```javascript
function isObject(value) {
  return value === Object(value);
}

isObject([]) // true
isObject(true) // false
```

## Object 对象的静态方法

所谓“静态方法”，是指部署在`Object`对象自身的方法。

### Object.keys()，Object.getOwnPropertyNames()

`Object.keys`方法和`Object.getOwnPropertyNames`方法很相似，一般用来遍历对象的属性。它们的参数都是一个对象，都返回一个数组，该数组的成员都是对象自身的（而不是继承的）所有属性名。它们的区别在于，`Object.keys`方法只返回可枚举的属性（关于可枚举性的详细解释见后文），`Object.getOwnPropertyNames`方法还返回不可枚举的属性名。

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

## Object对象的实例方法

除了`Object`对象本身的方法，还有不少方法是部署在`Object.prototype`对象上的，所有`Object`的实例对象都继承了这些方法。

`Object`实例对象的方法，主要有以下六个。

- `valueOf()`：返回当前对象对应的值。
- `toString()`：返回当前对象对应的字符串形式。
- `toLocaleString()`：返回当前对象对应的本地字符串形式。
- `hasOwnProperty()`：判断某个属性是否为当前对象自身的属性，还是继承自原型对象的属性。
- `isPrototypeOf()`：判断当前对象是否为另一个对象的原型。
- `propertyIsEnumerable()`：判断某个属性是否可枚举。

本节介绍前两个方法，其他方法将在后文相关章节介绍。

### Object.prototype.valueOf()

`valueOf`方法的作用是返回一个对象的“值”，默认情况下返回对象本身。

```javascript
var o = new Object();
o.valueOf() === o // true
```

上面代码比较`o.valueOf()`与`o`本身，两者是一样的。

`valueOf`方法的主要用途是，JavaScript自动类型转换时会默认调用这个方法（详见《数据类型转换》一节）。

```javascript
var o = new Object();
1 + o // "1[object Object]"
```

上面代码将对象`o`与数字`1`相加，这时JavaScript就会默认调用`valueOf()`方法。所以，如果自定义`valueOf`方法，就可以得到想要的结果。

```javascript
var o = new Object();
o.valueOf = function (){
  return 2;
};

1 + o // 3
```

上面代码自定义了`o`对象的`valueOf`方法，于是`1 + o`就得到了`3`。这种方法就相当于用`o.valueOf`覆盖`Object.prototype.valueOf`。

### Object.prototype.toString()

`toString`方法的作用是返回一个对象的字符串形式，默认情况下返回类型字符串。

```javascript
var o1 = new Object();
o1.toString() // "[object Object]"

var o2 = {a:1};
o2.toString() // "[object Object]"
```

上面代码表示，对于一个对象调用`toString`方法，会返回字符串`[object Object]`，该字符串说明对象的类型。

字符串`[object Object]`本身没有太大的用处，但是通过自定义`toString`方法，可以让对象在自动类型转换时，得到想要的字符串形式。

```javascript
var o = new Object();

o.toString = function () {
  return 'hello';
};

o + ' ' + 'world' // "hello world"
```

上面代码表示，当对象用于字符串加法时，会自动调用`toString`方法。由于自定义了`toString`方法，所以返回字符串`hello world`。

数组、字符串、函数、Date对象都分别部署了自己版本的`toString`方法，覆盖了`Object.prototype.toString`方法。

```javascript
[1, 2, 3].toString() // "1,2,3"

'123'.toString() // "123"

(function () {
  return 123;
}).toString()
// "function () {
//   return 123;
// }"

(new Date()).toString()
// "Tue May 10 2016 09:11:31 GMT+0800 (CST)"
```

### toString()的应用：判断数据类型

`Object.prototype.toString`方法返回对象的类型字符串，因此可以用来判断一个值的类型。

```javascript
var o = {};
o.toString() // "[object Object]"
```

上面代码调用空对象的`toString`方法，结果返回一个字符串`object Object`，其中第二个`Object`表示该值的构造函数。这是一个十分有用的判断数据类型的方法。

实例对象可能会自定义`toString`方法，覆盖掉`Object.prototype.toString`方法。通过函数的`call`方法，可以在任意值上调用`Object.prototype.toString`方法，帮助我们判断这个值的类型。

```javascript
Object.prototype.toString.call(value)
```

不同数据类型的`Object.prototype.toString`方法返回值如下。

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
- 其他对象：返回`[object Object]`。

也就是说，`Object.prototype.toString`可以得到一个实例对象的构造函数。

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

利用这个特性，可以写出一个比`typeof`运算符更准确的类型判断函数。

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

## 参考链接

- Axel Rauschmayer, [Protecting objects in JavaScript](http://www.2ality.com/2013/08/protecting-objects.html)
- kangax, [Understanding delete](http://perfectionkills.com/understanding-delete/)
- Jon Bretman, [Type Checking in JavaScript](http://techblog.badoo.com/blog/2013/11/01/type-checking-in-javascript/)
- Cody Lindley, [Thinking About ECMAScript 5 Parts](http://tech.pro/tutorial/1671/thinking-about-ecmascript-5-parts)
- Bjorn Tipling, [Advanced objects in JavaScript](http://bjorn.tipling.com/advanced-objects-in-javascript)
- Javier Márquez, [Javascript properties are enumerable, writable and configurable](http://arqex.com/967/javascript-properties-enumerable-writable-configurable)
- Sella Rafaeli, [Native JavaScript Data-Binding](http://www.sellarafaeli.com/blog/native_javascript_data_binding): 使用存取函数实现model与view的双向绑定
- Lea Verou, [Copying object properties, the robust way](http://lea.verou.me/2015/08/copying-properties-the-robust-way/)

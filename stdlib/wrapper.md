---
title: 包装对象和Boolean对象
layout: page
category: stdlib
date: 2013-04-30
modifiedOn: 2014-01-01
---

## 包装对象的定义

有人说，JavaScript语言“一切皆对象”，数组和函数本质上都是对象，就连三种原始类型的值——数值、字符串、布尔值——在一定条件下，也会自动转为对象，也就是原始类型的“包装对象”。

所谓“包装对象”，就是分别与数值、字符串、布尔值相对应的`Number`、`String`、`Boolean`三个原生对象。这三个原生对象可以把原始类型的值变成（包装成）对象。

```javascript
var v1 = new Number(123);
var v2 = new String('abc');
var v3 = new Boolean(true);
```

上面代码根据原始类型的值，生成了三个对象，与原始值的类型不同。这用`typeof`运算符就可以看出来。

```javascript
typeof v1 // "object"
typeof v2 // "object"
typeof v3 // "object"

v1 === 123 // false
v2 === 'abc' // false
v3 === true // false
```

JavaScript设计包装对象的最大目的，首先是使得JavaScript的“对象”涵盖所有的值。其次，使得原始类型的值可以方便地调用特定方法。

`Number`、`String`和`Boolean`如果不作为构造函数调用（即调用时不加`new`），常常用于将任意类型的值转为数值、字符串和布尔值。

```javascript
Number(123) // 123
String('abc') // "abc"
Boolean(true) // true
```

上面这种数据类型的转换，详见《数据类型转换》一节。

总之，这三个对象作为构造函数使用（带有`new`）时，可以将原始类型的值转为对象；作为普通函数使用时（不带有`new`），可以将任意类型的值，转为原始类型的值。

## 包装对象实例的方法

包装对象实例可以使用Object对象提供的原生方法，主要是`valueOf`方法和`toString`方法。

### valueOf()

`valueOf`方法返回包装对象实例对应的原始类型的值。

```javascript
new Number(123).valueOf()  // 123
new String("abc").valueOf() // "abc"
new Boolean("true").valueOf() // true
```

### toString()

`toString`方法返回实例对应的字符串形式。

```javascript
new Number(123).toString() // "123"
new String("abc").toString() // "abc"
new Boolean("true").toString() // "true"
```

## 原始类型的自动转换

原始类型的值，可以自动当作对象调用，即调用各种对象的方法和参数。这时，JavaScript引擎会自动将原始类型的值转为包装对象，在使用后立刻销毁。

比如，字符串可以调用`length`属性，返回字符串的长度。

```javascript
'abc'.length // 3
```

上面代码中，`abc`是一个字符串，本身不是对象，不能调用`length`属性。JavaScript引擎自动将其转为包装对象，在这个对象上调用`length`属性。调用结束后，这个临时对象就会被销毁。这就叫原始类型的自动转换。

```javascript
var str = 'abc';
str.length // 3

// 等同于
var strObj = new String(str)
// String {
//   0: "a", 1: "b", 2: "c", length: 3, [[PrimitiveValue]]: "abc"
// }
strObj.length // 3
```

上面代码中，字符串`abc`的包装对象有每个位置的值、有`length`属性、还有一个内部属性`[[PrimitiveValue]]`保存字符串的原始值。这个`[[PrimitiveValue]]`内部属性，外部是无法调用，仅供`ValueOf`或`toString`这样的方法内部调用。

这个临时对象是只读的，无法修改。所以，字符串无法添加新属性。

```javascript
var s = 'Hello World';
s.x = 123;
s.x // undefined
```

上面代码为字符串`s`添加了一个`x`属性，结果无效，总是返回`undefined`。

另一方面，调用结束后，临时对象会自动销毁。这意味着，下一次调用字符串的属性时，实际是调用一个新生成的对象，而不是上一次调用时生成的那个对象，所以取不到赋值在上一个对象的属性。如果想要为字符串添加属性，只有在它的原型对象`String.prototype`上定义（参见《面向对象编程》一章）。

这种原始类型值可以直接调用的方法还有很多（详见后文对各包装对象的介绍），除了前面介绍过的`valueOf`和`toString`方法，还包括三个包装对象各自定义在实例上的方法。。

```javascript
'abc'.charAt === String.prototype.charAt
// true
```

上面代码表示，字符串`abc`的`charAt`方法，实际上就是定义在`String`对象实例上的方法（关于`prototype`对象的介绍参见《面向对象编程》一章）。

如果包装对象与原始类型值进行混合运算，包装对象会转化为原始类型（实际是调用自身的`valueOf`方法）。

```javascript
new Number(123) + 123 // 246
new String('abc') + 'abc' // "abcabc"
```

## 自定义方法

三种包装对象还可以在原型上添加自定义方法和属性，供原始类型的值直接调用。

比如，我们可以新增一个`double`方法，使得字符串和数字翻倍。

```javascript
String.prototype.double = function () {
  return this.valueOf() + this.valueOf();
};

'abc'.double()
// abcabc

Number.prototype.double = function () {
  return this.valueOf() + this.valueOf();
};

(123).double()
// 246
```

上面代码在`123`外面必须要加上圆括号，否则后面的点运算符（`.`）会被解释成小数点。

但是，这种自定义方法和属性的机制，只能定义在包装对象的原型上，如果直接对原始类型的变量添加属性，则无效。

```javascript
var s = 'abc';

s.p = 123;
s.p // undefined
```

上面代码直接对字符串`abc`添加属性，结果无效。主要原因是上面说的，这里的包装对象是自动生成的，赋值后自动销毁，所以最后一行实际上调用的是一个新的包装对象。

## Boolean对象

### 概述

`Boolean`对象是JavaScript的三个包装对象之一。作为构造函数，它主要用于生成布尔值的包装对象的实例。

```javascript
var b = new Boolean(true);

typeof b // "object"
b.valueOf() // true
```

上面代码的变量`b`是一个`Boolean`对象的实例，它的类型是对象，值为布尔值`true`。这种写法太繁琐，几乎无人使用，直接对变量赋值更简单清晰。

```javascript
var b = true;
```

注意，`false`对应的包装对象实例，布尔运算结果也是`true`。

```javascript
if (new Boolean(false)) {
  console.log('true');
} // true

if (new Boolean(false).valueOf()) {
  console.log('true');
} // 无输出
```

上面代码的第一个例子之所以得到`true`，是因为`false`对应的包装对象实例是一个对象，进行逻辑运算时，被自动转化成布尔值`true`（因为所有对象对应的布尔值都是`true`）。而实例的`valueOf`方法，则返回实例对应的原始值，本例为`false`。

### Boolean函数的类型转换作用

`Boolean`对象除了可以作为构造函数，还可以单独使用，将任意值转为布尔值。这时`Boolean`就是一个单纯的工具方法。

```javascript
Boolean(undefined) // false
Boolean(null) // false
Boolean(0) // false
Boolean('') // false
Boolean(NaN) // false

Boolean(1) // true
Boolean('false') // true
Boolean([]) // true
Boolean({}) // true
Boolean(function () {}) // true
Boolean(/foo/) // true
```

上面代码中几种得到`true`的情况，都值得认真记住。

使用双重的否运算符（`!`）也可以将任意值转为对应的布尔值。

```javascript
!!undefined // false
!!null // false
!!0 // false
!!'' // false
!!NaN // false
!!1 // true
!!'false' // true
!![] // true
!!{} // true
!!function(){} // true
!!/foo/ // true
```

最后，对于一些特殊值，`Boolean`对象前面加不加`new`，会得到完全相反的结果，必须小心。

```javascript
if (Boolean(false)) {
  console.log('true');
} // 无输出

if (new Boolean(false)) {
  console.log('true');
} // true

if (Boolean(null)) {
  console.log('true');
} // 无输出

if (new Boolean(null)) {
  console.log('true');
} // true
```

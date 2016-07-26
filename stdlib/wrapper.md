---
title: 包装对象和Boolean对象
layout: page
category: stdlib
date: 2013-04-30
modifiedOn: 2014-01-01
---

## 包装对象

### 定义

在JavaScript中，“一切皆对象”，数组和函数本质上都是对象，就连三种原始类型的值——数值、字符串、布尔值——在一定条件下，也会自动转为对象，也就是原始类型的“包装对象”。

所谓“包装对象”，就是分别与数值、字符串、布尔值相对应的Number、String、Boolean三个原生对象。这三个原生对象可以把原始类型的值变成（包装成）对象。

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

### 包装对象的构造函数

Number、String和Boolean这三个原生对象，既可以当作构造函数使用（即加上new关键字，生成包装对象实例），也可以当作工具方法使用（即不加new关键字，直接调用）。后者相当于生成实例后再调用valueOf方法，常常用于将任意类型的值转为某种原始类型的值。

{% highlight javascript %}

Number(123) // 123

String("abc") // "abc"

Boolean(true) // true

{% endhighlight %}

工具方法的详细介绍参见第二章的《数据类型转换》一节。

### 包装对象实例的方法

包装对象实例可以使用Object对象提供的原生方法，主要是 valueOf 方法和 toString 方法。

**（1）valueOf方法**

valueOf方法返回包装对象实例对应的原始类型的值。

{% highlight javascript %}

new Number(123).valueOf()
// 123

new String("abc").valueOf()
// "abc"

new Boolean("true").valueOf()
// true

{% endhighlight %}

**（2）toString方法**

toString方法返回该实例对应的原始类型值的字符串形式。

{% highlight javascript %}

new Number(123).toString()
// "123"

new String("abc").toString()
// "abc"

new Boolean("true").toString()
// "true"

{% endhighlight %}

### 原始类型的自动转换

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

这种原始类型值可以直接调用的方法还有很多（详见后文对各包装对象的介绍），除了前面介绍过的valueOf和toString方法，还包括三个包装对象各自定义在实例上的方法。

{% highlight javascript %}

'abc'.charAt === String.prototype.charAt
// true

{% endhighlight %}

上面代码表示，字符串abc的charAt方法，实际上就是定义在String对象实例上的方法（关于prototype对象的介绍参见《面向对象编程》一章）。

如果包装对象与原始类型值进行混合运算，包装对象会转化为原始类型（实际是调用自身的valueOf方法）。

{% highlight javascript %}

new Number(123) + 123
// 246

new String("abc") + "abc"
// "abcabc"

{% endhighlight %}

### 自定义方法

三种包装对象还可以在原型上添加自定义方法和属性，供原始类型的值直接调用。

比如，我们可以新增一个double方法，使得字符串和数字翻倍。

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

上面代码在123外面必须要加上圆括号，否则后面的点运算符（.）会被解释成小数点。

但是，这种自定义方法和属性的机制，只能定义在包装对象的原型上，如果直接对原始类型的变量添加属性，则无效。

{% highlight javascript %}

var s = "abc";

s.p = 123;
s.p // undefined

{% endhighlight %}

上面代码直接对字符串abc添加属性，结果无效。

## Boolean对象

### 概述

Boolean对象是JavaScript的三个包装对象之一。作为构造函数，它主要用于生成布尔值的包装对象的实例。

{% highlight javascript %}

var b = new Boolean(true);

typeof b // "object"
b.valueOf() // true

{% endhighlight %}

上面代码的变量b是一个Boolean对象的实例，它的类型是对象，值为布尔值true。这种写法太繁琐，几乎无人使用，直接对变量赋值更简单清晰。

{% highlight javascript %}

var b = true;

{% endhighlight %}

### Boolean实例对象的布尔值

特别要注意的是，所有对象的布尔运算结果都是true。因此，false对应的包装对象实例，布尔运算结果也是true。

{% highlight javascript %}

if (new Boolean(false)) {
    console.log("true"); 
} // true

if (new Boolean(false).valueOf()) {
    console.log("true"); 
} // 无输出

{% endhighlight %}

上面代码的第一个例子之所以得到true，是因为false对应的包装对象实例是一个对象，进行逻辑运算时，被自动转化成布尔值true（所有对象对应的布尔值都是true）。而实例的valueOf方法，则返回实例对应的原始类型值，本例为false。

### Boolean函数的类型转换作用

Boolean对象除了可以作为构造函数，还可以单独使用，将任意值转为布尔值。这时Boolean就是一个单纯的工具方法。

{% highlight javascript %}

Boolean(undefined) // false
Boolean(null) // false
Boolean(0) // false
Boolean('') // false
Boolean(NaN) // false
Boolean(1) // true
Boolean('false') // true
Boolean([]) // true
Boolean({}) // true
Boolean(function(){}) // true
Boolean(/foo/) // true

{% endhighlight %}

上面代码中几种得到true的情况，都值得认真记住。

使用not运算符（!）也可以达到同样效果。

{% highlight javascript %}

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

{% endhighlight %}

综上所述，如果要获得一个变量对应的布尔值，有多种写法。

{% highlight javascript %}

var a = "hello world";

new Boolean(a).valueOf() // true
Boolean(a) // true
!!a // true

{% endhighlight %}

最后，对于一些特殊值，Boolean对象前面加不加new，会得到完全相反的结果，必须小心。

{% highlight javascript %}

if (Boolean(false)) 
  console.log('true'); // 无输出

if (new Boolean(false))
	console.log('true'); // true

if (Boolean(null)) 
	console.log('true'); // 无输出

if (new Boolean(null))
	console.log('true'); // true

{% endhighlight %}

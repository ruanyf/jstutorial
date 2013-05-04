---
title: Object对象
layout: page
category: stdlib
date: 2013-04-30
modifiedOn: 2013-05-04
---

## 概述

JavaScript原生提供一个Object对象（注意起首的O是大写），它本身是一个构造函数，可以直接通过它来生成新对象。

{% highlight javascript %}

var o = new Object();

// or

var o = {};

typeof o
// "object"

{% endhighlight %}

通过 var o = new Object() 的写法来生成新对象，与字面量的写法 var o = {} 是等价的。建议采用前者，因为这能更清楚地显示一行语句的目的。

与Object对象相关的方法，分成两种。一种是Object对象本身的方法，比如我在Object对象上面定义一个print方法，显示其他对象的内容。

{% highlight javascript %}

Object.print = function(o){ console.log(o)};

var o = {p:"abc"};

Object.print(o)
// Object {p: "abc"}

{% endhighlight %}

还有一种是Object实例的方法。因为Object也是一个构造函数，有些方法是定义在构造函数里面的，或者定义在Object的原型上面（详细解释参见后面的《面向对象编程》一章）。这时，Object本身不能使用这些方法，但是它的实例可以使用。

{% highlight javascript %}

Object.prototype.print = function(){ console.log(this)};

var o = {p:"abc"};

o.print()
// Object {p: "abc", print: function}

{% endhighlight %}

JavaScript的所有其他对象，都是继承自Object对象。也就是说，所有其他对象都是从Object衍生出来的（详细介绍见《面向对象编程》一章）。因此，Object对象有一些自带的方法，可以传递到衍生对象上面，即所有其他对象都可以直接调用某些Object对象提供的方法。

## Object 对象实例的方法

### valueOf方法 和 toString方法

Object对象提供的两种最主要的方法是valueOf()和toString()。前者将一个对象转化为原始类型的值，后者将一个对象转化为字符串。

除非自定义这两种方法，否则，调用valueOf方法，返回Object对象本身；调用toString方法，返回“[object Object]”字符串。

{% highlight javascript %}

var o = {};

o.valueOf()
// Object

o.toString()
// "[object Object]"

{% endhighlight %}

这两种方法的意义在于，某些场合JavaScript需要自动将对象转化为原始类型，转化的结果就取决于这两个方法。

Object对象的原型的toString方法，会返回对象的详细类型，比typeof运算符更详细。

{% highlight javascript %}

Object.prototype.toString.call([1,2,3])
// '[object Array]'

Object.prototype.toString.call(/xyz/)
// '[object RegExp]'

{% endhighlight %}

利用这一点，我们可以写一个更准确的toType函数。

{% highlight javascript %}

 var toType = function(obj) {
      return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
    }

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

不过，对于原始类型的变量，这个方法不能识别。

{% highlight javascript %}

Object.prototype.toString.call(123)
// '[object Number]'

{% endhighlight %}


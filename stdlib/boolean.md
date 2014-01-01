---
title: Boolean 对象
layout: page
category: stdlib
date: 2013-04-30
modifiedOn: 2014-01-01
---

## 概述

Boolean对象是一个构造函数，主要用于生成布尔值的包装对象的实例。

{% highlight javascript %}

var b = new Boolean(true);

typeof b // "object"
b.valueOf() // true

{% endhighlight %}

上面代码的变量b是一个Boolean对象的实例，属性为对象，值为布尔值true。

不建议使用这种写法，一个原因是直接对变量赋值更简单清晰。

{% highlight javascript %}

var b = true;

{% endhighlight %}

另一个原因是Boolean对象实例，运算时极易产生混淆。

{% highlight javascript %}

var b1 = new Boolean(false);

var b2 = true;

b1 && b2
//true

{% endhighlight %}

上面代码之所以得到true，是因为虽然b1表示false，但它是一个对象，进行逻辑运算时，被自动转化成布尔值true（所有对象对应的布尔值都是true）。

## 原始类型布尔值的自动转化

如果对原始类型的布尔值调用valueOf方法和toString方法，它会自动转为布尔值对象。

{% highlight javascript %}

true.valueOf() // true
true.toString() // true

{% endhighlight %}

上面代码所调用的两个方法，实际上来自Boolean.prototype对象。

{% highlight javascript %}

true.toString === Boolean.prototype.toString // true

{% endhighlight %}

## Boolean函数的类型转换作用

Boolean构造函数除了生成对象实例以外，还可以将任何值转为布尔值。这时Boolean就是一个单纯的工具方法，前面不能使用new关键字。

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

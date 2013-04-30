---
title: Object对象
layout: page
category: stdlib
date: 2013-04-30
modifiedOn: 2013-04-30
---

JavaScript原生提供一个Object对象（注意起首的O是大写），所有其他对象都以这个对象为原型（详细介绍见《面向对象编程》一章）。所谓“原型”，也就是说，定义在Object对象上面的一些方法，所有其他对象都具有，可以直接调用。

其中，最主要的两种方法是valueOf()和toString()。前者将一个对象转化为原始类型的值，后者将一个对象转化为字符串。在没有规定这两种方法传回的值之前，调用valueOf方法，返回Object对象本身；调用toString方法，返回“[object Object]”字符串。

{% highlight javascript %}

var o = {};

o.valueOf()
// Object

o.toString()
// "[object Object]"

{% endhighlight %}

这两种方法的意义在于，某些场合JavaScript会自动将对象转化为原始类型，转化的结果就取决于这两个方法。


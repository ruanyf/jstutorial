---
title: Object对象
layout: page
category: stdlib
date: 2013-04-30
modifiedOn: 2013-04-30
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

JavaScript的所有其他对象，都是继承自Object对象。也就是说，所有其他对象都是从Object衍生出来的（详细介绍见《面向对象编程》一章）。因此，Object对象有一些自带的方法，可以传递到衍生对象上面，即所有其他对象都可以直接调用某些Object对象提供的方法。

## valueOf 和 toString

Object对象提供的两种最主要的方法是valueOf()和toString()。前者将一个对象转化为原始类型的值，后者将一个对象转化为字符串。在没有规定这两种方法传回的值之前，调用valueOf方法，返回Object对象本身；调用toString方法，返回“[object Object]”字符串。

{% highlight javascript %}

var o = {};

o.valueOf()
// Object

o.toString()
// "[object Object]"

{% endhighlight %}

这两种方法的意义在于，某些场合JavaScript会自动将对象转化为原始类型，转化的结果就取决于这两个方法。

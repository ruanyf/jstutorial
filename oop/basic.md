---
title: 面向对象编程概述
layout: page
category: oop
date: 2012-12-28
modifiedOn: 2013-03-02
---

## 构造函数

在C++和Java等面向对象编程的语言中，存在“类”（class）这样一个概念。所谓“类”就是对象的模板，对象就是“类”的实例。JavaScript语言中没有“类”，以构造函数（constructor）作为对象的模板。也就是说，可以用构造函数生成多个相同结构的对象。

所以，什么叫“构造函数”，就是可以作为对象的模板的函数。

它的最大特点就是，函数体内部使用了this关键字。

{% highlight javascript %}

var Vehicle = function() {
	this.price = 1000;
}

{% endhighlight %}

上面代码中的Vehicle就是一个构造函数，代表“车辆”对象的模板。函数体内部的this关键字，代表实例对象。this.price表示实例对象有一个price属性，它的值是1000。

## new命令

根据构造函数生成实例对象，需要使用new命令。

{% highlight javascript %}

var v = new Vehicle();

console.info(v.price);
// 1000

{% endhighlight %}

上面代码的变量v，就是新生成的实例对象。它从构造函数Vehicle继承了price属性。

new命令后面的构造函数可以带括号，也可以不带括号。下面两行代码是等价的。

{% highlight javascript %}

var v = new Vehicle();

var v = new Vehicle;

{% endhighlight %}

但是，如果要向构造函数传入参数，就只有使用第一种表示法了。

{% highlight javascript %}

var v = new Vehicle(1000);

{% endhighlight %}

## instanceof运算符

该运算符用来确定一个对象是否是另一个对象的实例。

{% highlight javascript %}

123 instanceof Object 
// false

[1, 2, 3] instanceof Array
// true

{} instanceof Object
// true

var f = function (){};
var o = new f();

o instanceof f
// true

{% endhighlight %}

## this关键字

上面说到，this关键字在构造函数中指的是实例对象。但是，this关键字有多种含义，实例对象只是其中一种。严格地说，this关键字指的是变量所处的上下文环境（context）。我们分成几种情况来讨论。

（1）在全局环境使用this，它指的就是顶层对象（浏览器环境中就是window）。

因此，下面三行命令是等价的。

{% highlight javascript %}

var a = 1;

window.a = 1;

this.a = 1;

{% endhighlight %}

在浏览器全局环境中，变量的顶层对象默认是window，这时this就表示window。

（2）在构造函数中使用this，它指的就是实例对象。

## call方法和apply方法

这两个方法的作用是指定函数运行的上下文对象。

如果指定的对象是null或undefined，则等同于指定全局对象。

{% highlight javascript %}

function a() {
    alert(this);
}
a.call(null);

{% endhighlight %}

在浏览器环境中，全局对象就是window，因此上面的代码等同于下面的形式，运行结果就是window。

{% highlight javascript %}

function a() {
    alert(this);
}
a.call(window);

{% endhighlight %}


---
title: 面向对象编程概述
layout: page
category: oop
date: 2012-12-28
modifiedOn: 2013-01-10
---

## 构造函数

在C++和Java等面向对象编程的语言中，存在“类”（class）这样一个概念。所谓“类”就是对象的模板，对象就是“类”的实例。Javascript语言中没有“类”，以构造函数（constructor）作为对象的模板。

因此，只要一个函数的作用是作为对象的模板，我们就可以把它视为构造函数。它的最大特点就是，函数体内部使用了this关键字。

{% highlight javascript %}

var Vehicle = function() {
  this.price = 1000;
}

{% endhighlight %}

上面代码中的Vehicle就是一个构造函数，代表车辆对象的模板。函数体内部的this关键字，代表实例对象，this.price表示实例对象有一个price属性，它的值是1000。

## new命令

根据构造函数生成实例对象，需要使用new命令。

{% highlight javascript %}

var v = new Vehicle();

console.info(v.price);
// 1000

{% endhighlight %}

上面代码的v变量，就是新生成的实例对象。它从构造函数Vehicle继承了price属性。

## this关键字

this关键字指的是变量所处的上下文环境（context）。举例来说，如果变量处于全局环境，this指的就是顶层对象。

{% highlight javascript %}

var a = 1;

window.a = 1;

this.a = 1;

{% endhighlight %}

上面三行代码是等同的，因为在浏览器全局环境中，变量的顶层对象默认是window，这时this就表示window。

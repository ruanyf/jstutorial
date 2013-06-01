---
title: 面向对象编程概述
layout: page
category: oop
date: 2012-12-28
modifiedOn: 2013-06-01
---

## 简介

### 对象和面向对象编程

“面向对象编程”（Object Oriented Programming，缩写为OOP）是目前主流的编程方法。它的核心思想是将复杂的编程关系，抽象为一个个对象。

所谓“对象”（object），有两种理解方法。

（1）简单的理解：“对象”是单个实物的抽象。

一本书、一辆汽车、一个人都可以是“对象”，一个数据库、一张网页、一个与远程服务器的连接也可以是“对象”。当实物被抽象成“对象”，实物之间的关系就变成了“对象”之间的关系，从而就可以模拟现实情况，针对“对象”进行编程。

（2）复杂的理解：“对象”是一个容器，封装了相关的“属性”（property）和“方法”（method）。

所谓“属性”，就是对象的状态；所谓“方法”，就是对象的行为（完成某种任务）。比如，我们可以把动物抽象为animal对象，“属性”记录具体是那一种动物，“方法”表示动物的某种行为（奔跑、捕猎、休息等等）。

“面向对象编程”就是将“对象”作为程序的核心，所有的操作都是针对“对象”的。这种编程方法的最大优点，就是使得程序模块化，容易维护和开发。

本章介绍JavaScript如何进行“面向对象编程”。

### 类和构造函数

“面向对象编程”的第一步，就是要生成对象。

前面说过，“对象”是单个实物的抽象。所以，通常需要一个模板，表示某一类实物的共同特征，然后“对象”根据这个模板生成。

典型的面向对象编程语言（比如C++和Java），存在“类”（class）这样一个概念。所谓“类”就是对象的模板，对象就是“类”的实例。

JavaScript语言没有“类”，而改用构造函数（constructor）作为对象的模板。

所谓“构造函数”，就是专门用来生成“对象”的函数。它提供模板，作为对象的基本结构。一个构造函数，可以生成多个对象，这些对象都有相同的结构。

下面就是一个构造函数：

{% highlight javascript %}

var Vehicle = function() {
	this.price = 1000;
};

{% endhighlight %}

Vehicle就是构造函数，它提供模板，用来生成车辆对象。

构造函数的最大特点就是，函数体内部使用了this关键字，代表了所要生成的对象实例。

生成对象的时候，必需用new命令，调用Vehicle函数。

{% highlight javascript %}

var v = new Vehicle();

{% endhighlight %}

new命令的作用，就是让构造函数生成一个对象的实例。此时，构造函数内部的this代表被生成的实例对象，this.price表示实例对象有一个price属性，它的值是1000。

以上就是使用构造函数生成对象的最简单步骤。下面是详细的讲解。

## 基本用法

### new命令

new命令的作用，是让构造函数返回一个实例对象。我们可以把返回的实例对象其保存在一个变量中。

{% highlight javascript %}

var Vehicle = function() {
	this.price = 1000;
};

var v = new Vehicle();

v.price
// 1000

{% endhighlight %}

变量v就是新生成的实例对象，它从构造函数Vehicle继承了price属性。

new命令后面的构造函数可以带括号，也可以不带括号。下面两行代码是等价的。

{% highlight javascript %}

var v = new Vehicle();

var v = new Vehicle;

{% endhighlight %}

我们修改构造函数，使其可以带一个参数。

{% highlight javascript %}

var Vehicle = function(p) {
	this.price = p;
};

{% endhighlight %}

这时使用new命令，就需要同时提供参数值。

{% highlight javascript %}

var v = new Vehicle(500);

{% endhighlight %}

一个很自然的问题是，如果忘了使用new命令，直接调用构造函数会发生什么事？

这种情况下，构造函数就变成了普通函数，并不会生成实例对象。而且由于下面会说到的原因，this这时代表全局对象，将造成一些意想不到的结果。因此，应该避免出现不使用new命令、直接调用构造函数的情况。

### instanceof运算符

instanceof运算符用来确定一个对象是否为某个构造函数的实例。

{% highlight javascript %}

var v = new Vehicle();

v instanceof Vehicle
// true

{% endhighlight %}

前面章节说过，JavaScript的所有值，都是某种对象。只要是对象，就有对应的构造函数。因此，instanceof运算符可以用来判断值的类型。

{% highlight javascript %}

[1, 2, 3] instanceof Array
// true

{} instanceof Object
// true

{% endhighlight %}

上面的Array和Object，就是JavaScript原生提供的构造函数。

## this关键字

### 涵义

上面说到，this关键字在构造函数中指的是实例对象。但是，this关键字有多种含义，实例对象只是其中一种。严格地说，this关键字指的是变量所处的上下文环境（context）。我们分成几种情况来讨论。

（1）在全局环境使用this，它指的就是顶层对象（浏览器环境中就是window）。

因此，下面三行命令是等价的。

{% highlight javascript %}

var a = 1;

window.a = 1;

this.a = 1;

{% endhighlight %}

在浏览器全局环境中，变量的顶层对象默认是window，这时this就表示window。

（2）从构造函数生成实例对象时，this代表实例对象。

{% highlight javascript %}

var O = function( p ) {
    this.p = p ;
};

O.prototype.m = function() {
    return this.p;
};

{% endhighlight %}

当使用new命令，生成一个O的实例时，this就代表这个实例。

{% highlight javascript %}

var o = new O("Hello World!");

o.m()
// "Hello World!"

{% endhighlight %}

（3）当函数被赋值给一个对象的属性，this就代表这个对象。

{% highlight javascript %}

var o1 = { m : 1 };

var o2 = { m : 2 };

o1.f = function(){ console.log(this.m);};
o1.f()
// 1

o2.f = o1.f;
o2.f()
// 2

{% endhighlight %}

可以看到，当f成为o1对象的方法时，this代表o1；当f成为o2对象的方法时，this代表o2。f所在的上下文环境，决定了this的指向。

综合上面三种情况，可以看到this就是运行时的上下文环境。如果在全局环境下运行，就代表全局对象；如果在某个对象中运行，就代表该对象。

这种不确定的this指向，会给编程带来一些麻烦。比如，对某个按钮指定click事件的回调函数，可以这样写：

{% highlight javascript %}

$( "#button" ).on( "click", function() {
    var $this = $( this );
});

{% endhighlight %}

这时，this代表这个按钮的DOM对象。但是，如果像下面这样写，就会出错：

{% highlight javascript %}

function f() {
    var $this = $( this );
}

$( "#button" ).on( "click", f );

{% endhighlight %}

这时，this代表全局对象。

为了解决这个问题，可以采用下面的一些方法对this进行绑定，也就是使得this固定指向某个对象，减少编程中的不确定性。

### call方法和apply方法

call方法和apply方法的作用，是指定函数运行的上下文对象。它们接受的第一个参数都是this所要指向的那个对象，如果该参数是null或undefined，则等同于指定全局对象。

{% highlight javascript %}

var n = 123;

var o = { n : 456 };

function a() {
    console.log(this.n);
}

a.call() // 123
a.apply() // 123

a.call(window) // 123
a.apply(window)// 123

a.call(o) // 456
a.apply(o) // 456

a.call(null) // 123
a.apply(null) // 123

{% endhighlight %}

call方法和apply方法的区别在于，call方法除了第一个参数以外，其他参数都会依次传入原函数，而apply方法的第二个参数是一个数组，该数组的所有成员依次作为参数，传入原函数。

因此，上一节按钮点击事件的例子，可以改写成

{% highlight javascript %}

var o = {
	p : 1,
	f : function() { console.log(this.p); } 
}

$( "#button" ).on( "click", o.f.call(o) );

// or

$( "#button" ).on( "click", o.f.apply(o) );

{% endhighlight %}

### bind方法

bind方法则是对原函数绑定上下文以后，返回一个新函数。

{% highlight javascript %}

var o = {
	p : 1,
	f : function() { console.log(this.p); } 
}

$( "#button" ).on( "click", o.f.bind(o) );

{% endhighlight %}

jQuery的$.proxy方法可以起到同样作用，同时对老式浏览器保持兼容。

{% highlight javascript %}

$( "#button" ).on( "click", $.prox（o.f，o) );

{% endhighlight %}

另一种常见的技巧，则是事先在函数体内部将this的值固定。

{% highlight javascript %}

var o = {
	p : 1,
	self : this,
	f : function() { console.log(self.p); } 
}

$( "#button" ).on( "click", o.f );

{% endhighlight %}

## 参考链接

- Jonathan Creamer, [Avoiding the "this" problem in JavaScript](http://tech.pro/tutorial/1192/avoiding-the-this-problem-in-javascript) 

---
title: 面向对象编程概述
layout: page
category: oop
date: 2012-12-28
modifiedOn: 2013-04-06
---

## 什么是“面向对象编程”

“面向对象编程”（Object Oriented Programming，缩写为OOP）是目前主流的编程方法。它的核心思想是将复杂的编程关系，抽象为一个个对象，程序就是对象之间的互动。

每个对象是“属性”（property）与“方法”（method）的封装。所谓“属性”，就是对象的内部变量，保存某种状态；所谓“方法”就是对象的行为，用来完成某种任务。比如，我们可以把动物抽象为animal对象，它的属性记录具体是那一种动物，它的方法表示动物的某种行为（奔跑、捕猎、休息等等）。

“面向对象编程”最大的优点，就是使得程序模块化，容易维护和开发。

本章介绍JavaScript如何进行“面向对象编程”。

## 构造函数

“面向对象编程”的第一步，就是要生成对象。

通常，需要一个模板，对象按照模板的设置进行生成。比如，每一个动物都是一个animal对象，那么就需要有一个模板，规定一些共同的属性和特征，方便animal对象的生成。

在典型的面向对象编程的语言中（比如C++和Java），存在“类”（class）这样一个概念。所谓“类”就是对象的模板，对象就是“类”的实例。JavaScript语言中没有“类”，以构造函数（constructor）作为对象的模板。也就是说，可以用构造函数生成多个相同结构的对象。

所谓“构造函数”，就是可以作为对象模板的函数。它的作用就是生成对象的实例。下面就是一个构造函数：

{% highlight javascript %}

var Vehicle = function() {
	this.price = 1000;
};

{% endhighlight %}

Vehicle是一个函数，提供模板，用来生成车辆对象。它的最大特点就是，函数体内部使用了this关键字。生成对象的时候，必需用new关键字，调用Vehicle函数。

{% highlight javascript %}

var v = new Vehicle();

{% endhighlight %}

new命令的作用，就是让构造函数生成一个对象的实例。此时，构造函数内部的this关键字，就代表被生成的实例对象。this.price表示实例对象有一个price属性，它的值是1000。

以上只是展示，利用构造函数生成对象的简单步骤。下面是详细介绍。

## new命令

使用new命令以后，构造函数会返回一个实例对象。我们可以将其保存在一个变量中。

{% highlight javascript %}

var v = new Vehicle();

v.price
// 1000

{% endhighlight %}

上面的变量v，就是新生成的实例对象。它从构造函数Vehicle继承了price属性。

new命令后面的构造函数可以带括号，也可以不带括号。下面两行代码是等价的。

{% highlight javascript %}

var v = new Vehicle();

var v = new Vehicle;

{% endhighlight %}

构造函数可以带有参数。如果要传入参数，就只有使用第一种表示法了。

{% highlight javascript %}

var Vehicle = function(p) {
	this.price = p;
};

var v = new Vehicle(500);

{% endhighlight %}

## instanceof运算符

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

## call方法和apply方法

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

## bind方法

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

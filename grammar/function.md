---
title: 函数
layout: page
category: grammar
date: 2012-12-15
modifiedOn: 2013-02-06
---

## 参数

函数运行的时候，有时需要提供外部数据，不同的数据会得到不同的结果，这就叫参数。

{% highlight javascript %}

function square(x){
	return x*x;
}

{% endhighlight %}

上式的x就是square函数的参数。每次运行的时候，需要提供这个值，否则得不到结果。

但是，参数不是必需的，Javascript语言允许省略函数。

{% highlight javascript %}

function f(a,b){
	return a;
}

{% endhighlight %}

上面的函数定义了两个参数，但是运行时无论提供多少个参数，JavaScript都不会报错。

{% highlight javascript %}

function f(a,b){
	return a;
}

f(1,2,3)
// 1

f(1)
// 1

f()
// undefined

{% endhighlight %}

但是没有办法只省略前面的参数，不省略后面的参数。

{% highlight javascript %}

function f(a,b){
	return a;
}

f(,1)
// error

{% endhighlight %}

可以通过下面的方法，为参数设置默认值。

{% highlight javascript %}

function f(a){
	a = a || 1;
	return a;
}

{% endhighlight %}

上面代码的||表示“或运算”，如果前一个表达式的布尔值为true，就直接返回前一个值，否则返回后一个值。以下几个表达式的布尔运算都为false，会使得a取到后一个值。

- undefined, null
- false
- +0, -0, NaN
- ""

因此，上面的函数中，你不可能让a等于0或空字符串。

{% highlight javascript %}

function f(a){
	a = a || 1;
	return a;
}

f('')
// 1

f(0)
// 1

{% endhighlight %}

为了避免这个问题，可以采用下面更精确的写法。

{% highlight javascript %}

function f(a){
	(a !== undefined && a != null)?(a = a):(a = 1);
	return a;
}

f('')
// ""

f(0)
// 0

{% endhighlight %}

## arguments对象

JavaScript语言定义了一个arguments对象，用来指代函数运行时的所有参数，arguments[0]就是第一个参数，arguments[1]就是第二个参数，依次类推。这个对象只有在函数体内部，才可以使用。

它的一个用途，就是通过length属性，判断函数调用时到底带几个参数。

{% highlight javascript %}

function f(){
	return arguments.length;
}

f(1,2,3)
// 3

f(1)
// 1

f()
// 0

{% endhighlight %}

## 函数作用域

作用域（scope）指的是变量存在的范围。Javascript只有两种作用域：一种是全局作用域，变量在整个程序中一直存在；另一种是函数作用域，变量只在函数内部存在。

首先，在函数外部声明的变量就是全局变量，它可以在函数内部读取。

{% highlight javascript %}

   var v = 1;

   function f(){
	   console.log(v);
   }

   f()
   // 1

{% endhighlight %}

上面的代码表明，函数f内部可以读取全局变量v。

其次，在函数内部定义的变量，外部无法读取。

{% highlight javascript %}

   function f(){

	   var v = 1;	   
   }

   console.log(v);
   // 显示错误，v未定义

{% endhighlight %}

函数内部定义的变量，会覆盖同名全局变量。

{% highlight javascript %}

   var v = 1; 

   function f(){

	   var v = 2;

	   console.log(v);

   }

   f();
   // 2

   console.log(v);
   // 1

{% endhighlight %}

## call方法

call方法用来指定函数运行的上下文。

{% highlight javascript %}

func.call(context, [arg1], [arg2], ...)

{% endhighlight %}

context参数就是func函数运行的上下文，它可以是全局环境，也可以是一个具体的对象。跟在它后面的参数，就是func运行所需的参数。

{% highlight javascript %}

var x = 1 ;

var o = { x: 2 };

function f(){ console.log(this.x);}

f.call(window)
// 1

f.call(o)
// 2

{% endhighlight %}

上面代码的f函数，如果上下文环境绑定全局环境，x的值就是1；如果绑定对象o，x的值就是2。

如果绑定的上下文环境是undefined或null，JavaScript引擎当作绑定全局环境处理。

{% highlight javascript %}

var x = 1 ;

function f(){ console.log(this.x);}

f.call(null)
// 1

f.call()
// 1

{% endhighlight %}

## apply方法

apply方法与call方法类似，唯一的区别就是除了context参数，它还接受一个数组参数。

{% highlight javascript %}

func.apply(context, [arg1, arg2, ...])

{% endhighlight %}

后面的数组参数，就是func函数运行所需的参数。在call方法中，这些参数必须一个个添加，但是在apply方法中，必须以数组形式添加。下面的例子是一个参数数组的例子。

{% highlight javascript %}

function f(x,y){ console.log(x+y);}

f.call(null,1,1)
// 2

// 改写为apply方法

f.apply(null,[1,1])
// 2

{% endhighlight %}

f函数本来接受两个参数，使用apply方法以后，就变成可以接受一个数组作为参数。利用这一点，可以做一些有趣的应用。比如，JavaScript不提供找出数组最大元素的函数，Math.max方法只能返回它的所有参数的最大值，使用apply方法，就可以返回数组的最大元素。

{% highlight javascript %}

Math.max.apply(null, [10, 2, 4, 15, 9])
// 15

{% endhighlight %}

apply还有一个特点，可以把数组的空元素变成undefined。

{% highlight javascript %}

Array.apply(null, ["a",,"b"])
// [ 'a', undefined, 'b' ]

{% endhighlight %}

这里的差别就是，数组的foreach方法会逃过空元素，但是不会跳过undefined。因此，遍历内部元素的时候，会体现出差别。

使用apply方法的另一个场合是，如果数组的成员也是数组，那么数组对象的concat方法会返回被展开的数组。

{% highlight javascript %}

Array.prototype.concat.apply([], [[1], [2]])
// [1, 2]

Array.prototype.concat.apply([], [[1], 2])
// [1, 2]

{% endhighlight %}

concat方法是定义数组对象上的，所以apply方法的第一个参数必须是数组。另外，这个方法只能展开一层数组。

{% highlight javascript %}

Array.prototype.concat.apply([], [[[1]], [2]])
// [[1], 2]

{% endhighlight %}

## 变量提升（hoisting）

Javascript解释器的工作方式是，先读取全部代码，再进行解释。这样的结果就是，函数体内部的var命令声明的变量，如同在全局作用域下一样，会产生“变量提升”现象：不管在什么位置，变量都会被提升到函数开始处声明。

{% highlight javascript %}

   function foo(x) {
        if (x > 100) {
            var tmp = x - 100;
        }
    }

{% endhighlight %}

上面的代码等同于

{% highlight javascript %}

   function foo(x) {
	   var tmp;
       if (x > 100) {
           tmp = x - 100;
       }
    }

{% endhighlight %}

## 闭包

闭包（closure）就是定义在函数体内部的函数。

{% highlight javascript %}

   function f() {
	   
       var c = function (){}; 

    }

{% endhighlight %}

上面的代码中，c是定义在函数f内部的函数，就是闭包。

闭包的特点在于，c可以读取函数f的内部变量。

{% highlight javascript %}

   function f() {

	   var v = 1;
	   
       var c = function (){
		   return v;
	   }; 

	   return c;

    }

    var o = f();

	o();
	// 1

{% endhighlight %}

原来，在函数f外部，我们是没有办法读取内部变量v的。但是，借助闭包c，可以读到这个变量。

## 立即调用的函数表达式（IIFE）

在Javascript中，一对圆括号“()”是一种运算符，跟在函数名之后，表示调用该函数。比如，print()就表示调用print函数。

有时，我们需要在定义函数之后，立即调用该函数。这时，你不能在函数的定义之后加上圆括号，这会产生语法错误。

{% highlight javascript %}

function(){ /* code */ }();
// SyntaxError: Unexpected token (

{% endhighlight %}

产生这个错误的原因是，Javascript解释器看到function关键字之后，认为后面跟的是函数定义，不应该以圆括号结尾。

解决方法就是让解释器知道，圆括号前面的部分不是函数定义，而是一个表达式，可以对此进行运算。你可以这样写：

{% highlight javascript %}

(function(){ /* code */ }()); 

{% endhighlight %}

也可以这样写：

{% highlight javascript %}

(function(){ /* code */ })(); 

{% endhighlight %}

这两种写法都是以圆括号开头，解释器就会认为后面跟的是一个表示式，而不是函数定义，所以就避免了错误。这就叫做“立即调用的函数表达式”（Immediately-Invoked Function Expression），简称IIFE。

推而广之，任何让解释器以表达式来处理函数定义的方法，都能产生同样的效果，比如下面三种写法。

{% highlight javascript %}

var i = function(){ return 10; }();

true && function(){ /* code */ }();

0, function(){ /* code */ }();

{% endhighlight %}

甚至像这样写

{% highlight javascript %}

!function(){ /* code */ }();

~function(){ /* code */ }();

-function(){ /* code */ }();

+function(){ /* code */ }();

{% endhighlight %}

new关键字也能达到这个效果。

{% highlight javascript %}

new function(){ /* code */ }

new function(){ /* code */ }() // 只有传递参数时，才需要最后那个圆括号。

{% endhighlight %}

通常情况下，只对匿名函数使用这种“立即执行的函数表达式”。它的好处在于，因为调用的时候不必指定函数名，所以避免了污染全局变量。

## 参考链接

- [Immediately-Invoked Function Expression (IIFE)](http://benalman.com/news/2010/11/immediately-invoked-function-expression/)


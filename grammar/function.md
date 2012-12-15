---
title: 函数
layout: page
category: grammar
date: 2012-12-15
modifiedOn: 2012-12-15
---

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


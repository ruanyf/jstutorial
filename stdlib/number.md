---
title: Number对象
layout: page
category: stdlib
date: 2013-03-16
modifiedOn: 2013-03-31
---

## 属性

Number拥有一些特别的属性。

- Number.POSITIVE_INFINITY 正的无限
- Number.NEGATIVE_INFINITY 负的无限
- Number.NaN 表示非数值，被0除就得到这个值

## toString方法

Number对象部署了单独的toString方法，可以接受一个参数，表示将一个数字转化成某个进制的字符串。

{% highlight javascript %}

(10).toString() // "10"

(10).toString(2) // "1010"

(10).toString(8) // "12"

(10).toString(16) // "a"

{% endhighlight %}

之所以要把10放在括号里，是为了表明10是一个单独的数值，后面的点表示调用对象属性。如果不加括号，这个点会被JavaScript引擎解释成小数点，从而报错。

{% highlight javascript %}

10.toString(2) 
// SyntaxError: Unexpected token ILLEGAL

{% endhighlight %}

但是，在10后面加两个点，JavaScript会把第一个点理解成小数点，把第二个点理解成调用对象属性，从而得到正确结果。

{% highlight javascript %}

10..toString(2) 
// "1010"

{% endhighlight %}

这实际上意味着，可以直接对一个小数使用toString方法。

{% highlight javascript %}

10.5.toString() // "10.5"

10.5.toString(2) // "1010.1"

10.5.toString(8) // "12.4"

10.5.toString(16) // "a.8"

{% endhighlight %}
